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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';

function ProfilePage({ apiBaseUrl, user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [favoriteArt, setFavoriteArt] = useState([]);
  const [profileData, setProfileData] = useState({
    username: user?.username || 'ArtLover123',
    email: user?.email || 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    preferences: {
      preferredStyles: ['geometric', 'pixel'],
      preferredColorPalettes: ['vibrant', 'pastel'],
      preferredThemes: ['nature', 'abstract']
    }
  });
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would fetch from the API
        // const response = await axios.get(`${apiBaseUrl}/user/profile`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock rental history
        const mockRentalHistory = [
          {
            id: 1,
            art_title: 'Geometric Nature',
            start_date: '2025-03-25',
            end_date: '2025-04-01',
            price: 35.00,
            status: 'active',
            preview_url: 'https://source.unsplash.com/random?geometric,nature'
          },
          {
            id: 2,
            art_title: 'Pixel Space',
            start_date: '2025-03-15',
            end_date: '2025-03-22',
            price: 28.00,
            status: 'expired',
            preview_url: 'https://source.unsplash.com/random?pixel,space'
          },
          {
            id: 3,
            art_title: 'Gradient Ocean',
            start_date: '2025-02-10',
            end_date: '2025-02-17',
            price: 35.00,
            status: 'expired',
            preview_url: 'https://source.unsplash.com/random?gradient,ocean'
          }
        ];
        
        // Mock favorite art
        const mockFavoriteArt = [
          {
            id: 4,
            title: 'Fractal Abstract',
            style: 'fractal',
            color_palette: 'vibrant',
            theme: 'abstract',
            preview_url: 'https://source.unsplash.com/random?fractal,abstract'
          },
          {
            id: 5,
            title: 'Expressionist Urban',
            style: 'expressionist',
            color_palette: 'monochrome',
            theme: 'urban',
            preview_url: 'https://source.unsplash.com/random?expressionist,urban'
          }
        ];
        
        setRentalHistory(mockRentalHistory);
        setFavoriteArt(mockFavoriteArt);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would update via API
      // const response = await axios.put(`${apiBaseUrl}/user/profile`, profileData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message (would use a snackbar in a real app)
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handlePreferenceChange = (event) => {
    const { name, value } = event.target;
    setProfileData({
      ...profileData,
      preferences: {
        ...profileData.preferences,
        [name]: value
      }
    });
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center">
        My Profile
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                alt={profileData.username}
                src="/static/images/avatar/1.jpg"
              >
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </Avatar>
              <Typography variant="h6">
                {profileData.firstName} {profileData.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{profileData.username}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List component="nav" sx={{ width: '100%' }}>
              <ListItem 
                button 
                selected={activeTab === 'profile'} 
                onClick={() => handleTabChange('profile')}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Profile Information" />
              </ListItem>
              
              <ListItem 
                button 
                selected={activeTab === 'rentals'} 
                onClick={() => handleTabChange('rentals')}
              >
                <ListItemAvatar>
                  <Avatar>
                    <HistoryIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Rental History" />
              </ListItem>
              
              <ListItem 
                button 
                selected={activeTab === 'favorites'} 
                onClick={() => handleTabChange('favorites')}
              >
                <ListItemAvatar>
                  <Avatar>
                    <FavoriteIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Favorite Art" />
              </ListItem>
              
              <ListItem 
                button 
                selected={activeTab === 'preferences'} 
                onClick={() => handleTabChange('preferences')}
              >
                <ListItemAvatar>
                  <Avatar>
                    <SettingsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Art Preferences" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {activeTab === 'profile' && (
                  <Box component="form" onSubmit={handleProfileUpdate}>
                    <Typography variant="h5" gutterBottom>
                      Profile Information
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Username"
                          name="username"
                          value={profileData.username}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                        />
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Update Profile
                      </Button>
                    </Box>
                  </Box>
                )}
                
                {activeTab === 'rentals' && (
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      Rental History
                    </Typography>
                    
                    {rentalHistory.length === 0 ? (
                      <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                        You haven't rented any art pieces yet.
                      </Typography>
                    ) : (
                      <Grid container spacing={3} sx={{ mt: 1 }}>
                        {rentalHistory.map((rental) => (
                          <Grid item xs={12} key={rental.id}>
                            <Card sx={{ display: 'flex', height: '100%' }}>
                              <CardContent sx={{ display: 'flex', width: '100%' }}>
                                <Box sx={{ width: 120, height: 120, mr: 2, flexShrink: 0 }}>
                                  <img 
                                    src={rental.preview_url} 
                                    alt={rental.art_title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                  <Typography variant="h6" gutterBottom>
                                    {rental.art_title}
                                  </Typography>
                                  
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                      <Typography variant="body2" color="text.secondary">
                                        Rental Period
                                      </Typography>
                                      <Typography variant="body1">
                                        {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <Typography variant="body2" color="text.secondary">
                                        Price
                                      </Typography>
                                      <Typography variant="body1">
                                        ${rental.price.toFixed(2)}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Box 
                                        sx={{ 
                                          display: 'inline-block', 
                                          px: 1, 
                                          py: 0.5, 
                                          borderRadius: 1, 
                                          bgcolor: rental.status === 'active' ? 'success.light' : 'text.disabled',
                                          color: rental.status === 'active' ? 'success.contrastText' : 'white'
                                        }}
                                      >
                                        <Typography variant="body2">
                                          {rental.status === 'active' ? 'Active' : 'Expired'}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                  
                                  {rental.status === 'active' && (
                                    <Box sx={{ mt: 'auto', pt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                      <Button 
                                        variant="outlined" 
                                        size="small"
                                        onClick={() => window.open(`/view/${rental.id}`, '_blank')}
                                      >
                                        View Art
                                      </Button>
                                    </Box>
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}
                
                {activeTab === 'favorites' && (
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      Favorite Art
                    </Typography>
                    
                    {favoriteArt.length === 0 ? (
                      <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                        You haven't added any art pieces to your favorites yet.
                      </Typography>
                    ) : (
                      <Grid container spacing={3} sx={{ mt: 1 }}>
                        {favoriteArt.map((art) => (
                          <Grid item xs={12} sm={6} key={art.id}>
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
          
(Content truncated due to size limit. Use line ranges to read in chunks)