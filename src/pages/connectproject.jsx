import React, { useState } from 'react';
import axios from 'axios';

const connectproject = () => {
  const [projectName, setProjectName] = useState('');

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/createProject', { projectName });
      console.log(response.data);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Create Project</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input
            type="text"
            value={projectName}
            onChange={handleProjectNameChange}
            required
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  header: {
    fontSize: '2em',
    marginBottom: '20px',
  },
  form: {
    width: '50%',
    maxWidth: '400px',
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '1em',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1em',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
};

export default connectproject;

