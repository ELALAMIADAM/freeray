import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Data.module.css'; // Updated import for CSS module
import Layout from '../Layout.jsx';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const Data = () => {
  const [signalSlaves, setSignalSlaves] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/signal_slaves');
      setSignalSlaves(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 1000); // Refresh every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'slave_name', headerName: 'Slave Name', width: 150 },
    { field: 'logical_address', headerName: 'Logical Address', width: 150 },
    { field: 'signal_name', headerName: 'Signal Name', width: 250 },
    { field: 'signal_value', headerName: 'Signal Value', width: 150 },
    { field: 'unity', headerName: 'Unity', width: 100 },
    { field: 'device_status', headerName: 'Device Status', width: 150 }, // Added column
  ];

  const rows = signalSlaves.map((slave, index) => ({
    id: index,
    slave_name: slave.slave_name,
    logical_address: slave.logical_address,
    signal_name: slave.signal_name,
    signal_value: slave.signal_value,
    unity: slave.unity,
    device_status: slave.device_status, // Added field
  }));

  return (
    <Layout>
      <div className={styles.container_LIST}>
        <h2>Signal Slaves List</h2>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </Layout>
  );
};

export default Data;
