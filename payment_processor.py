import stripe
from flask import request, jsonify, redirect, url_for
import os
import json

class PaymentProcessor:
    def __init__(self, app, rental_system):
        self.app = app
        self.rental_system = rental_system
        
        # Initialize Stripe with test API key
        # In production, this would be stored securely and loaded from environment variables
        self.stripe_api_key = "sk_test_51NxSaMPLEkEyT3sTk3yT3sTk3yT3sTk3y"
        stripe.api_key = self.stripe_api_key
        
        # Set up webhook secret for verifying webhook events
        # In production, this would be stored securely and loaded from environment variables
        self.webhook_secret = "whsec_saMPLEsaMPLEsaMPLEsaMPLEsaMPLEsaMPLE"
        
        # Set up routes
        self.setup_routes()
    
    def setup_routes(self):
        """Set up payment-related API routes"""
        
        @self.app.route('/api/payment/create-checkout-session', methods=['POST'])
        def create_checkout_session():
            data = request.json
            art_id = data.get('art_id')
            user_id = data.get('user_id')
            duration_days = data.get('duration_days', 1)
            
            if not art_id or not user_id:
                return jsonify({"error": "Missing required parameters"}), 400
            
            # Get art details from database
            session = self.rental_system.Session()
            art = session.query(self.rental_system.ArtPiece).filter(
                self.rental_system.ArtPiece.id == art_id
            ).first()
            
            if not art:
                session.close()
                return jsonify({"error": "Art piece not found"}), 404
            
            # Calculate price (simplified for now)
            base_price = 5.0  # Base price per day in USD
            price = base_price * duration_days
            
            # Create a Stripe Checkout Session
            try:
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[
                        {
                            'price_data': {
                                'currency': 'usd',
                                'product_data': {
                                    'name': f"Art Rental: {art.title}",
                                    'description': f"{duration_days} day rental of {art.style} art in {art.color_palette} colors with {art.theme} theme",
                                    'images': [f"https://example.com/api/art/{art_id}/preview"],  # This would be a real URL in production
                                },
                                'unit_amount': int(price * 100),  # Stripe uses cents
                            },
                            'quantity': 1,
                        }
                    ],
                    mode='payment',
                    success_url=f"https://artlens.io/rental/success?session_id={{CHECKOUT_SESSION_ID}}&art_id={art_id}&user_id={user_id}&duration_days={duration_days}",
                    cancel_url='https://artlens.io/rental/cancel',
                    metadata={
                        'art_id': art_id,
                        'user_id': user_id,
                        'duration_days': duration_days
                    }
                )
                session.close()
                return jsonify({'id': checkout_session.id, 'url': checkout_session.url})
            
            except Exception as e:
                session.close()
                return jsonify({"error": str(e)}), 500
        
        @self.app.route('/api/payment/webhook', methods=['POST'])
        def webhook():
            payload = request.get_data(as_text=True)
            sig_header = request.headers.get('Stripe-Signature')
            
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, self.webhook_secret
                )
            except ValueError as e:
                # Invalid payload
                return jsonify({"error": "Invalid payload"}), 400
            except stripe.error.SignatureVerificationError as e:
                # Invalid signature
                return jsonify({"error": "Invalid signature"}), 400
            
            # Handle the checkout.session.completed event
            if event['type'] == 'checkout.session.completed':
                session = event['data']['object']
                
                # Retrieve metadata
                art_id = session['metadata']['art_id']
                user_id = session['metadata']['user_id']
                duration_days = int(session['metadata']['duration_days'])
                
                # Create the rental in the database
                self._create_rental(art_id, user_id, duration_days)
            
            return jsonify({"status": "success"})
        
        @self.app.route('/api/payment/subscription-plans', methods=['GET'])
        def get_subscription_plans():
            """Return available subscription plans"""
            plans = [
                {
                    "id": "basic",
                    "name": "Basic",
                    "description": "Rent up to 3 art pieces per month",
                    "price": 9.99,
                    "features": [
                        "3 art rentals per month",
                        "24-hour rentals",
                        "Standard resolution"
                    ]
                },
                {
                    "id": "premium",
                    "name": "Premium",
                    "description": "Rent up to 10 art pieces per month",
                    "price": 19.99,
                    "features": [
                        "10 art rentals per month",
                        "Up to 7-day rentals",
                        "High resolution",
                        "Priority customer support"
                    ]
                },
                {
                    "id": "unlimited",
                    "name": "Unlimited",
                    "description": "Unlimited art rentals",
                    "price": 29.99,
                    "features": [
                        "Unlimited art rentals",
                        "Up to 30-day rentals",
                        "Ultra-high resolution",
                        "Premium customer support",
                        "Early access to new styles"
                    ]
                }
            ]
            
            return jsonify(plans)
        
        @self.app.route('/api/payment/create-subscription', methods=['POST'])
        def create_subscription():
            data = request.json
            user_id = data.get('user_id')
            plan_id = data.get('plan_id')
            
            if not user_id or not plan_id:
                return jsonify({"error": "Missing required parameters"}), 400
            
            # Get plan details
            plans = {
                "basic": {"price": 9.99, "name": "Basic"},
                "premium": {"price": 19.99, "name": "Premium"},
                "unlimited": {"price": 29.99, "name": "Unlimited"}
            }
            
            if plan_id not in plans:
                return jsonify({"error": "Invalid plan ID"}), 400
            
            plan = plans[plan_id]
            
            # Create a Stripe Checkout Session for subscription
            try:
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[
                        {
                            'price_data': {
                                'currency': 'usd',
                                'product_data': {
                                    'name': f"ArtLens.io {plan['name']} Subscription",
                                    'description': f"Monthly subscription to ArtLens.io {plan['name']} plan",
                                },
                                'unit_amount': int(plan['price'] * 100),  # Stripe uses cents
                                'recurring': {
                                    'interval': 'month',
                                }
                            },
                            'quantity': 1,
                        }
                    ],
                    mode='subscription',
                    success_url=f"https://artlens.io/subscription/success?session_id={{CHECKOUT_SESSION_ID}}&user_id={user_id}&plan_id={plan_id}",
                    cancel_url='https://artlens.io/subscription/cancel',
                    metadata={
                        'user_id': user_id,
                        'plan_id': plan_id
                    }
                )
                return jsonify({'id': checkout_session.id, 'url': checkout_session.url})
            
            except Exception as e:
                return jsonify({"error": str(e)}), 500
    
    def _create_rental(self, art_id, user_id, duration_days):
        """Create a rental after successful payment"""
        session = self.rental_system.Session()
        
        # Calculate rental period
        start_date = datetime.datetime.utcnow()
        end_date = start_date + datetime.timedelta(days=duration_days)
        
        # Calculate price (simplified for now)
        base_price = 5.0  # Base price per day
        price = base_price * duration_days
        
        # Create rental
        new_rental = self.rental_system.Rental(
            user_id=user_id,
            art_piece_id=art_id,
            start_date=start_date,
            end_date=end_date,
            price=price,
            is_active=True
        )
        
        session.add(new_rental)
        session.commit()
        session.close()
        
        return True

# Function to initialize payment processor
def setup_payment_processor(app, rental_system):
    return PaymentProcessor(app, rental_system)
