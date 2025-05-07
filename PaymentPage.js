import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

function PaymentPage() {
  // State for subscription plans
  const [plans, setPlans] = useState([
    {
      id: "basic",
      name: "Basic",
      description: "Rent up to 3 art pieces per month",
      price: 9.99,
      features: [
        "3 art rentals per month",
        "24-hour rentals",
        "Standard resolution"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      description: "Rent up to 10 art pieces per month",
      price: 19.99,
      features: [
        "10 art rentals per month",
        "Up to 7-day rentals",
        "High resolution",
        "Priority customer support"
      ]
    },
    {
      id: "unlimited",
      name: "Unlimited",
      description: "Unlimited art rentals",
      price: 29.99,
      features: [
        "Unlimited art rentals",
        "Up to 30-day rentals",
        "Ultra-high resolution",
        "Premium customer support",
        "Early access to new styles"
      ]
    }
  ]);
  
  // State for UI
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  
  // Mock user ID (in a real app, this would come from authentication)
  const userId = 1;
  
  // Handle subscription checkout
  const handleSubscribe = async (planId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/create-subscription`, {
        user_id: userId,
        plan_id: planId
      });
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
      
    } catch (error) {
      console.error('Error creating subscription:', error);
      setDialogMessage('There was an error processing your subscription request. Please try again.');
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Close the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Subscription Plans
      </Typography>
      
      <Typography variant="body1" paragraph align="center">
        Choose a subscription plan to enjoy unlimited access to our ephemeral digital art collection.
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {plan.name}
                </Typography>
                
                <Typography variant="h4" color="primary" gutterBottom>
                  ${plan.price}
                  <Typography variant="caption" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {plan.description}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  {plan.features.map((feature, index) => (
                    <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                      ✓ {feature}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
              
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Subscribe'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Individual Rentals
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          Not ready for a subscription? You can still rent individual art pieces.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            href="/"
          >
            Browse Art Gallery
          </Button>
        </Box>
      </Box>
      
      {/* Dialog for errors */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          Payment Information
        </DialogTitle>
        <DialogContent>
          <Typography>
            {dialogMessage}
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

export default PaymentPage;
