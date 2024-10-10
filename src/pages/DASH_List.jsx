import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout.jsx';

// Import the individual graph components
import Gradient_Circle from '../components/Gradient_Circle.jsx';
import Semi_Circular from '../components/Semi_Circular.jsx';
import Stroked_circular from '../components/Stroked_circular.jsx';
import Custom_Angle from '../components/Custom_Angle.jsx';
import Multiple_Radialbars from '../components/MultipleRadialbars.jsx';
import Pie from '../components/Pie.jsx';
import Radar from '../components/Radar.jsx';
import Multi_group from '../components/Multi_group.jsx';
import GraphYield from '../components/Line_chart.jsx';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


const styles = {
  dashboardContainer: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  insertGraphContainer: {
    marginBottom: '20px',
  },
  insertGraphForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '10px',
  },
  button: {
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
  },
  previewContainer: {
    marginTop: '20px',
  },
  chartPreview: {
    marginTop: '10px',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
  },
  dataDashContainer: {
    marginTop: '20px',
  },
  containerList: {
    width: '100%',
    overflowX: 'auto',
  },
  signalSlavesTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  // signalSlavesTable th, signalSlavesTable td: {
  //   border: '1px solid #ddd',
  //   padding: '8px',
  // },
};

const DASH_List = () => {
  const [signalNames, setSignalNames] = useState(['']);
  const [slaveNames, setSlaveNames] = useState(['']);
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [numSignals, setNumSignals] = useState(1);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [signalOptions, setSignalOptions] = useState([]);
  const [slaveOptions, setSlaveOptions] = useState([]);

  // Define series and labels arrays for each graph type
  const seriesArray = [
    [75], [80], [80], [33, 75, 10, 80], [44, 55, 67, 83], [44, 55, 41, 17, 15], [{ name: 'Series 1', data: [20, 100, 40, 30, 50, 80, 33] }]
  ];
  const labelsArray = [
    ['Percent 1'], ['Percent 2'], ['Percent 3'], ['Percent 1', 'Percent 2', 'Percent 3', 'Percent 4'], ['Percent 1', 'Percent 2', 'Percent 3', 'Percent 4'], ['Percent 1', 'Percent 2', 'Percent 3', 'Percent 4', 'Percent 5']
  ];

  const charts = {
    Gradient_Circle,
    Semi_Circular,
    Stroked_circular,
    Custom_Angle,
    Multiple_Radialbars,
    Pie,
    Radar,
    Multi_group,
    GraphYield,
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/dashboard');
      setDashboardData(response.data.map(data => ({
        ...data,
        logical_address: Array.isArray(data.logical_address) ? data.logical_address.join(', ') : data.logical_address.toString(),
        address_ip: Array.isArray(data.address_ip) ? data.address_ip.join(', ') : data.address_ip.toString()
      })));
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [signalsRes, slavesRes] = await Promise.all([
        axios.get('http://localhost:3001/SignalList'),
        axios.get('http://localhost:3001/SlavesList')
      ]);
      setSignalOptions(signalsRes.data.map(signal => signal.signal_name));
      setSlaveOptions(slavesRes.data.map(slave => slave.slave_name));
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, [dataChanged]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      signal_name: signalNames,
      slave_name: slaveNames,
      group_name: groupName || 'DefaultGroup',
    };
  
    try {
      // Create group and get group_id
      const groupResponse = await axios.post('http://localhost:3001/create_group', { group_name: data.group_name });
      const groupId = groupResponse.data.group_id;
  
      // Insert each signal with the obtained group_id
      const insertPromises = data.signal_name.map((signal, index) => {
        return axios.post('http://localhost:3001/insert_dashboard_with_details', {
          group_id: groupId,
          slave_name: data.slave_name[index],
          signal_name: signal,
        });
      });
  
      await Promise.all(insertPromises);
  
      setMessage('Graph inserted successfully!');
      setDataChanged(!dataChanged);
    } catch (error) {
      setMessage(`Error: ${error.response?.data.error || error.message}`);
    }
  };
  
  
  
  

  const handleGraphChange = (e) => {
    const selectedGraph = e.target.value;
    setGroupName(selectedGraph);
    let numAddresses = 1;

    if (selectedGraph === 'Custom_Angle' || selectedGraph === 'Pie' || selectedGraph === 'Multi_group' || selectedGraph === 'GraphYield') {
      numAddresses = numSignals;
    }

    setSignalNames(Array(numAddresses).fill(''));
    setSlaveNames(Array(numAddresses).fill(''));
  };

  const handleNumSignalsChange = (e) => {
    const num = parseInt(e.target.value);
    setNumSignals(num);
    setSignalNames(Array(num).fill(''));
    setSlaveNames(Array(num).fill(''));
  };

  const handleSignalNameChange = (index, newValue) => {
    const newSignalNames = [...signalNames];
    newSignalNames[index] = newValue;
    setSignalNames(newSignalNames);
  };

  const handleSlaveNameChange = (index, newValue) => {
    const newSlaveNames = [...slaveNames];
    newSlaveNames[index] = newValue;
    setSlaveNames(newSlaveNames);
  };

  const handleDelete = async (dash_id) => {
    try {
      await axios.delete(`http://localhost:3001/deleteDash/${dash_id}`);
      setDashboardData(dashboardData.filter(data => data.dash_id !== dash_id));
    } catch (error) {
      setError(error.message);
    }
  };

  const SelectedChart = charts[groupName];

  return (
    <>    
    <Layout>
    <div style={styles.dashboardContainer}>
      <div style={styles.insertGraphContainer}>
      <Box sx={{ minWidth: 120 }}>

        <form onSubmit={handleSubmit} style={styles.insertGraphForm}>
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Graph</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={groupName}
                label="Graph"
                onChange={handleGraphChange}
              >
                <MenuItem value={"Gradient_Circle"}>Gradient_Circle</MenuItem>
                <MenuItem value={"Semi_Circular"}>Semi_Circular</MenuItem>
                <MenuItem value={"Stroked_circular"}>Stroked_circular</MenuItem>
                <MenuItem value={"Custom_Angle"}>Custom_Angle</MenuItem>
                <MenuItem value={"Multiple_Radialbars"}>Multiple_Radialbars</MenuItem>
                <MenuItem value={"Pie"}>Pie</MenuItem>
                <MenuItem value={"GraphYield"}>GraphYield</MenuItem>
              </Select>
            </FormControl>
            
          </div>
          {(groupName === 'Pie' || groupName === 'Custom_Angle' || groupName === 'Multi_group' || groupName === 'GraphYield') && (
            <div>
              <label>Number of Signals:</label>
              <input
                type="number"
                value={numSignals}
                onChange={handleNumSignalsChange}
                min="1"
              />
            </div>
          )}
          <div style={styles.formGrid}>
            {signalNames.map((signalName, index) => (
              <div key={index} style={styles.formColumn}>
                <h2>Signal {index + 1}</h2>
                <div style={styles.formGroup}>
                  <Autocomplete
                    disablePortal
                    id={`slave-name-autocomplete-${index}`}
                    options={slaveOptions}
                    value={slaveNames[index]}
                    onChange={(event, newValue) => handleSlaveNameChange(index, newValue)}
                    renderInput={(params) => <TextField {...params} label="Slave Name" />}
                  />
                </div>
                <div style={styles.formGroup}>
                  <Autocomplete
                    disablePortal
                    id={`signal-name-autocomplete-${index}`}
                    options={signalOptions}
                    value={signalName}
                    onChange={(event, newValue) => handleSignalNameChange(index, newValue)}
                    renderInput={(params) => <TextField {...params} label="Signal Name" />}
                  />
                </div>
              </div>
            ))}
          </div>
          <button type="submit" style={styles.button}>Insert Graph</button>
        </form>
      </Box>
      </div>
      <div style={styles.previewContainer}>
        {message && <div>{message}</div>}
        {SelectedChart && (
          <div style={styles.chartPreview}>
            <SelectedChart
              series={seriesArray[Object.keys(charts).indexOf(groupName)]}
              labels={labelsArray[Object.keys(charts).indexOf(groupName)]}
            />
          </div>
        )}
      </div>
      <div style={styles.dataDashContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={styles.errorMessage}>Error: {error}</p>
        ) : (
          <div style={styles.containerList}>
            <h2>Signal/Slaves</h2>
            <table style={styles.signalSlavesTable}>
              <thead>
                <tr>
                  <th>Group ID</th>
                  <th>Signal Name</th>
                  <th>Slave Name</th>
                  <th>Group Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.map(data => (
                  <tr key={data.dash_id}>
                    <td>{data.group_id}</td>
                    <td>{data.signal_name}</td>
                    <td>{data.slave_name}</td>
                    <td>{data.group_name}</td>
                    <td>
                      <button onClick={() => handleDelete(data.dash_id)} style={styles.button}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </Layout>
    </>
  );
};

export default DASH_List;
