import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/createProject', { projectName });
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          marginTop: '30px',
          marginBottom: '200px',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Create Project
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ width: '100%', mt: 1 }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="projectName"
            label="Project Name"
            name="projectName"
            autoComplete="projectName"
            autoFocus
            value={projectName}
            onChange={handleProjectNameChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 4 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateProject;
