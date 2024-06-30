import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SlavesManager.css';

const SlaveManager = () => {
  const [Slaves, setSlaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logicalAddress, setLogicalAddress] = useState('');
  const [slaveName, setSlaveName] = useState('');
  const [SMP, setSMP] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  
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
        SMP:SMP,
      });
      setMessage(response.data.message);
  
      // Fetch updated list of slaves after insertion
      const updatedResponse = await axios.get('http://localhost:3001/SlavesList');
      setSlaves(updatedResponse.data);
    } catch (error) {
      setMessage(`Error: ${error.response?.data.error || error.message}`);
    }
  };
  

  useEffect(() => {
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
    fetchData();
  }, []);


  const handleSetAction = async (logical_address) => {
    setSelectedAddress(logical_address);
    console.log(`SET action for logical address: ${logical_address}`);
    try {
      const response = await axios.post('http://localhost:3001/SLP', {
        logical_address: logical_address,
      });
      setMessage(response.data.message);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (logical_address) => {
    try {
      await axios.delete(`http://localhost:3001/deleteSlave/${logical_address}`);
      setSlaves(Slaves.filter(slave => slave.logical_address !== logical_address));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
    <div className="App list">
    
      <table className="signal-slaves-table">
        <thead>
          <tr>
            <th>Logical Address</th>
            <th>Slave Name</th>
            <th>SmartLogger</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Slaves.map((slave) => (
            <tr key={slave.logical_address + slave.slave_name + slave.SMP}>
              <td>{slave.logical_address}</td>
              <td>{slave.slave_name}</td>
              <td>{slave.SMP}</td>
              <td>
                <button onClick={() => handleDelete(slave.logical_address)}>Delete</button>
                {slave.slave_name === 'SmartLogger' && (
                    <button
                      className={selectedAddress === slave.logical_address ? 'selected' : 'set'}
                      onClick={() => handleSetAction(slave.logical_address)}
                    >
                      {selectedAddress === slave.logical_address ? 'Selected' : 'SET'}
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="App insert">
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Slave Name:</label>
          <select value={slaveName} onChange={(e) => setSlaveName(e.target.value)}>
            <option value="" disabled>Select</option>
            <option value="SmartLogger">SmartLogger</option>
            <option value="EMI">EMI</option>
            <option value="SUN2000">SUN2000</option>
            <option value="POWER METER">POWER METER</option>
          </select>
        </div>
        <div>
          <label>Logical Address:</label>
          <input type="number" min='1' value={logicalAddress} onChange={(e) => setLogicalAddress(e.target.value)} />
        </div>
        {(slaveName !== 'SmartLogger' && slaveName !== '') && (
          <div>
            <label>SMP:</label>
            <input
              type="number"
              value={SMP}
              onChange={(e) => setSMP(e.target.value)}
            />
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default SlaveManager;
