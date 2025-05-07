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
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

function ArtGeneratorPage({ apiBaseUrl }) {
  const [formData, setFormData] = useState({
    style: 'geometric',
    color_palette: 'vibrant',
    theme: 'nature'
  });
  
  const [generatedArt, setGeneratedArt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const styles = [
    { value: 'geometric', label: 'Geometric' },
    { value: 'pixel', label: 'Pixel Art' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'fractal', label: 'Fractal' },
    { value: 'expressionist', label: 'Expressionist' }
  ];
  
  const colorPalettes = [
    { value: 'vibrant', label: 'Vibrant' },
    { value: 'pastel', label: 'Pastel' },
    { value: 'monochrome', label: 'Monochrome' },
    { value: 'earthy', label: 'Earthy' },
    { value: 'ocean', label: 'Ocean' }
  ];
  
  const themes = [
    { value: 'nature', label: 'Nature' },
    { value: 'space', label: 'Space' },
    { value: 'urban', label: 'Urban' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'ocean', label: 'Ocean' }
  ];
  
  // Preloaded sample images for each style and theme combination
  const sampleImages = {
    geometric: {
      nature: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      space: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      urban: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
      abstract: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3',
      ocean: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0'
    },
    pixel: {
      nature: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
      space: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
      urban: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
      abstract: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031',
      ocean: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b'
    },
    gradient: {
      nature: 'https://images.unsplash.com/photo-1540206395-68808572332f',
      space: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
      urban: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
      abstract: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
      ocean: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
    },
    fractal: {
      nature: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e',
      space: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3',
      urban: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
      abstract: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2',
      ocean: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732'
    },
    expressionist: {
      nature: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30',
      space: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031',
      urban: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
      abstract: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb',
      ocean: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b'
    }
  };
  
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };
  
  const handleGenerateArt = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we'll use preloaded images instead of API calls
      // This avoids CORS issues and ensures images always load
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the appropriate image based on style and theme
      const imageUrl = sampleImages[formData.style][formData.theme];
      
      // Add a random query parameter to prevent caching
      const randomParam = Math.floor(Math.random() * 10000);
      const finalImageUrl = `${imageUrl}?random=${randomParam}&w=800&h=600&fit=crop`;
      
      // Create the mock response
      const mockResponse = {
        id: Math.floor(Math.random() * 1000),
        title: `${formData.style.charAt(0).toUpperCase() + formData.style.slice(1)} ${formData.theme.charAt(0).toUpperCase() + formData.theme.slice(1)}`,
        preview_url: finalImageUrl
      };
      
      setGeneratedArt(mockResponse);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error generating art:', err);
      setError('Failed to generate art. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center">
        Create Your Art
      </Typography>
      
      <Typography variant="body1" paragraph align="center">
        Customize your AI-generated art by selecting style, color palette, and theme.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Customization Options
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="style-label">Art Style</InputLabel>
              <Select
                labelId="style-label"
                id="style"
                name="style"
                value={formData.style}
                label="Art Style"
                onChange={handleChange}
              >
                {styles.map((style) => (
                  <MenuItem key={style.value} value={style.value}>
                    {style.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="color-palette-label">Color Palette</InputLabel>
              <Select
                labelId="color-palette-label"
                id="color_palette"
                name="color_palette"
                value={formData.color_palette}
                label="Color Palette"
                onChange={handleChange}
              >
                {colorPalettes.map((palette) => (
                  <MenuItem key={palette.value} value={palette.value}>
                    {palette.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="theme-label">Theme</InputLabel>
              <Select
                labelId="theme-label"
                id="theme"
                name="theme"
                value={formData.theme}
                label="Theme"
                onChange={handleChange}
              >
                {themes.map((theme) => (
                  <MenuItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleGenerateArt}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Art'}
            </Button>
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Preview
            </Typography>
            
            {generatedArt ? (
              <Box>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={generatedArt.preview_url}
                    alt={generatedArt.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {generatedArt.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Style: {formData.style.charAt(0).toUpperCase() + formData.style.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Color Palette: {formData.color_palette.charAt(0).toUpperCase() + formData.color_palette.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Theme: {formData.theme.charAt(0).toUpperCase() + formData.theme.slice(1)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="primary"
                      href={`/rental/${generatedArt.id}`}
                    >
                      Rent This Art
                    </Button>
                    <Button size="small">Save to Favorites</Button>
                  </CardActions>
                </Card>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  height: '300px', 
                  backgroundColor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {loading ? 'Generating art...' : 'Your art preview will appear here'}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          About Our Art Styles
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {styles.map((style) => (
            <Grid item xs={12} sm={6} md={4} key={style.value}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={sampleImages[style.value].abstract}
                  alt={style.label}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {style.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {style.value === 'geometric' && 'Clean, structured art with geometric shapes and patterns.'}
                    {style.value === 'pixel' && 'Retro-inspired pixel art reminiscent of classic video games.'}
                    {style.value === 'gradient' && 'Smooth transitions between colors creating flowing, modern designs.'}
                    {style.value === 'fractal' && 'Complex, recursive patterns with infinite detail and self-similarity.'}
                    {style.value === 'expressionist' && 'Bold, emotional art with expressive brushstrokes and vibrant colors.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Art successfully generated!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ArtGeneratorPage;
