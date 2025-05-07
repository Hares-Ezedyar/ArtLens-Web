from flask import Flask
from rental_system import create_app, RentalSystem
from api_service import setup_api
from autonomous_features import setup_autonomous_features
from security import setup_security
from payment_processor import setup_payment_processor

def create_main_app():
    """Create and configure the main application"""
    # Create the Flask application
    app = create_app()
    
    # Get the rental system
    rental_system = app.config['RENTAL_SYSTEM']
    
    # Set up API
    setup_api(app, rental_system)
    
    # Set up autonomous features
    setup_autonomous_features(app, rental_system)
    
    # Set up security
    setup_security(app, rental_system)
    
    # Set up payment processing
    setup_payment_processor(app, rental_system)
    
    return app

if __name__ == '__main__':
    app = create_main_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
