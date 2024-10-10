import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const styles = {
  // pageBackground: {
  //   background: 'url(/images/slave.jpg) no-repeat center center fixed',
  //   backgroundSize: 'cover',
  //   minHeight: '90vh',
  //   padding: '20px',
  // },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: '20px'
  },
  app: {
    flex: 1,
    margin: '10px 0',
    maxWidth: '100%'
  },
  appList: {
    flex: 3
  },
  appInsert: {
    flex: 1
  },
  form: {
    background: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: '100%',
    padding: '10px'
  },
  formDiv: {
    marginBottom: '15px'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  buttonHover: {
    backgroundColor: '#0056b3'
  },
  error: {
    color: '#dc3545',
    fontWeight: 'bold'
  },
  table: {
    width: '100%'
  },
  signalTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'
  },
  signalTableThTd: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left'
  },
  signalTableTh: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  signalTableTd: {
    backgroundColor: '#fff'
  },
  signalTableTrEven: {
    backgroundColor: '#f9f9f9'
  },
  signalTableTrHover: {
    backgroundColor: '#f1f1f1'
  },
  deleteButton: {
    backgroundColor: '#d22424',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  deleteButtonHover: {
    backgroundColor: '#e60000'
  }
};

const SignalManager = () => {
  const [signalName, setSignalName] = useState('');
  const [slaveName, setSlaveName] = useState('');
  const [message, setMessage] = useState('');
  const [signal, setSignal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/SignalList');
      setSignal(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      let endpoint = '';
      switch (slaveName) {
        case 'SmartLogger':
          endpoint = 'http://localhost:3001/api/signal-namesSL';
          break;
        case 'Inverter':
          endpoint = 'http://localhost:3001/api/signal-namesIN';
          break;
        case 'EMI':
          endpoint = 'http://localhost:3001/api/signal-namesEMI';
          break;
        case 'POWER METER':
          endpoint = 'http://localhost:3001/api/signal-namesPM';
          break;
        default:
          endpoint = 'http://localhost:3001/api/signal-names';
      }
      const response = await axios.get(endpoint);
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching signal names:', error);
    }
  };

  useEffect(() => {
    if (slaveName) {
      fetchOptions();
    }
  }, [slaveName]);

  const handleDelete = async (Address_ip) => {
    try {
      await axios.delete(`http://localhost:3001/deleteSignal/${Address_ip}`);
      setSignal(signal.filter(sig => sig.Address_ip !== Address_ip));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        signal_name: signalName || null,
        slave_name: slaveName || null,
      };
      
      let endpoint = 'http://localhost:3001/insert_signal'; // Default endpoint for signals
      
      if (data.slave_name === 'Inverter') {
        endpoint = 'http://localhost:3001/insert_inverter'; // Override endpoint for inverters
      }
  
      const response = await axios.post(endpoint, data);
      setMessage(response.data.message);
      setSignalName('');
      setSlaveName('');
      fetchData(); // Assuming fetchData() fetches updated data after insertion
    } catch (error) {
      setMessage(`Error: ${error.response?.data.error || error.message}`);
    }
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
      <div style={{ ...styles.app, ...styles.appList }}>
        <div className="container_LIST">
          <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={2}>
                      Signal
                    </TableCell>
                    <TableCell align="center" colSpan={6}>
                      Details
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ top: 57, minWidth: 170 }}>Signal Name</TableCell>
                    <TableCell style={{ top: 57, minWidth: 100 }}>Address IP</TableCell>
                    <TableCell style={{ top: 57, minWidth: 100 }}>Unity</TableCell>
                    <TableCell style={{ top: 57, minWidth: 100 }}>Quantity</TableCell>
                    <TableCell style={{ top: 57, minWidth: 100 }}>Type</TableCell>
                    <TableCell style={{ top: 57, minWidth: 100 }}>Gain</TableCell>
                    <TableCell style={{ top: 57, minWidth: 100 }}>Slave Name</TableCell>
                    <TableCell style={{ top: 57, minWidth: 100 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {signal
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((sig) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={`${sig.signal_name}-${sig.Address_ip}`}>
                        <TableCell>{sig.signal_name}</TableCell>
                        <TableCell>{sig.Address_ip}</TableCell>
                        <TableCell>{sig.Unity}</TableCell>
                        <TableCell>{sig.Quantity}</TableCell>
                        <TableCell>{sig.type_data}</TableCell>
                        <TableCell>{sig.gain}</TableCell>
                        <TableCell>{sig.Slave_name}</TableCell>
                        <TableCell>
                          <button 
                            style={styles.deleteButton} 
                            onClick={() => handleDelete(sig.Address_ip)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.deleteButtonHover.backgroundColor}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.deleteButton.backgroundColor}
                          >
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={signal.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
      <div style={{ ...styles.app, ...styles.appInsert }}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formDiv}>
            <FormControl fullWidth>
              <InputLabel id="slave-name-select-label">Slave Name</InputLabel>
              <Select
                labelId="slave-name-select-label"
                id="slave-name-select"
                value={slaveName}
                label="Slave Name"
                onChange={(e) => setSlaveName(e.target.value)}
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
            <Autocomplete
              disablePortal
              id="signal-name-autocomplete"
              options={options}
              value={signalName}
              onChange={(event, newValue) => setSignalName(newValue)}
              renderInput={(params) => <TextField {...params} label="Signal Name" />}
            />
          </div>
          <button 
            type="submit" 
            style={styles.button} 
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            Submit
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
      </div>  
    </div>
  );
};

export default SignalManager;
