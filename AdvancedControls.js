import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  TextField,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const AdvancedControls = ({ parameters, onParameterChange }) => {
  const handleSliderChange = (name) => (event, newValue) => {
    onParameterChange(name, newValue);
  };

  const handleInputChange = (name) => (event) => {
    onParameterChange(name, event.target.value);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Advanced Parameters
      </Typography>
      
      {/* Detail Intensity Slider */}
      <Box sx={{ mb: 3 }}>
        <Typography id="detail-intensity-slider" gutterBottom>
          Detail Intensity
          <Tooltip title="Controls the level of micro-detail in the generated art. Higher values produce more intricate details.">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Slider
          value={parameters.detailIntensity}
          onChange={handleSliderChange('detailIntensity')}
          aria-labelledby="detail-intensity-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
        />
        <Typography variant="body2" color="text.secondary">
          {parameters.detailIntensity === 1 && 'Minimal detail, smoother appearance'}
          {parameters.detailIntensity > 1 && parameters.detailIntensity < 5 && 'Low detail, cleaner look'}
          {parameters.detailIntensity >= 5 && parameters.detailIntensity < 8 && 'Medium detail, balanced appearance'}
          {parameters.detailIntensity >= 8 && parameters.detailIntensity < 10 && 'High detail, intricate textures'}
          {parameters.detailIntensity === 10 && 'Maximum detail, highly complex textures'}
        </Typography>
      </Box>
      
      {/* Style Fidelity Slider */}
      <Box sx={{ mb: 3 }}>
        <Typography id="style-fidelity-slider" gutterBottom>
          Style Fidelity
          <Tooltip title="Determines how closely the AI adheres to the specified style. Higher values produce more stylistically consistent results.">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Slider
          value={parameters.styleFidelity}
          onChange={handleSliderChange('styleFidelity')}
          aria-labelledby="style-fidelity-slider"
          valueLabelDisplay="auto"
          step={10}
          marks
          min={0}
          max={100}
        />
        <Typography variant="body2" color="text.secondary">
          {parameters.styleFidelity < 30 && 'Low fidelity, more creative interpretation'}
          {parameters.styleFidelity >= 30 && parameters.styleFidelity < 70 && 'Medium fidelity, balanced interpretation'}
          {parameters.styleFidelity >= 70 && 'High fidelity, strict style adherence'}
        </Typography>
      </Box>
      
      {/* Seed Control */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>
          Seed Value
          <Tooltip title="Controls the randomness of generation. Using the same seed with identical parameters will produce similar results, allowing for iterative refinement.">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Seed"
          value={parameters.seed}
          onChange={handleInputChange('seed')}
          helperText="Use the same seed to create variations of an image"
        />
      </Box>
      
      {/* Artistic Terminology */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>
          Artistic Terminology
          <Tooltip title="Specialized artistic terms that influence the generation style. Examples: chiaroscuro, impasto, anamorphic, etc.">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="artistic-term-label">Artistic Technique</InputLabel>
          <Select
            labelId="artistic-term-label"
            id="artistic-term"
            value={parameters.artisticTerm}
            label="Artistic Technique"
            onChange={handleInputChange('artisticTerm')}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="chiaroscuro">Chiaroscuro (strong light/dark contrast)</MenuItem>
            <MenuItem value="impasto">Impasto (thick paint application)</MenuItem>
            <MenuItem value="anamorphic">Anamorphic (distorted perspective)</MenuItem>
            <MenuItem value="sfumato">Sfumato (soft, blended transitions)</MenuItem>
            <MenuItem value="pointillism">Pointillism (composed of small dots)</MenuItem>
            <MenuItem value="tenebrism">Tenebrism (dramatic illumination)</MenuItem>
            <MenuItem value="cubism">Cubism (geometric fragmentation)</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default AdvancedControls;
