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
  Paper,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage() {
  const [featuredArt, setFeaturedArt] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Mock featured art for demonstration
  useEffect(() => {
    // In a real app, this would fetch from the API
    const mockFeaturedArt = [
      {
        id: 1,
        title: "Geometric Vibrant Nature",
        style: "geometric",
        color_palette: "vibrant",
        theme: "nature",
        preview_url: "/static/images/art1.jpg"
      },
      {
        id: 2,
        title: "Pixel Pastel Space",
        style: "pixel",
        color_palette: "pastel",
        theme: "space",
        preview_url: "/static/images/art2.jpg"
      },
      {
        id: 3,
        title: "Gradient Ocean Waves",
        style: "gradient",
        color_palette: "ocean",
        theme: "ocean",
        preview_url: "/static/images/art3.jpg"
      },
      {
        id: 4,
        title: "Fractal Abstract Patterns",
        style: "fractal",
        color_palette: "monochrome",
        theme: "abstract",
        preview_url: "/static/images/art4.jpg"
      }
    ];
    
    setTimeout(() => {
      setFeaturedArt(mockFeaturedArt);
      setLoading(false);
    }, 1000);
  }, []);
  
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper 
        sx={{ 
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?digital,art)',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            p: { xs: 3, md: 6 },
            textAlign: 'center'
          }}
        >
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            Ephemeral Digital Art
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            Discover, rent, and experience unique AI-generated art pieces
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={Link}
            to="/create"
            sx={{ mt: 2 }}
          >
            Create Your Art
          </Button>
        </Box>
      </Paper>
      
      {/* Featured Art Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Featured Art
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {featuredArt.map((art) => (
              <Grid item key={art.id} xs={12} sm={6} md={3}>
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
                    component="div"
                    sx={{
                      pt: '100%',
                      backgroundColor: 'grey.200'
                    }}
                    image={`https://source.unsplash.com/random?${art.style},${art.theme}`}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {art.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Style: {art.style.charAt(0).toUpperCase() + art.style.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Palette: {art.color_palette.charAt(0).toUpperCase() + art.color_palette.slice(1)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/rental/${art.id}`}
                    >
                      Rent Now
                    </Button>
                    <Button size="small">Preview</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      {/* How It Works Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          How It Works
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              >
                1
              </Box>
              <Typography variant="h5" gutterBottom>
                Create
              </Typography>
              <Typography variant="body1">
                Generate unique AI art by selecting style, colors, and theme preferences
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              >
                2
              </Box>
              <Typography variant="h5" gutterBottom>
                Rent
              </Typography>
              <Typography variant="body1">
                Choose your rental duration and complete the secure payment process
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              >
                3
              </Box>
              <Typography variant="h5" gutterBottom>
                Experience
              </Typography>
              <Typography variant="body1">
                Enjoy your exclusive digital art for the rental period on any device
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Subscription Plans Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Subscription Plans
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Basic
                </Typography>
                
                <Typography variant="h4" color="primary" gutterBottom>
                  $9.99
                  <Typography variant="caption" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Rent up to 3 art pieces per month
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ 3 art rentals per month
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ 24-hour rentals
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ Standard resolution
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  component={Link}
                  to="/payment"
                >
                  Subscribe
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: '2px solid',
                borderColor: 'primary.main',
                transform: 'scale(1.05)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Premium
                </Typography>
                
                <Typography variant="h4" color="primary" gutterBottom>
                  $19.99
                  <Typography variant="caption" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Rent up to 10 art pieces per month
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ 10 art rentals per month
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ Up to 7-day rentals
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ High resolution
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ Priority customer support
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  component={Link}
                  to="/payment"
                >
                  Subscribe
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Unlimited
                </Typography>
                
                <Typography variant="h4" color="primary" gutterBottom>
                  $29.99
                  <Typography variant="caption" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Unlimited art rentals
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ Unlimited art rentals
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ Up to 30-day rentals
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ Ultra-high resolution
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ Premium customer support
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ✓ Early access to new styles
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  component={Link}
                  to="/payment"
                >
                  Subscribe
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePage;
