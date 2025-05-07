import unittest
import json
import os
import sys
from flask import Flask
from rental_system import create_app, RentalSystem
from api_service import setup_api
from autonomous_features import setup_autonomous_features
from security import setup_security
from payment_processor import setup_payment_processor

class TestArtLensAPI(unittest.TestCase):
    def setUp(self):
        """Set up test environment"""
        # Create a test Flask app
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['DATABASE_URL'] = "sqlite:///:memory:"
        
        # Get the rental system
        self.rental_system = self.app.config['RENTAL_SYSTEM']
        
        # Set up API, autonomous features, security, and payment processing
        setup_api(self.app, self.rental_system)
        setup_autonomous_features(self.app, self.rental_system)
        setup_security(self.app, self.rental_system)
        setup_payment_processor(self.app, self.rental_system)
        
        # Create a test client
        self.client = self.app.test_client()
        
        # Create test user
        with self.app.app_context():
            session = self.rental_system.Session()
            user = self.rental_system.User(
                username="testuser",
                email="test@example.com",
                password_hash="password123"
            )
            session.add(user)
            session.commit()
            self.test_user_id = user.id
            session.close()
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'healthy')
    
    def test_user_login(self):
        """Test user login"""
        response = self.client.post('/api/user/login', json={
            'username': 'testuser',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('token', data)
        self.assertEqual(data['username'], 'testuser')
    
    def test_invalid_login(self):
        """Test invalid login credentials"""
        response = self.client.post('/api/user/login', json={
            'username': 'testuser',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)
    
    def test_generate_art(self):
        """Test art generation"""
        # First login to get token
        login_response = self.client.post('/api/user/login', json={
            'username': 'testuser',
            'password': 'password123'
        })
        token = json.loads(login_response.data)['token']
        
        # Generate art
        response = self.client.post('/api/generate-art', 
            json={
                'style': 'geometric',
                'color_palette': 'vibrant',
                'theme': 'nature'
            },
            headers={'Authorization': f'Bearer {token}'}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('id', data)
        self.assertIn('title', data)
        self.assertIn('preview_url', data)
    
    def test_rent_art(self):
        """Test art rental"""
        # First login to get token
        login_response = self.client.post('/api/user/login', json={
            'username': 'testuser',
            'password': 'password123'
        })
        token = json.loads(login_response.data)['token']
        
        # Generate art
        art_response = self.client.post('/api/generate-art', 
            json={
                'style': 'geometric',
                'color_palette': 'vibrant',
                'theme': 'nature'
            },
            headers={'Authorization': f'Bearer {token}'}
        )
        art_id = json.loads(art_response.data)['id']
        
        # Rent art
        response = self.client.post('/api/rent', 
            json={
                'user_id': self.test_user_id,
                'art_id': art_id,
                'duration_days': 7
            },
            headers={'Authorization': f'Bearer {token}'}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('rental_id', data)
        self.assertIn('start_date', data)
        self.assertIn('end_date', data)
        self.assertIn('price', data)
    
    def test_user_rentals(self):
        """Test getting user rentals"""
        # First login to get token
        login_response = self.client.post('/api/user/login', json={
            'username': 'testuser',
            'password': 'password123'
        })
        token = json.loads(login_response.data)['token']
        
        # Generate art and rent it
        art_response = self.client.post('/api/generate-art', 
            json={
                'style': 'geometric',
                'color_palette': 'vibrant',
                'theme': 'nature'
            },
            headers={'Authorization': f'Bearer {token}'}
        )
        art_id = json.loads(art_response.data)['id']
        
        self.client.post('/api/rent', 
            json={
                'user_id': self.test_user_id,
                'art_id': art_id,
                'duration_days': 7
            },
            headers={'Authorization': f'Bearer {token}'}
        )
        
        # Get user rentals
        response = self.client.get('/api/user/rentals',
            headers={'Authorization': f'Bearer {token}'}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)
    
    def test_dynamic_pricing(self):
        """Test dynamic pricing"""
        # Get the dynamic pricing module
        dynamic_pricing = self.app.config['DYNAMIC_PRICING']
        
        # Generate art
        with self.app.app_context():
            art_filename = self.rental_system.generate_art('geometric', 'vibrant', 'nature')
            
            session = self.rental_system.Session()
            new_art = self.rental_system.ArtPiece(
                title="Test Art",
                file_path=art_filename,
                style='geometric',
                color_palette='vibrant',
                theme='nature'
            )
            session.add(new_art)
            session.commit()
            art_id = new_art.id
            session.close()
        
        # Calculate price
        price = dynamic_pricing.calculate_price(art_id, 7)
        
        # Price should be reasonable (base price is 5.0 per day)
        self.assertGreaterEqual(price, 28.0)  # At least 7 days * 5.0 * 0.8 (min multiplier)
        self.assertLessEqual(price, 52.5)     # At most 7 days * 5.0 * 1.5 (max multiplier)
    
    def test_content_curation(self):
        """Test content curation"""
        # Get the content curation module
        content_curation = self.app.config['CONTENT_CURATION']
        
        # Generate art and create rentals
        with self.app.app_context():
            # Create different art styles
            styles = ['geometric', 'pixel', 'gradient']
            art_ids = []
            
            for style in styles:
                art_filename = self.rental_system.generate_art(style, 'vibrant', 'nature')
                
                session = self.rental_system.Session()
                new_art = self.rental_system.ArtPiece(
                    title=f"Test {style.capitalize()} Art",
                    file_path=art_filename,
                    style=style,
                    color_palette='vibrant',
                    theme='nature'
                )
                session.add(new_art)
                session.commit()
                art_ids.append(new_art.id)
                
                # Create rental for this art
                rental = self.rental_system.Rental(
                    user_id=self.test_user_id,
                    art_piece_id=new_art.id,
                    start_date=self.rental_system.datetime.datetime.utcnow(),
                    end_date=self.rental_system.datetime.datetime.utcnow() + self.rental_system.datetime.timedelta(days=7),
                    price=35.0,
                    is_active=True
                )
                session.add(rental)
                session.commit()
                session.close()
        
        # Analyze user preferences
        preferences = content_curation.analyze_user_preferences(self.test_user_id)
        
        # User should have preferences based on rentals
        self.assertIsInstance(preferences, dict)
        self.assertIn('preferred_styles', preferences)
        self.assertGreaterEqual(len(preferences['preferred_styles']), 1)
        
        # Recommend art
        recommendations = content_curation.recommend_art(self.test_user_id, count=2)
        
        # Should get recommendations
        self.assertIsInstance(recommendations, list)
        self.assertGreaterEqual(len(recommendations), 1)
    
    def test_customer_support(self):
        """Test AI customer support"""
        # Get the customer support module
        customer_support = self.app.config['CUSTOMER_SUPPORT']
        
        # Test pricing question
        response = customer_support.get_response("How is the pricing determined?")
        self.assertIn("pricing", response.lower())
        
        # Test rental question
        response = customer_support.get_response("How long can I rent art?")
        self.assertIn("rental", response.lower())
        
        # Test payment question
        response = customer_support.get_response("What payment methods do you accept?")
        self.assertIn("payment", response.lower())
    
    def test_automated_marketing(self):
        """Test automated marketing"""
        # Get the automated marketing module
        automated_marketing = self.app.config['AUTOMATED_MARKETING']
        
        # Generate art
        with self.app.app_context():
            art_filename = self.rental_system.generate_art('geometric', 'vibrant', 'nature')
            
            session = self.rental_system.Session()
            new_art = self.rental_system.ArtPiece(
                title="Test Art",
                file_path=art_filename,
                style='geometric',
                color_palette='vibrant',
                theme='nature'
            )
            session.add(new_art)
            session.commit()
            art_id = new_art.id
            session.close()
        
        # Generate social post
        post = automated_marketing.generate_social_post(art_id)
        
        # Post should contain style and theme
        self.assertIn("Geometric", post)
        self.assertIn("Nature", post)
        self.assertIn("ArtLens.io", post)
        
        # Schedule posts
        posts = automated_marketing.schedule_posts(count=2)
        
        # Should get scheduled posts
        self.assertIsInstance(posts, list)
        self.assertGreaterEqual(len(posts), 1)
        self.assertIn('scheduled_time', posts[0])

if __name__ == '__main__':
    unittest.main()
