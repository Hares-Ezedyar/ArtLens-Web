import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ModelSelector from './ModelSelector';
import AdvancedControls from './AdvancedControls';

const EnhancedArtGenerator = ({ onGenerate }) => {
  // State for advanced mode toggle
  const [advancedMode, setAdvancedMode] = useState(false);
  
  // State for model selection
  const [selectedModel, setSelectedModel] = useState('sdxl-turbo');
  
  // State for advanced parameters
  const [parameters, setParameters] = useState({
    detailIntensity: 5,
    styleFidelity: 70,
    seed: Math.floor(Math.random() * 1000000),
    artisticTerm: ''
  });
  
  // State for reference image
  const [referenceImage, setReferenceImage] = useState(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState(null);
  
  // State for prompt
  const [prompt, setPrompt] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Handle advanced mode toggle
  const handleAdvancedModeToggle = (event) => {
    setAdvancedMode(event.target.checked);
  };
  
  // Handle model change
  const handleModelChange = (model) => {
    setSelectedModel(model);
  };
  
  // Handle parameter change
  const handleParameterChange = (name, value) => {
    setParameters({
      ...parameters,
      [name]: value
    });
  };
  
  // Handle prompt change
  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };
  
  // Handle reference image upload
  const handleReferenceImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setReferenceImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle reference image removal
  const handleRemoveReferenceImage = () => {
    setReferenceImage(null);
    setReferenceImagePreview(null);
  };
  
  // Handle generation
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare generation data
      const generationData = {
        model: selectedModel,
        prompt: prompt,
        parameters: advancedMode ? parameters : {
          detailIntensity: 5,
          styleFidelity: 70,
          seed: Math.floor(Math.random() * 1000000),
          artisticTerm: ''
        },
        referenceImage: referenceImage
      };
      
      // Call the onGenerate callback
      await onGenerate(generationData);
      
      // Show success message
      setSuccess(true);
    } catch (err) {
      console.error('Error generating art:', err);
      setError('Failed to generate art. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle success message close
  const handleSuccessClose = () => {
    setSuccess(false);
  };
  
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Enhanced Art Generator</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={advancedMode}
              onChange={handleAdvancedModeToggle}
              color="primary"
            />
          }
          label="Advanced Options"
        />
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Model Selection */}
      <ModelSelector 
        selectedModel={selectedModel} 
        onModelChange={handleModelChange}
        advanced={advancedMode}
      />
      
      {/* Prompt Input */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Describe Your Art
        </Typography>
        <textarea
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontFamily: 'inherit',
            fontSize: '1rem',
            minHeight: '100px',
            resize: 'vertical'
          }}
          placeholder="Describe the art you want to generate in detail. For example: 'A serene mountain landscape at sunset with a flowing river and pine trees in the foreground.'"
          value={prompt}
          onChange={handlePromptChange}
        />
        {advancedMode && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Pro tip: Include artistic terminology like "chiaroscuro," "impasto," or "anamorphic lens" for more specific styles.
          </Typography>
        )}
      </Box>
      
      {/* Reference Image Upload (Advanced Mode Only) */}
      {advancedMode && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Reference Image (Optional)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleReferenceImageUpload}
              />
            </Button>
            {referenceImagePreview && (
              <>
                <Box
                  component="img"
                  src={referenceImagePreview}
                  alt="Reference"
                  sx={{ height: 60, width: 60, objectFit: 'cover', borderRadius: 1 }}
                />
                <Button size="small" color="error" onClick={handleRemoveReferenceImage}>
                  Remove
                </Button>
              </>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Upload a reference image to guide the style, color palette, and composition of your generated art.
          </Typography>
        </Box>
      )}
      
      {/* Advanced Controls (Advanced Mode Only) */}
      {advancedMode && (
        <AdvancedControls
          parameters={parameters}
          onParameterChange={handleParameterChange}
        />
      )}
      
      {/* Generate Button */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Enhanced Art'}
        </Button>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
      
      {/* Success Message */}
      <Snackbar open={success} autoHideDuration={6000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
          Art successfully generated with enhanced quality!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EnhancedArtGenerator;
