import React, { useState } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Tooltip,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

const ModelSelector = ({ selectedModel, onModelChange, advanced = false }) => {
  const [expanded, setExpanded] = useState(false);
  
  const models = [
    { 
      id: 'sdxl-turbo', 
      name: 'SDXL Turbo', 
      description: 'Fast generation with good quality. Best for quick iterations.',
      specs: 'Low latency, medium detail level, good for most use cases'
    },
    { 
      id: 'dalle-3', 
      name: 'DALL-E 3', 
      description: 'High fidelity with excellent prompt adherence. Best for complex scenes.',
      specs: 'Higher latency, excellent detail level, superior prompt understanding'
    }
  ];
  
  const handleChange = (event) => {
    onModelChange(event.target.value);
  };
  
  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };
  
  // Simple selector for basic mode
  if (!advanced) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          AI Model (Automatic Selection)
          <Tooltip title="The system will automatically select the best model based on your request">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Using SDXL Turbo for optimal speed and quality
        </Typography>
      </Box>
    );
  }
  
  // Advanced selector with model options
  return (
    <Accordion expanded={expanded} onChange={handleAccordionChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="model-selector-content"
        id="model-selector-header"
      >
        <Typography>AI Model Selection</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <InputLabel id="model-select-label">AI Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={selectedModel}
            label="AI Model"
            onChange={handleChange}
          >
            {models.map((model) => (
              <MenuItem key={model.id} value={model.id}>
                {model.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Display selected model details */}
        {selectedModel && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {models.find(m => m.id === selectedModel)?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {models.find(m => m.id === selectedModel)?.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Technical specs:</strong> {models.find(m => m.id === selectedModel)?.specs}
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ModelSelector;
