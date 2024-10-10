import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, InputLabel, MenuItem, FormControl, Select, TextField, Button
} from '@mui/material';

const styles = {
  // pageBackground: {
  //   background: 'url(/images/slave.jpg) no-repeat center center fixed',
  //   backgroundSize: 'cover',
  //   minHeight: '90vh',
  //   padding: '20px',
  // },
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: '20px',
  },
  App: {
    flex: 1,
    margin: '0 10px',
  },
  list: {
    flex: 2,
  },
  insert: {
    flex: 1,
  },
  form: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: '20px auto',
  },
  formDiv: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    margin: '5px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '14px',
  },
  delete: {
    backgroundColor: '#ff4d4d',
    color: 'white',
  },
  deleteHover: {
    backgroundColor: '#e60000',
  },
  set: {
    backgroundColor: 'blue',
    color: 'white',
  },
  selected: {
    backgroundColor: 'green',
    color: 'white',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  error: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  signalTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
  },
  signalTableTh: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  signalTableTd: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#fff',
  },
  signalTableTrEven: {
    backgroundColor: '#f9f9f9',
  },
  signalTableTrHover: {
    backgroundColor: '#f1f1f1',
  },
  '@media (max-width: 768px)': {
    container: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    App: {
      margin: '10px 0',
      maxWidth: '100%',
    },
    form: {
      maxWidth: '100%',
      padding: '10px',
    },
  },
};



const SlaveManager = () => {
  const [slaves, setSlaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logicalAddress, setLogicalAddress] = useState('');
  const [slaveName, setSlaveName] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/SlavesList');
      setSlaves(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (logical_address) => {
    try {
      await axios.delete(`http://localhost:3001/deleteSlave/${logical_address}`);
      setSlaves(slaves.filter((slave) => slave.logical_address !== logical_address));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (slaveName === '') {
      setMessage('Please select a valid option');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/insert_slave', {
        logical_address: logicalAddress,
        slave_name: slaveName,
      });
      setMessage(response.data.message);
      setLogicalAddress('');
      setSlaveName('');
      fetchData(); // Fetch updated list of slaves after insertion
    } catch (error) {
      setMessage(`Error: ${error.response?.data.error || error.message}`);
    }
  };

  const handleSelectChange = (event) => {
    setSlaveName(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.pageBackground}>
    <div style={styles.container}>
      <div style={{ ...styles.App, ...styles.list }}>
        <Paper sx={{ width: '100%' }}>
          <TableContainer sx={{ maxHeight: 550 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ top: 7, minWidth: 100 }}>Slave Name</TableCell>
                  <TableCell style={{ top: 7, minWidth: 100 }}>Logical Address</TableCell>
                  <TableCell style={{ top: 7, minWidth: 100 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slaves.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.logical_address}>
                    <TableCell>{row.slave_name}</TableCell>
                    <TableCell>{row.logical_address}</TableCell>
                    <TableCell>
                      <Button
                        style={styles.delete}
                        onClick={() => handleDelete(row.logical_address)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.deleteHover.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.delete.backgroundColor}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={slaves.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      <div style={{ ...styles.App, ...styles.insert }}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formDiv}>
            <FormControl fullWidth>
              <InputLabel id="slave-name-select-label">Slave Name</InputLabel>
              <Select
                labelId="slave-name-select-label"
                id="slave-name-select"
                value={slaveName}
                label="Slave Name"
                onChange={handleSelectChange}
                inputProps={{ style: styles.input }}
              >
                <MenuItem value="" disabled>Select</MenuItem>
                <MenuItem value="SmartLogger">SmartLogger</MenuItem>
                <MenuItem value="EMI">EMI</MenuItem>
                <MenuItem value="Inverter">Inverter</MenuItem>
                <MenuItem value="POWER METER">POWER METER</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={styles.formDiv}>
            <TextField
              id="outlined-number"
              label="Logical Address"
              type="number"
              min="1"
              value={logicalAddress}
              onChange={(e) => setLogicalAddress(e.target.value)}
              InputLabelProps={{ shrink: true }}
              style={styles.input}
            />
          </div>
          <Button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.set.backgroundColor}
          >
            Submit
          </Button>
        </form>
        {message && <p style={styles.error}>{message}</p>}
      </div>
    </div>    
    </div>

  );
};

export default SlaveManager;
