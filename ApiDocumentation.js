import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  TextField,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

function ApiDocumentation() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  
  // Mock user ID (in a real app, this would come from authentication)
  const userId = 1;
  
  // Generate API key
  const handleGenerateKey = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to generate a key
      // For now, we'll simulate it
      setTimeout(() => {
        const mockKey = 'art_' + Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
        setGeneratedKey(mockKey);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating API key:', error);
      setLoading(false);
    }
  };
  
  // API endpoints documentation
  const endpoints = [
    {
      method: 'GET',
      endpoint: '/api/art/{art_id}',
      description: 'Get details about a specific art piece',
      parameters: [
        { name: 'art_id', type: 'path', description: 'ID of the art piece' }
      ],
      example: '```\nGET /api/art/123\n```'
    },
    {
      method: 'POST',
      endpoint: '/api/generate-art',
      description: 'Generate a new art piece',
      parameters: [
        { name: 'style', type: 'body', description: 'Art style (geometric, pixel, gradient, fractal, expressionist)' },
        { name: 'color_palette', type: 'body', description: 'Color palette (vibrant, pastel, monochrome, earthy, ocean)' },
        { name: 'theme', type: 'body', description: 'Theme (nature, space, urban, abstract, ocean)' }
      ],
      example: '```\nPOST /api/generate-art\n{\n  "style": "geometric",\n  "color_palette": "vibrant",\n  "theme": "nature"\n}\n```'
    },
    {
      method: 'POST',
      endpoint: '/api/rent',
      description: 'Rent an art piece',
      parameters: [
        { name: 'art_id', type: 'body', description: 'ID of the art piece' },
        { name: 'duration_days', type: 'body', description: 'Rental duration in days' }
      ],
      example: '```\nPOST /api/rent\n{\n  "art_id": 123,\n  "duration_days": 7\n}\n```'
    },
    {
      method: 'GET',
      endpoint: '/api/user/rentals',
      description: 'Get all active rentals for the authenticated user',
      parameters: [],
      example: '```\nGET /api/user/rentals\n```'
    }
  ];
  
  // Code examples
  const codeExamples = {
    javascript: `// JavaScript example using fetch
const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://api.artlens.io';

// Generate art
async function generateArt(style, colorPalette, theme) {
  const response = await fetch(\`\${apiUrl}/api/generate-art\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${apiKey}\`
    },
    body: JSON.stringify({
      style,
      color_palette: colorPalette,
      theme
    })
  });
  
  return await response.json();
}

// Example usage
generateArt('geometric', 'vibrant', 'nature')
  .then(result => {
    console.log('Generated art:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });`,
    
    python: `# Python example using requests
import requests

api_key = 'YOUR_API_KEY'
api_url = 'https://api.artlens.io'

# Generate art
def generate_art(style, color_palette, theme):
    response = requests.post(
        f'{api_url}/api/generate-art',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        },
        json={
            'style': style,
            'color_palette': color_palette,
            'theme': theme
        }
    )
    
    return response.json()

# Example usage
try:
    result = generate_art('geometric', 'vibrant', 'nature')
    print('Generated art:', result)
except Exception as e:
    print('Error:', e)`,
    
    curl: `# cURL example
API_KEY="YOUR_API_KEY"
API_URL="https://api.artlens.io"

# Generate art
curl -X POST "${API_URL}/api/generate-art" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${API_KEY}" \\
  -d '{
    "style": "geometric",
    "color_palette": "vibrant",
    "theme": "nature"
  }'`
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        ArtLens.io API Documentation
      </Typography>
      
      <Typography variant="body1" paragraph align="center">
        Integrate ephemeral digital art into your applications with our API.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your API Key
            </Typography>
            
            {generatedKey ? (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={generatedKey}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Keep this key secure. Do not share it publicly.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" paragraph>
                  Generate an API key to start using the ArtLens.io API.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleGenerateKey}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generate API Key'}
                </Button>
              </>
            )}
          </Paper>
          
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rate Limits
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Free Tier" 
                  secondary="100 requests per day" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Basic Plan" 
                  secondary="1,000 requests per day" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Premium Plan" 
                  secondary="10,000 requests per day" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Enterprise Plan" 
                  secondary="Custom limits" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Authentication
            </Typography>
            <Typography variant="body2" paragraph>
              All API requests require authentication using an API key. Include your API key in the Authorization header:
            </Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
              Authorization: Bearer YOUR_API_KEY
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Endpoints
            </Typography>
            
            {endpoints.map((endpoint, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {endpoint.method} {endpoint.endpoint}
                </Typography>
                <Typography variant="body2" paragraph>
                  {endpoint.description}
                </Typography>
                
                {endpoint.parameters.length > 0 && (
                  <>
                    <Typography variant="subtitle2">Parameters:</Typography>
                    <List dense>
                      {endpoint.parameters.map((param, paramIndex) => (
                        <ListItem key={paramIndex}>
                          <ListItemText 
                            primary={`${param.name} (${param.type})`} 
                            secondary={param.description} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
                
                <Typography variant="subtitle2">Example:</Typography>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {endpoint.example.replace('```\n', '').replace('\n```', '')}
                </Box>
              </Box>
            ))}
          </Paper>
          
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Code Examples
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mt: 2 }}>JavaScript</Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '300px' }}>
              {codeExamples.javascript}
            </Box>
            
            <Typography variant="subtitle1" sx={{ mt: 3 }}>Python</Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '300px' }}>
              {codeExamples.python}
            </Box>
            
            <Typography variant="subtitle1" sx={{ mt: 3 }}>cURL</Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '300px' }}>
              {codeExamples.curl}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ApiDocumentation;
