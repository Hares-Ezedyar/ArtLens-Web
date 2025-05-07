import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar
} from '@mui/material';

// Import pages
import HomePage from './pages/HomePage';
import ArtGeneratorPage from './pages/ArtGeneratorPage';
import GalleryPage from './pages/GalleryPage';
import RentalPage from './pages/RentalPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApiDocumentation from './pages/ApiDocumentation';

// Import icons
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BrushIcon from '@mui/icons-material/Brush';
import CollectionsIcon from '@mui/icons-material/Collections';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CodeIcon from '@mui/icons-material/Code';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

// API base URL
const API_BASE_URL = 'https://5000-it3pgn3r6cxbw5w1uiv3h-13f789e2.manus.computer/api';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    navigate('/');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  const drawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem component={Link} to="/" button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={Link} to="/create" button>
          <ListItemIcon>
            <BrushIcon />
          </ListItemIcon>
          <ListItemText primary="Create Art" />
        </ListItem>
        <ListItem component={Link} to="/gallery" button>
          <ListItemIcon>
            <CollectionsIcon />
          </ListItemIcon>
          <ListItemText primary="Gallery" />
        </ListItem>
        <ListItem component={Link} to="/api-docs" button>
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText primary="API Docs" />
        </ListItem>
      </List>
      <Divider />
      <List>
        {isLoggedIn ? (
          <>
            <ListItem component={Link} to="/profile" button>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem component={Link} to="/login" button>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            ArtLens.io
          </Typography>
          {isLoggedIn ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user?.username}
              </Typography>
              <Avatar 
                alt={user?.username} 
                src="/static/images/avatar/1.jpg" 
                component={Link} 
                to="/profile"
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList()}
      </Drawer>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<ArtGeneratorPage apiBaseUrl={API_BASE_URL} />} />
          <Route path="/gallery" element={<GalleryPage apiBaseUrl={API_BASE_URL} />} />
          <Route path="/rental/:artId" element={<RentalPage apiBaseUrl={API_BASE_URL} />} />
          <Route path="/checkout" element={<CheckoutPage apiBaseUrl={API_BASE_URL} />} />
          <Route path="/payment" element={<PaymentPage apiBaseUrl={API_BASE_URL} />} />
          <Route path="/profile" element={<ProfilePage apiBaseUrl={API_BASE_URL} user={user} />} />
          <Route path="/login" element={<LoginPage apiBaseUrl={API_BASE_URL} onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage apiBaseUrl={API_BASE_URL} onRegister={handleLogin} />} />
          <Route path="/api-docs" element={<ApiDocumentation apiBaseUrl={API_BASE_URL} />} />
        </Routes>
      </Container>
      
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" gutterBottom>
            ArtLens.io
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            Ephemeral Digital Art Rental Platform
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' ArtLens.io. All rights reserved.'}
          </Typography>
        </Container>
      </Box>
    </>
  );
}

export default App;
