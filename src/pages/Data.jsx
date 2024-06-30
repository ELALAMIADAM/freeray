import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SignalSlavesList.css'; 

const Data = () => {
  const [signalSlaves, setSignalSlaves] = useState([]);
  const [logicalAddressFilter, setLogicalAddressFilter] = useState('');
  const [addressIpFilter, setAddressIpFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/signal_slaves', {
        params: {
          logical_address: logicalAddressFilter,
          address_ip: addressIpFilter
        }
      });
      setSignalSlaves(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleLogicalAddressChange = (e) => {
    setLogicalAddressFilter(e.target.value);
  };

  const handleAddressIpChange = (e) => {
    setAddressIpFilter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container_LIST">
      <h2>Signal Slaves List</h2>
      <div className="filter">
        <form onSubmit={handleSubmit}>
          <div className="filter-input">
            <label htmlFor="logicalAddressFilter">Filter by Logical Address:</label>
            <input
              type="number"
              min="0"
              id="logicalAddressFilter"
              value={logicalAddressFilter}
              onChange={handleLogicalAddressChange}
            />
          </div>
          <div className="filter-input">
            <label htmlFor="addressIpFilter">Filter by Address IP:</label>
            <input
              type="number"
              min="0"
              id="addressIpFilter"
              value={addressIpFilter}
              onChange={handleAddressIpChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <table className="signal-slaves-table">
        <thead>
          <tr>
            <th>Slave name</th>
            <th>Logical Address</th>
            <th>Signal name</th>
            <th>Signal Value</th>
          </tr>
        </thead>
        <tbody>
          {signalSlaves.map((slave) => (
            <tr key={slave.logical_address + slave.slave_name + slave.signal_value + slave.signal_name}>
              <td>{slave.slave_name}</td>
              <td>{slave.logical_address}</td>
              <td>{slave.signal_name}</td>
              <td>{slave.signal_value + ' ' + slave.unity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Data;
