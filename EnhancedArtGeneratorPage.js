import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab,
  Button,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import EnhancedArtGenerator from '../components/ArtGenerator/EnhancedArtGenerator';
import OutputQualityEnhancer from '../components/ArtGenerator/OutputQualityEnhancer';
import StyleLibrary from '../components/ArtGenerator/StyleLibrary';

function EnhancedArtGeneratorPage({ apiBaseUrl }) {
  // State for tab selection
  const [activeTab, setActiveTab] = useState(0);
  
  // State for generated art
  const [generatedArt, setGeneratedArt] = useState(null);
  const [enhancedArt, setEnhancedArt] = useState(null);
  
  // State for selected style
  const [selectedStylePack, setSelectedStylePack] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle art generation
  const handleGenerateArt = async (generationData) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the backend API
      // For demo purposes, we'll simulate the API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock response based on the selected model and parameters
      const mockImageUrl = getMockImageForGeneration(generationData);
      
      // Set the generated art
      setGeneratedArt({
        id: Math.floor(Math.random() * 10000),
        title: `AI Art - ${new Date().toLocaleString()}`,
        url: mockImageUrl,
        model: generationData.model,
        parameters: generationData.parameters
      });
      
      // Reset enhanced art when new art is generated
      setEnhancedArt(null);
      
      // Move to the enhancement tab after generation
      setActiveTab(1);
    } catch (err) {
      console.error('Error generating art:', err);
      setError('Failed to generate art. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle art enhancement
  const handleEnhanceArt = async (image, level) => {
    setEnhancing(true);
    
    try {
      // In a real implementation, this would call the backend API
      // For demo purposes, we'll simulate the API call
      
      // Simulate API delay (longer for higher quality)
      const delayTime = level === 'hd' ? 2000 : level === '4k' ? 3500 : 5000;
      await new Promise(resolve => setTimeout(resolve, delayTime));
      
      // Create a mock enhanced image URL
      // In a real implementation, this would be the URL of the enhanced image
      const mockEnhancedUrl = getMockEnhancedImage(image, level);
      
      // Set the enhanced art
      setEnhancedArt({
        url: mockEnhancedUrl,
        level: level,
        originalId: generatedArt.id
      });
      
      return mockEnhancedUrl;
    } catch (err) {
      console.error('Error enhancing art:', err);
      throw err;
    } finally {
      setEnhancing(false);
    }
  };
  
  // Handle style pack selection
  const handleSelectStylePack = (pack) => {
    setSelectedStylePack(pack);
    setSelectedStyle(null);
    
    // Move to the generator tab
    setActiveTab(0);
  };
  
  // Handle style selection
  const handleSelectStyle = (packId, style) => {
    const pack = stylePacks.find(p => p.id === packId);
    setSelectedStylePack(pack);
    setSelectedStyle(style);
    
    // Move to the generator tab
    setActiveTab(0);
  };
  
  // Handle download
  const handleDownload = (imageUrl, quality) => {
    // In a real implementation, this would trigger a download
    // For demo purposes, we'll just open the image in a new tab
    window.open(imageUrl, '_blank');
  };
  
  // Helper function to get mock image for generation
  const getMockImageForGeneration = (generationData) => {
    // Base Unsplash collections for different models
    const baseUrls = {
      'sdxl-turbo': 'https://images.unsplash.com/photo-',
      'dalle-3': 'https://images.unsplash.com/photo-'
    };
    
    // Sample image IDs for different styles and themes
    const imageIds = {
      'geometric': {
        'nature': '1507525428034-b723cf961d3e',
        'space': '1451187580459-43490279c0fa',
        'urban': '1480714378408-67cf0d13bc1b',
        'abstract': '1550859492-d5da9d8e45f3',
        'ocean': '1505118380757-91f5f5632de0'
      },
      'pixel': {
        'nature': '1501854140801-50d01698950b',
        'space': '1462331940025-496dfbfc7564',
        'urban': '1519501025264-65ba15a82390',
        'abstract': '1550684376-efcbd6e3f031',
        'ocean': '1518837695005-2083093ee35b'
      },
      'gradient': {
        'nature': '1540206395-68808572332f',
        'space': '1419242902214-272b3f66ee7a',
        'urban': '1513635269975-59663e0ac1ad',
        'abstract': '1541701494587-cb58502866ab',
        'ocean': '1507525428034-b723cf961d3e'
      },
      'fractal': {
        'nature': '1497250681960-ef046c08a56e',
        'space': '1465101162946-4377e57745c3',
        'urban': '1449824913935-59a10b8d2000',
        'abstract': '1507721999472-8ed4421c4af2',
        'ocean': '1468581264429-2548ef9eb732'
      },
      'expressionist': {
        'nature': '1500829243541-74b677fecc30',
        'space': '1454789548928-9efd52dc4031',
        'urban': '1480714378408-67cf0d13bc1b',
        'abstract': '1543857778-c4a1a3e0b2eb',
        'ocean': '1518837695005-2083093ee35b'
      }
    };
    
    // Get the appropriate image ID based on style and theme
    // Default to abstract if the style or theme is not found
    const style = generationData.parameters.artisticTerm || 'abstract';
    const theme = generationData.prompt.toLowerCase().includes('nature') ? 'nature' :
                 generationData.prompt.toLowerCase().includes('space') ? 'space' :
                 generationData.prompt.toLowerCase().includes('urban') ? 'urban' :
                 generationData.prompt.toLowerCase().includes('ocean') ? 'ocean' : 'abstract';
    
    const styleKey = Object.keys(imageIds).find(key => style.includes(key)) || 'abstract';
    const imageId = imageIds[styleKey][theme] || imageIds['abstract']['abstract'];
    
    // Construct the final URL with parameters for size and quality
    const baseUrl = baseUrls[generationData.model] || baseUrls['sdxl-turbo'];
    const detailLevel = generationData.parameters.detailIntensity || 5;
    const qualityParam = `?q=${60 + (detailLevel * 4)}&w=1200&h=800&fit=crop`;
    
    return `${baseUrl}${imageId}${qualityParam}`;
  };
  
  // Helper function to get mock enhanced image
  const getMockEnhancedImage = (imageUrl, level) => {
    // Parse the original URL to extract components
    const urlParts = imageUrl.split('?');
    const baseUrl = urlParts[0];
    
    // Create new quality parameters based on enhancement level
    let qualityParams = '';
    if (level === 'hd') {
      qualityParams = '?q=85&w=1920&h=1080&fit=crop';
    } else if (level === '4k') {
      qualityParams = '?q=95&w=3840&h=2160&fit=crop';
    } else if (level === '8k') {
      qualityParams = '?q=100&w=7680&h=4320&fit=crop';
    }
    
    // Return the enhanced URL
    return `${baseUrl}${qualityParams}`;
  };
  
  // Style packs data for reference
  const stylePacks = [
    {
      id: 'renaissance',
      name: 'Renaissance Masters',
      category: 'historical',
      description: 'Classical techniques from the Renaissance period featuring balanced compositions, perspective, and sfumato techniques.',
      styles: ['da_vinci', 'michelangelo', 'raphael', 'botticelli']
    },
    {
      id: 'impressionist',
      name: 'Impressionist Collection',
      category: 'historical',
      description: 'Capturing light and movement with visible brushstrokes and vibrant colors in the style of 19th century Impressionism.',
      styles: ['monet', 'renoir', 'degas', 'cezanne']
    },
    {
      id: 'modernist',
      name: 'Modern Art Movements',
      category: 'modern',
      description: 'Bold experimental styles from Cubism, Surrealism, and Abstract Expressionism of the 20th century.',
      styles: ['picasso', 'dali', 'kandinsky', 'pollock']
    },
    {
      id: 'digital',
      name: 'Digital Art Pioneers',
      category: 'contemporary',
      description: 'Contemporary digital art styles featuring vibrant colors, complex geometries, and futuristic elements.',
      styles: ['cyberpunk', 'vaporwave', 'glitch_art', 'low_poly']
    },
    {
      id: 'asian',
      name: 'East Asian Traditions',
      category: 'cultural',
      description: 'Traditional East Asian art techniques including ink wash painting, woodblock prints, and calligraphy.',
      styles: ['ukiyo_e', 'sumi_e', 'chinese_landscape', 'zen_minimalism']
    },
    {
      id: 'contemporary',
      name: 'Contemporary Movements',
      category: 'contemporary',
      description: 'Current art movements including minimalism, conceptual art, and post-internet aesthetics.',
      styles: ['minimalist', 'conceptual', 'pop_art', 'street_art']
    }
  ];
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Enhanced Art Generation Studio
        </Typography>
        
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          Create high-quality AI-generated art with advanced models, fine-tuned controls, and professional enhancement.
        </Typography>
        
        {selectedStylePack && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle1">
              Selected Style Pack: <strong>{selectedStylePack.name}</strong>
              {selectedStyle && ` - Style: ${selectedStyle.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedStylePack.description}
            </Typography>
            <Button 
              size="small" 
              sx={{ mt: 1 }}
              onClick={() => {
                setSelectedStylePack(null);
                setSelectedStyle(null);
              }}
            >
              Clear Selection
            </Button>
          </Paper>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Generate" />
            <Tab label="Enhance" disabled={!generatedArt} />
            <Tab label="Style Library" />
          </Tabs>
          
          <Divider />
          
          <Box sx={{ p: 0 }}>
            {activeTab === 0 && (
              <EnhancedArtGenerator 
                onGenerate={handleGenerateArt}
                loading={loading}
                selectedStylePack={selectedStylePack}
                selectedStyle={selectedStyle}
              />
            )}
            
            {activeTab === 1 && (
              <OutputQualityEnhancer 
                generatedImage={generatedArt?.url}
                isEnhancing={enhancing}
                onEnhance={handleEnhanceArt}
                onDownload={handleDownload}
              />
            )}
            
            {activeTab === 2 && (
              <StyleLibrary 
                onSelectStyle={handleSelectStyle}
                onSelectPack={handleSelectStylePack}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default EnhancedArtGeneratorPage;
