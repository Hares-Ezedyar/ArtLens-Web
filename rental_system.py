from flask import Flask
from flask_cors import CORS
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from database.models import Base, User, ArtPiece, Rental, UserPreference, Subscription
import os
import datetime
import json
from art_generator import generate_art

class RentalSystem:
    def __init__(self, app, database_url="sqlite:///./artlens.db"):
        self.app = app
        self.database_url = database_url
        self.setup_database()
        self.func = func  # Expose SQLAlchemy func for queries
        
    def setup_database(self):
        """Initialize database connection and tables"""
        self.engine = create_engine(self.database_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        
        # Storage paths
        self.storage_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "storage")
        if not os.path.exists(self.storage_path):
            os.makedirs(self.storage_path)
    
    # Make models accessible through the rental system
    @property
    def User(self):
        return User
    
    @property
    def ArtPiece(self):
        return ArtPiece
    
    @property
    def Rental(self):
        return Rental
    
    @property
    def UserPreference(self):
        return UserPreference
    
    @property
    def Subscription(self):
        return Subscription
    
    @property
    def datetime(self):
        return datetime

# Create a Flask app and initialize rental system
def create_app():
    app = Flask(__name__)
    CORS(app)
    rental_system = RentalSystem(app)
    app.config['RENTAL_SYSTEM'] = rental_system
    return app
