import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Link,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
// import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

const styles = {
  container: {
    mt: 8,
    mb: 20.4,
  },
  headerBox: {
    textAlign: 'center',
    mb: 4,
  },
  headerTypography: {
    fontWeight: 'bold',
    color: 'primary.main',
  },
  buttonBox: {
    mb: 2,
  },
  button: {
    mr: 2,
    px: 4,
    py: 1,
  },
  paper: {
    padding: 4,
    borderRadius: 2,
  },
  projectTitle: {
    color: 'text.secondary',
    fontWeight: 'medium',
  },
  listItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    mb: 2,
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  link: {
    fontWeight: 'bold',
    color: 'primary.main',
    mr: 2,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    fetch('http://localhost:3001/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const deleteProject = (projectId, dbName) => {
    fetch(`http://localhost:3001/projects/${projectId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setProjects(projects.filter(project => project.db_id !== projectId));
          console.log(`Database ${dbName} deleted`);
        } else {
          console.error('Failed to delete project');
        }
      })
      .catch(error => console.error('Error deleting project:', error));
  };

  const switchDatabase = (dbId, dbName) => {
    fetch('http://localhost:3001/switchDatabase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dbId, dbName }),
    })
      .then(response => response.text())
      .then(message => {
        console.log(message);
        navigate('/Standard'); // Navigate after the database switch is successful
      })
      .catch(error => console.error('Error switching database:', error));
  };

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Box sx={styles.headerBox}>
        <Typography variant="h3" gutterBottom sx={styles.headerTypography}>
          Projects
        </Typography>
        <Box sx={styles.buttonBox}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/projects/create"
            sx={styles.button}
          >
            Create a New Project
          </Button>
          {/* <Button
            variant="contained"
            color="secondary"
            startIcon={<ConnectWithoutContactIcon />}
            component={RouterLink}
            to="/projects/connect"
          >
            Connect to an Existing Project
          </Button> */}
        </Box>
      </Box>
      <Paper elevation={3} sx={styles.paper}>
        <Typography variant="h5" gutterBottom sx={styles.projectTitle}>
          Your Projects:
        </Typography>
        <List>
          {projects.map(project => (
            <ListItem
              key={project.db_id}
              sx={styles.listItem}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => deleteProject(project.db_id, project.db_name)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Link
                component="button"
                variant="body1"
                onClick={() => switchDatabase(project.db_id, project.db_name)}
                sx={styles.link}
              >
                {project.db_name}
              </Link>
              <ListItemText
                primary={project.db_name}
                secondary={`Created on: ${new Date(project.created_at).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Projects;
