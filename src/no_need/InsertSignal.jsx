import React, { useState } from 'react';
import axios from 'axios';

const InsertSignal = () => {
  const [addressIp, setAddressIp] = useState('');
  const [signalName, setSignalName] = useState('');
  const [unity, setUnity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [slaveName, setSlaveName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        address_ip: addressIp || null,
        signal_name: signalName || null,
        unity: unity || null,
        Quantity: quantity || null,
        slave_name: slaveName || null,
      };
  
      const response = await axios.post('http://localhost:3001/insert_signal', data);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(`Error: ${error.response?.data.error || error.message}`);
    }
  };
  

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Address IP:</label>
          <input type="number" min="1" value={addressIp} onChange={(e) => setAddressIp(e.target.value)} />
        </div>
        <div>
          <label>Signal Name:</label>
          <input type="text" value={signalName} onChange={(e) => setSignalName(e.target.value)} />
        </div>
        <div>
          <label>Unity:</label>
          <input type="text" value={unity} onChange={(e) => setUnity(e.target.value)} />
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
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

export default InsertSignal;
