// src/components/InsertForm.js
import React, { useState } from 'react';
import axios from 'axios';

const InsertSlave = () => {
  const [logicalAddress, setLogicalAddress] = useState('');
  const [slaveName, setSlaveName] = useState('');
  const [message, setMessage] = useState('');

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
  } catch (error) {
    setMessage(`Error: ${error.response?.data.error || error.message}`);
  }
};

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Logical Address:</label>
          <input type="number" min='1' value={logicalAddress} onChange={(e) => setLogicalAddress(e.target.value)} />
        </div>
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
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default InsertSlave;
