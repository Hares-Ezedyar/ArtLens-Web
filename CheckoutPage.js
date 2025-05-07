import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

function CheckoutPage() {
  // State for checkout
  const [artDetails, setArtDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get art details and rental parameters from URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const artId = urlParams.get('art_id');
    const duration = urlParams.get('duration') || 1;
    
    if (artId) {
      fetchArtDetails(artId, duration);
    }
  }, []);
  
  // Fetch art details
  const fetchArtDetails = async (artId, duration) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to get art details
      // For now, we'll simulate it with mock data
      setArtDetails({
        id: artId,
        title: "Sample Art Piece",
        previewUrl: `${API_BASE_URL}/art/${artId}/preview`,
        price: 5 * duration,
        duration: duration
      });
    } catch (error) {
      console.error('Error fetching art details:', error);
      setError('Unable to load art details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle checkout
  const handleCheckout = async () => {
    if (!artDetails) return;
    
    setLoading(true);
    try {
      // Mock user ID (in a real app, this would come from authentication)
      const userId = 1;
      
      const response = await axios.post(`${API_BASE_URL}/payment/create-checkout-session`, {
        art_id: artDetails.id,
        user_id: userId,
        duration_days: artDetails.duration
      });
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('There was an error processing your payment. Please try again.');
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Close the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  if (loading && !artDetails) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading checkout information...
        </Typography>
      </Container>
    );
  }
  
  if (error && !artDetails) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          href="/"
        >
          Return to Gallery
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Checkout
      </Typography>
      
      {artDetails && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={artDetails.previewUrl}
                alt={artDetails.title}
              />
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {artDetails.title}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  Rental Duration: {artDetails.duration} {artDetails.duration === 1 ? 'day' : 'days'}
                </Typography>
                
                <Typography variant="h6" color="primary" gutterBottom>
                  Total: ${artDetails.price.toFixed(2)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Your art will be available immediately after payment and will expire after the rental period.
                </Typography>
              </CardContent>
              
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Proceed to Payment'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Dialog for errors */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          Payment Error
        </DialogTitle>
        <DialogContent>
          <Typography>
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CheckoutPage;
