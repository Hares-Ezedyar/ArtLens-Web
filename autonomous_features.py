import numpy as np
import pandas as pd
import datetime
import json
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

class DynamicPricing:
    def __init__(self, rental_system):
        self.rental_system = rental_system
        self.base_price = 5.0  # Base price per day
        self.model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
        
        if not os.path.exists(self.model_path):
            os.makedirs(self.model_path)
        
        self.price_model_path = os.path.join(self.model_path, "price_model.joblib")
        self.scaler_path = os.path.join(self.model_path, "price_scaler.joblib")
        
        # Initialize or load model
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize pricing model or load existing one"""
        if os.path.exists(self.price_model_path) and os.path.exists(self.scaler_path):
            self.model = joblib.load(self.price_model_path)
            self.scaler = joblib.load(self.scaler_path)
        else:
            # Create a simple initial model
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.scaler = StandardScaler()
            
            # Train with some initial data
            self._train_initial_model()
    
    def _train_initial_model(self):
        """Train the model with initial synthetic data"""
        # Create synthetic data for initial training
        np.random.seed(42)
        n_samples = 1000
        
        # Features: style_code, color_palette_code, theme_code, popularity, complexity, demand
        X = np.random.rand(n_samples, 6)
        
        # Target: price multiplier (0.8 to 1.5 of base price)
        y = 0.8 + 0.7 * np.random.rand(n_samples)
        
        # Add some patterns to the data
        # Higher demand -> higher price
        y += 0.3 * X[:, 5]
        # Higher popularity -> higher price
        y += 0.2 * X[:, 3]
        # Higher complexity -> higher price
        y += 0.1 * X[:, 4]
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model.fit(X_scaled, y)
        
        # Save model and scaler
        joblib.dump(self.model, self.price_model_path)
        joblib.dump(self.scaler, self.scaler_path)
    
    def _get_art_features(self, art_id):
        """Extract features for an art piece"""
        session = self.rental_system.Session()
        art = session.query(self.rental_system.ArtPiece).filter(
            self.rental_system.ArtPiece.id == art_id
        ).first()
        
        if not art:
            session.close()
            return None
        
        # Get rental count for popularity
        rental_count = session.query(self.rental_system.Rental).filter(
            self.rental_system.Rental.art_piece_id == art_id
        ).count()
        
        # Map categorical features to numeric values
        style_map = {
            'geometric': 0.1,
            'pixel': 0.2,
            'gradient': 0.3,
            'fractal': 0.4,
            'expressionist': 0.5
        }
        
        color_map = {
            'vibrant': 0.1,
            'pastel': 0.2,
            'monochrome': 0.3,
            'earthy': 0.4,
            'ocean': 0.5
        }
        
        theme_map = {
            'nature': 0.1,
            'space': 0.2,
            'urban': 0.3,
            'abstract': 0.4,
            'ocean': 0.5
        }
        
        # Calculate complexity based on style
        complexity_map = {
            'geometric': 0.3,
            'pixel': 0.4,
            'gradient': 0.2,
            'fractal': 0.8,
            'expressionist': 0.6
        }
        
        # Calculate current demand (simplified)
        # In a real system, this would be based on recent views, searches, etc.
        current_hour = datetime.datetime.now().hour
        # Assume higher demand in evenings
        time_factor = 0.5 + 0.5 * (current_hour >= 17 and current_hour <= 23)
        # Assume higher demand for certain styles
        style_demand = 0.7 if art.style in ['fractal', 'expressionist'] else 0.3
        demand = (time_factor + style_demand) / 2
        
        # Create feature vector
        style_code = style_map.get(art.style, 0.0)
        color_code = color_map.get(art.color_palette, 0.0)
        theme_code = theme_map.get(art.theme, 0.0)
        popularity = min(1.0, rental_count / 10)  # Normalize to 0-1
        complexity = complexity_map.get(art.style, 0.5)
        
        features = np.array([[
            style_code,
            color_code,
            theme_code,
            popularity,
            complexity,
            demand
        ]])
        
        session.close()
        return features
    
    def calculate_price(self, art_id, duration_days):
        """Calculate dynamic price for an art rental"""
        features = self._get_art_features(art_id)
        
        if features is None:
            # If art not found, return base price
            return self.base_price * duration_days
        
        # Scale features
        features_scaled = self.scaler.transform(features)
        
        # Predict price multiplier
        price_multiplier = self.model.predict(features_scaled)[0]
        
        # Ensure multiplier is within reasonable bounds
        price_multiplier = max(0.8, min(1.5, price_multiplier))
        
        # Calculate final price
        price = self.base_price * price_multiplier * duration_days
        
        # Round to 2 decimal places
        return round(price, 2)
    
    def update_model(self, rental_data):
        """Update the pricing model with new rental data"""
        # In a real system, this would be called periodically with new data
        # For now, we'll just simulate it
        
        # Extract features and targets from rental data
        X = []
        y = []
        
        for rental in rental_data:
            features = self._get_art_features(rental['art_id'])
            if features is not None:
                X.append(features[0])
                # Target is the actual price divided by (base_price * duration)
                price_multiplier = rental['price'] / (self.base_price * rental['duration_days'])
                y.append(price_multiplier)
        
        if not X:
            return False
        
        X = np.array(X)
        y = np.array(y)
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Update model (partial_fit would be better but RandomForest doesn't support it)
        # In a real system, we would use incremental learning or retrain periodically
        self.model.fit(X_scaled, y)
        
        # Save updated model
        joblib.dump(self.model, self.price_model_path)
        
        return True


class ContentCurationAI:
    def __init__(self, rental_system):
        self.rental_system = rental_system
        self.model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
        
        if not os.path.exists(self.model_path):
            os.makedirs(self.model_path)
    
    def analyze_user_preferences(self, user_id):
        """Analyze user preferences based on rental history"""
        session = self.rental_system.Session()
        
        # Get user's rental history
        rentals = session.query(self.rental_system.Rental).filter(
            self.rental_system.Rental.user_id == user_id
        ).all()
        
        if not rentals:
            session.close()
            return {
                'preferred_styles': [],
                'preferred_color_palettes': [],
                'preferred_themes': []
            }
        
        # Count occurrences of each style, color palette, and theme
        styles = {}
        color_palettes = {}
        themes = {}
        
        for rental in rentals:
            art = session.query(self.rental_system.ArtPiece).filter(
                self.rental_system.ArtPiece.id == rental.art_piece_id
            ).first()
            
            if art:
                styles[art.style] = styles.get(art.style, 0) + 1
                color_palettes[art.color_palette] = color_palettes.get(art.color_palette, 0) + 1
                themes[art.theme] = themes.get(art.theme, 0) + 1
        
        # Sort by count and get top preferences
        preferred_styles = sorted(styles.items(), key=lambda x: x[1], reverse=True)
        preferred_color_palettes = sorted(color_palettes.items(), key=lambda x: x[1], reverse=True)
        preferred_themes = sorted(themes.items(), key=lambda x: x[1], reverse=True)
        
        # Get top 3 or fewer if not enough data
        preferred_styles = [s[0] for s in preferred_styles[:3]]
        preferred_color_palettes = [c[0] for c in preferred_color_palettes[:3]]
        preferred_themes = [t[0] for t in preferred_themes[:3]]
        
        # Update user preferences in database
        preferences = session.query(self.rental_system.UserPreference).filter(
            self.rental_system.UserPreference.user_id == user_id
        ).first()
        
        if preferences:
            preferences.preferred_styles = ','.join(preferred_styles)
            preferences.preferred_color_palettes = ','.join(preferred_color_palettes)
            preferences.preferred_themes = ','.join(preferred_themes)
        else:
            preferences = self.rental_system.UserPreference(
                user_id=user_id,
                preferred_styles=','.join(preferred_styles),
                preferred_color_palettes=','.join(preferred_color_palettes),
                preferred_themes=','.join(preferred_themes)
            )
            session.add(preferences)
        
        session.commit()
        session.close()
        
        return {
            'preferred_styles': preferred_styles,
            'preferred_color_palettes': preferred_color_palettes,
            'preferred_themes': preferred_themes
        }
    
    def recommend_art(self, user_id, count=3):
        """Recommend art pieces based on user preferences"""
        # Get user preferences
        preferences = self.analyze_user_preferences(user_id)
        
        if not any([preferences['preferred_styles'], 
                   preferences['preferred_color_palettes'], 
                   preferences['preferred_themes']]):
            # If no preferences, return random art
            return self._get_random_art(count)
        
        session = self.rental_system.Session()
        
        # Build query based on preferences
        query = session.query(self.rental_system.ArtPiece)
        
        # Filter by user's preferred styles, color palettes, and themes
        if preferences['preferred_styles']:
            query = query.filter(self.rental_system.ArtPiece.style.in_(preferences['preferred_styles']))
        
        if preferences['preferred_color_palettes']:
            query = query.filter(self.rental_system.ArtPiece.color_palette.in_(preferences['preferred_color_palettes']))
        
        if preferences['preferred_themes']:
            query = query.filter(self.rental_system.ArtPiece.theme.in_(preferences['preferred_themes']))
        
        # Get results
        art_pieces = query.limit(count).all()
        
        # If not enough results, get random art to fill
        if len(art_pieces) < count:
            random_art = self._get_random_art(count - len(art_pieces))
            art_pieces.extend(random_art)
        
        # Format results
        results = []
        for art in art_pieces:
            results.append({
                'id': art.id,
                'title': art.title,
                'style': art.style,
                'color_palette': art.color_palette,
                'theme': art.theme,
                'preview_url': f"/api/art/{art.id}/preview"
            })
        
        session.close()
        return results
    
    def _get_random_art(self, count):
        """Get random art pieces"""
        session = self.rental_system.Session()
        art_pieces = session.query(self.rental_system.ArtPiece).order_by(
            self.rental_system.func.random()
        ).limit(count).all()
        session.close()
        return art_pieces


class AICustomerSupport:
    def __init__(self):
        # In a real system, this would use a more sophisticated NLP model
        self.faqs = {
            'pricing': [
                "How is pricing determined?",
                "What affects the price?",
                "Why do prices change?"
            ],
            'rental': [
                "How do rentals work?",
                "How long can I rent art?",
                "What happens when rental expires?"
            ],
            'payment': [
                "What payment methods are accepted?",
                "Is my payment information secure?",
                "How do I cancel a subscription?"
            ],
            'art': [
                "How is the art generated?",
                "Can I request specific art?",
                "Who owns the copyright?"
            ],
            'account': [
                "How do I create an account?",
                "How do I reset my password?",
                "Can I delete my account?"
            ]
        }
        
        self.responses = {
            'pricing': "Our pricing is dynamic and based on factors like art style, complexity, and demand. Prices may vary throughout the day as demand changes. We offer subscription plans for frequent users that provide better value.",
            'rental': "Rentals work by giving you temporary access to digital art for a specified period (1-30 days). When your rental expires, the art will no longer be accessible. You can extend your rental before it expires if you wish to keep the art longer.",
            'payment': "We accept all major credit cards through our secure payment processor, Stripe. Your payment information is encrypted and never stored on our servers. You can cancel a subscription anytime from your account settings page.",
            'art': "Our art is generated using AI algorithms including GANs and style transfer techniques. Each piece is unique and generated specifically for your rental. While you can specify style, colors, and themes, exact designs cannot be requested. You have a license to display the art during your rental period, but ArtLens.io retains copyright.",
            'account': "Creating an account is free and only requires an email address and password. If you forget your password, you can reset it using the 'Forgot Password' link on the login page. You can delete your account at any time from your account settings page."
        }
    
    def get_response(self, query):
        """Get a response to a customer query"""
        query = query.lower()
        
        # Find the most relevant category
        best_category = None
        best_score = 0
        
        for category, questions in self.faqs.items():
            for question in questions:
                # Simple word matching score
                score = self._calculate_similarity(query, question.lower())
                if score > best_score:
                    best_score = score
                    best_category = category
        
        # If no good match, return general response
        if best_score < 0.3:
            return "I'm not sure I understand your question. Please try rephrasing or contact our support team for assistance."
        
        return self.responses[best_category]
    
    def _calculate_similarity(self, query, question):
        """Calculate simple word overlap similarity between query and question"""
        query_words = set(query.split())
        question_words = set(question.split())
        
        intersection = query_words.intersection(quest
(Content truncated due to size limit. Use line ranges to read in chunks)