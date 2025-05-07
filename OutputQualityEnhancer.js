import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Chip
} from '@mui/material';
import HighQualityIcon from '@mui/icons-material/HighQuality';
import TuneIcon from '@mui/icons-material/Tune';
import DownloadIcon from '@mui/icons-material/Download';

const OutputQualityEnhancer = ({ generatedImage, isEnhancing = false, onEnhance, onDownload }) => {
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [enhancementLevel, setEnhancementLevel] = useState('standard');
  const [processing, setProcessing] = useState(false);
  
  // Reset enhanced image when a new image is generated
  useEffect(() => {
    setEnhancedImage(null);
    setEnhancementLevel('standard');
  }, [generatedImage]);
  
  // Handle enhancement request
  const handleEnhance = async (level) => {
    if (!generatedImage) return;
    
    setProcessing(true);
    setEnhancementLevel(level);
    
    try {
      // In a real implementation, this would call the backend API
      // to perform the actual enhancement processing
      const result = await onEnhance(generatedImage, level);
      setEnhancedImage(result);
    } catch (error) {
      console.error('Error enhancing image:', error);
    } finally {
      setProcessing(false);
    }
  };
  
  // Handle download
  const handleDownload = (image, quality) => {
    if (onDownload) {
      onDownload(image, quality);
    }
  };
  
  // If no image is generated yet
  if (!generatedImage && !isEnhancing) {
    return (
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Output Quality Enhancement
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generate an image first to access quality enhancement options.
        </Typography>
      </Paper>
    );
  }
  
  // If enhancing is in progress
  if (isEnhancing) {
    return (
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.paper', textAlign: 'center' }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Enhancing Your Artwork
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we apply advanced enhancement algorithms to your image.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.paper' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Output Quality Enhancement
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Apply advanced enhancement techniques to improve your generated artwork.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Original Image */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={generatedImage}
              alt="Original Generated Art"
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Original Output
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Standard quality output from the AI model.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(generatedImage, 'standard')}
              >
                Download
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Enhanced Image or Enhancement Options */}
        <Grid item xs={12} md={6}>
          {enhancedImage ? (
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={enhancedImage}
                alt="Enhanced Art"
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    Enhanced Output
                  </Typography>
                  <Chip 
                    icon={<HighQualityIcon />} 
                    label={enhancementLevel === 'hd' ? 'HD (1080p)' : enhancementLevel === '4k' ? '4K UHD' : '8K'}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {enhancementLevel === 'hd' && 'Enhanced with sharpening filters and artifact reduction.'}
                  {enhancementLevel === '4k' && 'Upscaled to 4K with advanced detail enhancement.'}
                  {enhancementLevel === '8k' && 'Maximum quality 8K resolution with AI-powered detail generation.'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(enhancedImage, enhancementLevel)}
                >
                  Download Enhanced
                </Button>
                <Button 
                  size="small"
                  startIcon={<TuneIcon />}
                  onClick={() => setEnhancedImage(null)}
                >
                  Try Different Enhancement
                </Button>
              </CardActions>
            </Card>
          ) : (
            <Card>
              <Box 
                sx={{ 
                  height: 300, 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'action.hover',
                  p: 3
                }}
              >
                <Typography variant="h6" gutterBottom align="center">
                  Enhance Your Artwork
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Select an enhancement level to improve quality and resolution
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleEnhance('hd')}
                    disabled={processing}
                    startIcon={processing && enhancementLevel === 'hd' ? <CircularProgress size={20} /> : <HighQualityIcon />}
                  >
                    HD Enhancement (1080p)
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleEnhance('4k')}
                    disabled={processing}
                    startIcon={processing && enhancementLevel === '4k' ? <CircularProgress size={20} /> : <HighQualityIcon />}
                  >
                    4K UHD Enhancement
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleEnhance('8k')}
                    disabled={processing}
                    startIcon={processing && enhancementLevel === '8k' ? <CircularProgress size={20} /> : <HighQualityIcon />}
                  >
                    8K Maximum Quality
                  </Button>
                </Box>
              </Box>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Our enhancement pipeline applies advanced AI algorithms for upscaling, sharpening, artifact reduction, and edge refinement.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OutputQualityEnhancer;
