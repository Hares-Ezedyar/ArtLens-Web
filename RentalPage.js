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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function RentalPage({ apiBaseUrl }) {
  const { artId } = useParams();
  const [artDetails, setArtDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rentalDuration, setRentalDuration] = useState(1);
  const [price, setPrice] = useState(0);
  
  // Fetch art details
  useEffect(() => {
    const fetchArtDetails = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would fetch from the API
        // const response = await axios.get(`${apiBaseUrl}/art/${artId}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock art details
        const styles = ['geometric', 'pixel', 'gradient', 'fractal', 'expressionist'];
        const colorPalettes = ['vibrant', 'pastel', 'monochrome', 'earthy', 'ocean'];
        const themes = ['nature', 'space', 'urban', 'abstract', 'ocean'];
        
        const style = styles[Math.floor(Math.random() * styles.length)];
        const colorPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        const theme = themes[Math.floor(Math.random() * themes.length)];
        
        const mockArtDetails = {
          id: artId,
          title: `${style.charAt(0).toUpperCase() + style.slice(1)} ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
          style,
          color_palette: colorPalette,
          theme,
          preview_url: `https://source.unsplash.com/random?${style},${theme}`,
          base_price: 5.0,
          description: `This unique AI-generated ${style} art piece features a stunning ${colorPalette} color palette with a ${theme} theme. Perfect for digital displays and virtual galleries.`
        };
        
        setArtDetails(mockArtDetails);
        setPrice(mockArtDetails.base_price * rentalDuration);
      } catch (error) {
        console.error('Error fetching art details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtDetails();
  }, [artId]);
  
  // Update price when rental duration changes
  useEffect(() => {
    if (artDetails) {
      setPrice(artDetails.base_price * rentalDuration);
    }
  }, [rentalDuration, artDetails]);
  
  const handleDurationChange = (event, newValue) => {
    setRentalDuration(newValue);
  };
  
  const handleProceedToCheckout = () => {
    // In a real app, this would navigate to checkout with query params
    window.location.href = `/checkout?art_id=${artId}&duration=${rentalDuration}`;
  };
  
  const durationMarks = [
    { value: 1, label: '1 day' },
    { value: 7, label: '7 days' },
    { value: 14, label: '14 days' },
    { value: 30, label: '30 days' }
  ];
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading art details...
        </Typography>
      </Container>
    );
  }
  
  if (!artDetails) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Art Not Found
        </Typography>
        <Typography variant="body1">
          The art piece you're looking for could not be found.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link}
          to="/gallery"
          sx={{ mt: 2 }}
        >
          Back to Gallery
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center">
        Rent Art
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={artDetails.preview_url}
              alt={artDetails.title}
            />
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              {artDetails.title}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {artDetails.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Art Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Style
                  </Typography>
                  <Typography variant="body1">
                    {artDetails.style.charAt(0).toUpperCase() + artDetails.style.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Color Palette
                  </Typography>
                  <Typography variant="body1">
                    {artDetails.color_palette.charAt(0).toUpperCase() + artDetails.color_palette.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Theme
                  </Typography>
                  <Typography variant="body1">
                    {artDetails.theme.charAt(0).toUpperCase() + artDetails.theme.slice(1)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Rental Duration
              </Typography>
              <Slider
                value={rentalDuration}
                onChange={handleDurationChange}
                aria-labelledby="rental-duration-slider"
                step={1}
                marks={durationMarks}
                min={1}
                max={30}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} day${value !== 1 ? 's' : ''}`}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Pricing
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Base Price
                  </Typography>
                  <Typography variant="body1">
                    ${artDetails.base_price.toFixed(2)} / day
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {rentalDuration} day{rentalDuration !== 1 ? 's' : ''}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1 }}>
                <Typography variant="h6">
                  Total: ${price.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Your art will be available immediately after payment and will expire after the rental period.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Similar Art Pieces
        </Typography>
        
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, index) => {
            const style = artDetails.style;
            const theme = artDetails.theme;
            
            return (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://source.unsplash.com/random?${style},${theme},${index}`}
                    alt={`Similar Art ${index + 1}`}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {style.charAt(0).toUpperCase() + style.slice(1)} {theme.charAt(0).toUpperCase() + theme.slice(1)} {index + 1}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/rental/${artDetails.id + index + 1}`}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
}

export default RentalPage;
