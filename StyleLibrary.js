import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import StyleIcon from '@mui/icons-material/Style';

const StyleLibrary = ({ onSelectStyle, onSelectPack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Style packs data
  const stylePacks = [
    {
      id: 'renaissance',
      name: 'Renaissance Masters',
      category: 'historical',
      description: 'Classical techniques from the Renaissance period featuring balanced compositions, perspective, and sfumato techniques.',
      styles: ['da_vinci', 'michelangelo', 'raphael', 'botticelli'],
      previewImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342'
    },
    {
      id: 'impressionist',
      name: 'Impressionist Collection',
      category: 'historical',
      description: 'Capturing light and movement with visible brushstrokes and vibrant colors in the style of 19th century Impressionism.',
      styles: ['monet', 'renoir', 'degas', 'cezanne'],
      previewImage: 'https://images.unsplash.com/photo-1579541591970-e5615ce6c9c3'
    },
    {
      id: 'modernist',
      name: 'Modern Art Movements',
      category: 'modern',
      description: 'Bold experimental styles from Cubism, Surrealism, and Abstract Expressionism of the 20th century.',
      styles: ['picasso', 'dali', 'kandinsky', 'pollock'],
      previewImage: 'https://images.unsplash.com/photo-1501084291732-13b1ba8f0ebc'
    },
    {
      id: 'digital',
      name: 'Digital Art Pioneers',
      category: 'contemporary',
      description: 'Contemporary digital art styles featuring vibrant colors, complex geometries, and futuristic elements.',
      styles: ['cyberpunk', 'vaporwave', 'glitch_art', 'low_poly'],
      previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'
    },
    {
      id: 'asian',
      name: 'East Asian Traditions',
      category: 'cultural',
      description: 'Traditional East Asian art techniques including ink wash painting, woodblock prints, and calligraphy.',
      styles: ['ukiyo_e', 'sumi_e', 'chinese_landscape', 'zen_minimalism'],
      previewImage: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d'
    },
    {
      id: 'contemporary',
      name: 'Contemporary Movements',
      category: 'contemporary',
      description: 'Current art movements including minimalism, conceptual art, and post-internet aesthetics.',
      styles: ['minimalist', 'conceptual', 'pop_art', 'street_art'],
      previewImage: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8'
    }
  ];
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'historical', name: 'Historical' },
    { id: 'modern', name: 'Modern' },
    { id: 'contemporary', name: 'Contemporary' },
    { id: 'cultural', name: 'Cultural' }
  ];
  
  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  
  // Filter style packs based on selected category
  const filteredPacks = selectedCategory === 'all' 
    ? stylePacks 
    : stylePacks.filter(pack => pack.category === selectedCategory);
  
  // Handle style pack selection
  const handleSelectPack = (pack) => {
    if (onSelectPack) {
      onSelectPack(pack);
    }
  };
  
  // Handle individual style selection
  const handleSelectStyle = (packId, style) => {
    if (onSelectStyle) {
      onSelectStyle(packId, style);
    }
  };
  
  return (
    <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.paper' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Style Library
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse and select from curated style packs for your art generation.
        </Typography>
      </Box>
      
      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="category-filter-label">Filter by Category</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            value={selectedCategory}
            label="Filter by Category"
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Style Packs Grid */}
      <Grid container spacing={3}>
        {filteredPacks.map((pack) => (
          <Grid item xs={12} sm={6} md={4} key={pack.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image={`${pack.previewImage}?w=500&h=300&fit=crop`}
                alt={pack.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {pack.name}
                  </Typography>
                  <Chip 
                    icon={<StyleIcon />} 
                    label={pack.category.charAt(0).toUpperCase() + pack.category.slice(1)}
                    size="small"
                    color={
                      pack.category === 'historical' ? 'secondary' :
                      pack.category === 'modern' ? 'primary' :
                      pack.category === 'contemporary' ? 'success' :
                      'default'
                    }
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {pack.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Included Styles:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {pack.styles.map((style) => (
                    <Chip 
                      key={style}
                      label={style.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      size="small"
                      variant="outlined"
                      icon={<PaletteIcon fontSize="small" />}
                      onClick={() => handleSelectStyle(pack.id, style)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleSelectPack(pack)}
                  fullWidth
                >
                  Use This Style Pack
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default StyleLibrary;
