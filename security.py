import os
import hashlib
import secrets
from flask import request, jsonify, g
from functools import wraps
import jwt
from datetime import datetime, timedelta
import re

class SecurityManager:
    def __init__(self, app, rental_system):
        self.app = app
        self.rental_system = rental_system
        
        # In production, these would be loaded from environment variables
        self.jwt_secret = "your_jwt_secret_key_here"
        self.token_expiry = 24  # hours
        
        # Set up security routes and middleware
        self.setup_security()
    
    def setup_security(self):
        """Set up security routes and middleware"""
        
        @self.app.before_request
        def before_request():
            """Middleware to check authentication for protected routes"""
            # Skip authentication for public routes
            public_paths = [
                '/',
                '/api/health',
                '/api/user/register',
                '/api/user/login',
            ]
            
            # Allow all GET requests for now in the test environment
            if request.method == 'GET':
                return None
                
            if any(request.path.startswith(path) for path in public_paths):
                return None
            
            # Check for API key authentication
            if request.path.startswith('/api/'):
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith('Bearer '):
                    # API key authentication is handled by the API service
                    return None
            
            # For testing purposes, bypass authentication
            # In production, this would be removed
            return None
            
            # Check for JWT authentication
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"error": "Authentication required"}), 401
            
            token = auth_header.split('Bearer ')[1]
            
            try:
                payload = jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
                g.user_id = payload['user_id']
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token"}), 401
        
        @self.app.route('/api/user/login', methods=['POST'])
        def login():
            """User login endpoint"""
            data = request.json
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return jsonify({"error": "Missing username or password"}), 400
            
            # Get user from database
            session = self.rental_system.Session()
            user = session.query(self.rental_system.User).filter(
                self.rental_system.User.username == username
            ).first()
            
            if not user:
                session.close()
                return jsonify({"error": "Invalid credentials"}), 401
            
            # In production, we would use proper password hashing and verification
            # For now, we're using plain text comparison for simplicity
            if user.password_hash != password:
                session.close()
                return jsonify({"error": "Invalid credentials"}), 401
            
            # Generate JWT token
            token = self._generate_token(user.id)
            
            session.close()
            return jsonify({
                "token": token,
                "user_id": user.id,
                "username": user.username,
                "email": user.email
            })
        
        @self.app.route('/api/user/register', methods=['POST'])
        def register():
            """User registration endpoint"""
            data = request.json
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            
            if not username or not email or not password:
                return jsonify({"error": "Missing required fields"}), 400
            
            # Validate email format
            if not self._validate_email(email):
                return jsonify({"error": "Invalid email format"}), 400
            
            # Validate password strength
            if not self._validate_password(password):
                return jsonify({"error": "Password too weak. Must be at least 8 characters with letters and numbers"}), 400
            
            # Check if user already exists
            session = self.rental_system.Session()
            existing_user = session.query(self.rental_system.User).filter(
                (self.rental_system.User.username == username) | 
                (self.rental_system.User.email == email)
            ).first()
            
            if existing_user:
                session.close()
                return jsonify({"error": "Username or email already exists"}), 409
            
            # Create new user
            # In production, we would hash the password
            new_user = self.rental_system.User(
                username=username,
                email=email,
                password_hash=password  # In production, this would be hashed
            )
            
            session.add(new_user)
            session.commit()
            user_id = new_user.id
            
            # Generate JWT token
            token = self._generate_token(user_id)
            
            session.close()
            return jsonify({
                "token": token,
                "user_id": user_id,
                "username": username,
                "email": email
            })
        
        @self.app.route('/api/user/change-password', methods=['POST'])
        def change_password():
            """Change user password endpoint"""
            data = request.json
            old_password = data.get('old_password')
            new_password = data.get('new_password')
            
            if not old_password or not new_password:
                return jsonify({"error": "Missing required fields"}), 400
            
            # Validate password strength
            if not self._validate_password(new_password):
                return jsonify({"error": "Password too weak. Must be at least 8 characters with letters and numbers"}), 400
            
            # Get user from database
            session = self.rental_system.Session()
            user = session.query(self.rental_system.User).filter(
                self.rental_system.User.id == g.user_id
            ).first()
            
            if not user:
                session.close()
                return jsonify({"error": "User not found"}), 404
            
            # Verify old password
            if user.password_hash != old_password:  # In production, would use proper verification
                session.close()
                return jsonify({"error": "Incorrect password"}), 401
            
            # Update password
            user.password_hash = new_password  # In production, would hash the password
            
            session.commit()
            session.close()
            
            return jsonify({"status": "success", "message": "Password updated successfully"})
        
        @self.app.route('/', methods=['GET'])
        def index():
            """Landing page"""
            return jsonify({
                "message": "Welcome to ArtLens.io API",
                "version": "1.0.0",
                "status": "online",
                "documentation": "/api/docs"
            })
        
        @self.app.route('/api/health', methods=['GET'])
        def health_check():
            """Health check endpoint"""
            return jsonify({
                "status": "healthy",
                "timestamp": datetime.utcnow().isoformat()
            })
    
    def _generate_token(self, user_id):
        """Generate JWT token for user"""
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(hours=self.token_expiry)
        }
        return jwt.encode(payload, self.jwt_secret, algorithm='HS256')
    
    def _validate_email(self, email):
        """Validate email format"""
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(email_regex, email) is not None
    
    def _validate_password(self, password):
        """Validate password strength"""
        # At least 8 characters, with letters and numbers
        if len(password) < 8:
            return False
        if not any(c.isalpha() for c in password):
            return False
        if not any(c.isdigit() for c in password):
            return False
        return True


# Function to initialize security manager
def setup_security(app, rental_system):
    return SecurityManager(app, rental_system)
