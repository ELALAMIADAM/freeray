import profilePic from './assets/freeray.jpg';
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Box, Button, Typography, Toolbar } from '@mui/material';

const styles = {
  profilePic: {
    width: '50px',
    height: '50px',
    borderRadius: '70%',
    marginRight: '10px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  siteTitle: {
    color: '#fff',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  navigation: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  navButton: {
    color: '#fff',
    fontSize: '0.9em',
  },
};

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#0831ff', padding: '10px 80px' }}>
      <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Box sx={styles.logo}>
          <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={profilePic} alt="profile" style={styles.profilePic} />
            <Typography variant="h6" sx={styles.siteTitle}>
              FREERAY
            </Typography>
          </Link>
        </Box>
        <Box sx={styles.navigation}>
          <Button component={Link} to="/" sx={styles.navButton}>
            Home
          </Button>
          <Button component={Link} to="/projects" sx={styles.navButton}>
            Projects
          </Button>
          {/* <Button component={Link} to="/Compte" sx={styles.navButton}>
            Compte
          </Button> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
