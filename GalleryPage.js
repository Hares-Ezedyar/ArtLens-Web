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
  TextField,
  CircularProgress,
  Pagination,
  IconButton,
  Chip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Link } from 'react-router-dom';

function GalleryPage({ apiBaseUrl }) {
  const [artPieces, setArtPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    style: '',
    color_palette: '',
    theme: ''
  });
  
  // Mock art pieces for demonstration
  useEffect(() => {
    // In a real app, this would fetch from the API with filters
    const fetchArtPieces = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock art pieces
      const styles = ['geometric', 'pixel', 'gradient', 'fractal', 'expressionist'];
      const colorPalettes = ['vibrant', 'pastel', 'monochrome', 'earthy', 'ocean'];
      const themes = ['nature', 'space', 'urban', 'abstract', 'ocean'];
      
      const mockArtPieces = Array.from({ length: 12 }, (_, i) => {
        const style = styles[Math.floor(Math.random() * styles.length)];
        const colorPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        const theme = themes[Math.floor(Math.random() * themes.length)];
        
        return {
          id: i + 1,
          title: `${style.charAt(0).toUpperCase() + style.slice(1)} ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
          style,
          color_palette: colorPalette,
          theme,
          preview_url: `https://source.unsplash.com/random?${style},${theme}`,
          is_favorite: Math.random() > 0.7
        };
      });
      
      // Apply filters if any
      let filteredArt = [...mockArtPieces];
      if (filters.style) {
        filteredArt = filteredArt.filter(art => art.style === filters.style);
      }
      if (filters.color_palette) {
        filteredArt = filteredArt.filter(art => art.color_palette === filters.color_palette);
      }
      if (filters.theme) {
        filteredArt = filteredArt.filter(art => art.theme === filters.theme);
      }
      
      setArtPieces(filteredArt);
      setTotalPages(Math.ceil(filteredArt.length / 8));
      setLoading(false);
    };
    
    fetchArtPieces();
  }, [filters]);
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
    setPage(1);
  };
  
  const clearFilters = () => {
    setFilters({
      style: '',
      color_palette: '',
      theme: ''
    });
    setPage(1);
  };
  
  const toggleFavorite = (id) => {
    setArtPieces(artPieces.map(art => 
      art.id === id ? { ...art, is_favorite: !art.is_favorite } : art
    ));
  };
  
  // Get current page items
  const indexOfLastItem = page * 8;
  const indexOfFirstItem = indexOfLastItem - 8;
  const currentArtPieces = artPieces.slice(indexOfFirstItem, indexOfLastItem);
  
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
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center">
        Art Gallery
      </Typography>
      
      <Typography variant="body1" paragraph align="center">
        Browse our collection of AI-generated art pieces
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="style-filter-label">Style</InputLabel>
              <Select
                labelId="style-filter-label"
                id="style-filter"
                name="style"
                value={filters.style}
                label="Style"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Styles</MenuItem>
                {styles.map((style) => (
                  <MenuItem key={style.value} value={style.value}>
                    {style.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="color-palette-filter-label">Color Palette</InputLabel>
              <Select
                labelId="color-palette-filter-label"
                id="color-palette-filter"
                name="color_palette"
                value={filters.color_palette}
                label="Color Palette"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Palettes</MenuItem>
                {colorPalettes.map((palette) => (
                  <MenuItem key={palette.value} value={palette.value}>
                    {palette.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="theme-filter-label">Theme</InputLabel>
              <Select
                labelId="theme-filter-label"
                id="theme-filter"
                name="theme"
                value={filters.theme}
                label="Theme"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Themes</MenuItem>
                {themes.map((theme) => (
                  <MenuItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={clearFilters}
              startIcon={<FilterListIcon />}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
        
        {/* Active filters */}
        {(filters.style || filters.color_palette || filters.theme) && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.style && (
              <Chip 
                label={`Style: ${styles.find(s => s.value === filters.style)?.label}`} 
                onDelete={() => setFilters({...filters, style: ''})}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.color_palette && (
              <Chip 
                label={`Palette: ${colorPalettes.find(p => p.value === filters.color_palette)?.label}`} 
                onDelete={() => setFilters({...filters, color_palette: ''})}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.theme && (
              <Chip 
                label={`Theme: ${themes.find(t => t.value === filters.theme)?.label}`} 
                onDelete={() => setFilters({...filters, theme: ''})}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>
      
      {/* Art Gallery */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : artPieces.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No art pieces found matching your filters.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={clearFilters}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentArtPieces.map((art) => (
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
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={art.preview_url}
                      alt={art.title}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        }
                      }}
                      onClick={() => toggleFavorite(art.id)}
                    >
                      {art.is_favorite ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {art.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Style: {art.style.charAt(0).toUpperCase() + art.style.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Palette: {art.color_palette.charAt(0).toUpperCase() + art.color_palette.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Theme: {art.theme.charAt(0).toUpperCase() + art.theme.slice(1)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="primary"
                      component={Link}
                      to={`/rental/${art.id}`}
                      fullWidth
                    >
                      Rent Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </>
      )}
      
      {/* Create Your Own Art CTA */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Can't find what you're looking for?
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          component={Link}
          to="/create"
          sx={{ mt: 2 }}
        >
          Create Your Own Art
        </Button>
      </Box>
    </Container>
  );
}

export default GalleryPage;
