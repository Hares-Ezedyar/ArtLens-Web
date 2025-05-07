import os
import json
import datetime
from flask import Blueprint, request, jsonify, current_app
from flask_cors import CORS
from functools import wraps
import secrets
import hashlib

# API Blueprint
api_blueprint = Blueprint('api', __name__)
CORS(api_blueprint)

# API key storage (in production, this would be in a database)
API_KEYS = {}

# API rate limiting (in production, this would use Redis or similar)
RATE_LIMITS = {
    'free': 100,  # requests per day
    'basic': 1000,
    'premium': 10000,
    'enterprise': float('inf')
}

# Request counters (in production, this would be in a database)
REQUEST_COUNTERS = {}

# Decorator for API key authentication
def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Missing or invalid API key"}), 401
        
        api_key = auth_header.split('Bearer ')[1]
        
        if api_key not in API_KEYS:
            return jsonify({"error": "Invalid API key"}), 401
        
        # Check rate limit
        user_id = API_KEYS[api_key]['user_id']
        tier = API_KEYS[api_key]['tier']
        
        # Initialize counter if not exists
        today = datetime.datetime.utcnow().strftime('%Y-%m-%d')
        if user_id not in REQUEST_COUNTERS:
            REQUEST_COUNTERS[user_id] = {}
        if today not in REQUEST_COUNTERS[user_id]:
            REQUEST_COUNTERS[user_id][today] = 0
        
        # Check if rate limit exceeded
        if REQUEST_COUNTERS[user_id][today] >= RATE_LIMITS[tier]:
            return jsonify({"error": "Rate limit exceeded"}), 429
        
        # Increment counter
        REQUEST_COUNTERS[user_id][today] += 1
        
        return f(*args, **kwargs)
    return decorated_function

# API routes
@api_blueprint.route('/generate-key', methods=['POST'])
def generate_api_key():
    data = request.json
    user_id = data.get('user_id')
    tier = data.get('tier', 'free')
    
    if not user_id:
        return jsonify({"error": "Missing user ID"}), 400
    
    if tier not in RATE_LIMITS:
        return jsonify({"error": "Invalid tier"}), 400
    
    # Generate a new API key
    api_key = 'art_' + secrets.token_hex(16)
    
    # Store the API key
    API_KEYS[api_key] = {
        'user_id': user_id,
        'tier': tier,
        'created_at': datetime.datetime.utcnow().isoformat()
    }
    
    return jsonify({
        "api_key": api_key,
        "tier": tier,
        "rate_limit": RATE_LIMITS[tier]
    })

@api_blueprint.route('/art/<int:art_id>', methods=['GET'])
@require_api_key
def get_art(art_id):
    # Get the rental system from the app
    rental_system = current_app.config['RENTAL_SYSTEM']
    
    session = rental_system.Session()
    art = session.query(rental_system.ArtPiece).filter(rental_system.ArtPiece.id == art_id).first()
    
    if not art:
        session.close()
        return jsonify({"error": "Art piece not found"}), 404
    
    result = {
        "id": art.id,
        "title": art.title,
        "style": art.style,
        "color_palette": art.color_palette,
        "theme": art.theme,
        "created_at": art.created_at.isoformat(),
        "preview_url": f"/api/art/{art.id}/preview"
    }
    
    session.close()
    return jsonify(result)

@api_blueprint.route('/generate-art', methods=['POST'])
@require_api_key
def api_generate_art():
    # Get the rental system from the app
    rental_system = current_app.config['RENTAL_SYSTEM']
    
    data = request.json
    style = data.get('style', 'abstract')
    color_palette = data.get('color_palette', 'vibrant')
    theme = data.get('theme', 'nature')
    
    # Generate art using the AI model
    art_filename = rental_system.generate_art(style, color_palette, theme)
    
    # Create database entry
    session = rental_system.Session()
    new_art = rental_system.ArtPiece(
        title=f"{style.capitalize()} {theme.capitalize()}",
        file_path=art_filename,
        style=style,
        color_palette=color_palette,
        theme=theme
    )
    session.add(new_art)
    session.commit()
    art_id = new_art.id
    session.close()
    
    return jsonify({
        "id": art_id,
        "title": new_art.title,
        "preview_url": f"/api/art/{art_id}/preview"
    })

@api_blueprint.route('/rent', methods=['POST'])
@require_api_key
def api_rent_art():
    # Get the rental system from the app
    rental_system = current_app.config['RENTAL_SYSTEM']
    
    data = request.json
    user_id = data.get('user_id')
    art_id = data.get('art_id')
    duration_days = data.get('duration_days', 1)
    
    if not user_id or not art_id:
        return jsonify({"error": "Missing required parameters"}), 400
    
    session = rental_system.Session()
    art = session.query(rental_system.ArtPiece).filter(rental_system.ArtPiece.id == art_id).first()
    user = session.query(rental_system.User).filter(rental_system.User.id == user_id).first()
    
    if not art or not user:
        session.close()
        return jsonify({"error": "Art or user not found"}), 404
    
    # Calculate rental period
    start_date = datetime.datetime.utcnow()
    end_date = start_date + datetime.timedelta(days=duration_days)
    
    # Calculate price (simplified for now)
    base_price = 5.0  # Base price per day
    price = base_price * duration_days
    
    # Create rental
    new_rental = rental_system.Rental(
        user_id=user_id,
        art_piece_id=art_id,
        start_date=start_date,
        end_date=end_date,
        price=price,
        is_active=True
    )
    
    session.add(new_rental)
    session.commit()
    rental_id = new_rental.id
    session.close()
    
    return jsonify({
        "rental_id": rental_id,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "price": price
    })

@api_blueprint.route('/user/rentals', methods=['GET'])
@require_api_key
def api_get_user_rentals():
    # Get the rental system from the app
    rental_system = current_app.config['RENTAL_SYSTEM']
    
    # Get user ID from API key
    auth_header = request.headers.get('Authorization')
    api_key = auth_header.split('Bearer ')[1]
    user_id = API_KEYS[api_key]['user_id']
    
    session = rental_system.Session()
    rentals = session.query(rental_system.Rental).filter(
        rental_system.Rental.user_id == user_id,
        rental_system.Rental.is_active == True
    ).all()
    
    result = []
    for rental in rentals:
        art = session.query(rental_system.ArtPiece).filter(rental_system.ArtPiece.id == rental.art_piece_id).first()
        
        # Calculate remaining time
        now = datetime.datetime.utcnow()
        remaining_time = rental.end_date - now
        remaining_hours = max(0, int(remaining_time.total_seconds() / 3600))
        
        result.append({
            "id": rental.id,
            "title": art.title if art else "Unknown Art",
            "previewUrl": f"/api/art/{art.id}/preview" if art else None,
            "startDate": rental.start_date.isoformat(),
            "endDate": rental.end_date.isoformat(),
            "remainingHours": remaining_hours,
            "price": rental.price
        })
    
    session.close()
    return jsonify(result)

# Function to initialize API blueprint
def setup_api(app, rental_system):
    app.config['RENTAL_SYSTEM'] = rental_system
    app.register_blueprint(api_blueprint, url_prefix='/api')
    return api_blueprint
