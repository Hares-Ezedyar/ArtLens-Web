import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArtGeneratorPage from './pages/ArtGeneratorPage';
import GalleryPage from './pages/GalleryPage';
import RentalPage from './pages/RentalPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import ApiDocumentation from './pages/ApiDocumentation';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EnhancedArtGeneratorPage from './pages/EnhancedArtGeneratorPage';

function AppRouter() {
  // API base URL
  const apiBaseUrl = 'https://5000-it3pgn3r6cxbw5w1uiv3h-13f789e2.manus.computer';
  
  // Mock user data (in a real app, this would come from authentication)
  const user = {
    id: 1,
    username: 'artlover123',
    email: 'user@example.com'
  };
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<ArtGeneratorPage apiBaseUrl={apiBaseUrl} />} />
        <Route path="/enhanced-generator" element={<EnhancedArtGeneratorPage apiBaseUrl={apiBaseUrl} />} />
        <Route path="/gallery" element={<GalleryPage apiBaseUrl={apiBaseUrl} />} />
        <Route path="/rental/:id" element={<RentalPage apiBaseUrl={apiBaseUrl} user={user} />} />
        <Route path="/checkout" element={<CheckoutPage apiBaseUrl={apiBaseUrl} user={user} />} />
        <Route path="/payment" element={<PaymentPage apiBaseUrl={apiBaseUrl} user={user} />} />
        <Route path="/profile" element={<ProfilePage apiBaseUrl={apiBaseUrl} user={user} />} />
        <Route path="/api-docs" element={<ApiDocumentation apiBaseUrl={apiBaseUrl} />} />
        <Route path="/login" element={<LoginPage apiBaseUrl={apiBaseUrl} />} />
        <Route path="/register" element={<RegisterPage apiBaseUrl={apiBaseUrl} />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
