import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Box, Container, Link } from '@mui/material';

const Auth = ({ onLogin, onSignUp }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(''); // Added state for email
  const [error, setError] = useState(null);

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setError(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail(''); // Clear email on switch
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
  
    try {
      console.log('Attempting login with', { username, password });
      const url = 'http://localhost:3001/login';
      const response = await axios.post(url, { username, password });
      console.log('Login response:', response.data);
      onLogin(username, password);
    } catch (error) {
      console.error('Login error details:', error.response?.data || error.message);
    }
  };
  

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!username || !password || !email || password !== confirmPassword) {
      setError('All fields are required and passwords must match');
      return;
    }
  
    try {
      console.log('Signup data:', { username, password, email }); // Debugging line
      const response = await axios.post('http://localhost:3001/signup', {
        username,
        password,
        email
      });
      console.log('User registered:', response.data);
      setIsLogin(true); // Switch to login form
      setError(null); // Clear any existing errors
    } catch (error) {
      console.error('Sign up error details:', error.response?.data || error.message);
      setError('Sign up failed. Please check your credentials.');
    }
  };
  
  

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="text"
            color={isLogin ? 'success' : 'inherit'}
            onClick={handleSwitch}
          >
            Sign In
          </Button>
          <Button
            variant="text"
            color={!isLogin ? 'success' : 'inherit'}
            onClick={handleSwitch}
          >
            Signup
          </Button>
        </Box>
        {/* <Typography component="h1" variant="h5" color="success.main">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Typography> */}
        <Box
          component="form"
          onSubmit={isLogin ? handleLogin : handleSignup}
          noValidate
          sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          {!isLogin && (
            <>
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Link href="#" variant="body2" color="inherit">
              Forgot Password
            </Link>
            <Link href="#" variant="body2" color="success.main" onClick={handleSwitch}>
              {isLogin ? 'Signup' : 'Login'}
            </Link>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </Box>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Box>
    </Container>
  );
};

export default Auth;
