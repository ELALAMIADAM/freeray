import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SignalManager.css';

const SignalManager = () => {
  const [addressIp, setAddressIp] = useState('');
  const [signalName, setSignalName] = useState('');
  const [unity, setUnity] = useState('');
  const [gain, setgain] = useState('');
  const [type_data, settype_data] = useState('');
  const [quantity, setQuantity] = useState('');
  const [slaveName, setSlaveName] = useState('');
  const [message, setMessage] = useState('');
  const [Signal, setSignal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async (Address_ip) => {
    try {
      await axios.delete(`http://localhost:3001/deleteSignal/${Address_ip}`);
      setSignal(Signal.filter(signal => signal.Address_ip !== Address_ip)); 
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        address_ip: addressIp || null,
        signal_name: signalName || null,
        unity: unity || null,
        Quantity: quantity || null,
        gain: gain || null,
        type_data: type_data || null,
        slave_name: slaveName || null,
      };
  
      const response = await axios.post('http://localhost:3001/insert_signal', data);
      setMessage(response.data.message);
      setAddressIp('');
      setSignalName('');
      setUnity('');
      setQuantity('');
      setSlaveName('');
      setgain('');
      settype_data('');
      fetchData(); 
    } catch (error) {
      setMessage(`Error: ${error.response?.data.error || error.message}`);
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
        <div className="container_LIST">
          <table className="signal-slaves-table">
            <thead>
              <tr>
                <th>Signal_name</th>
                <th>Address_ip</th>
                <th>Unity</th>
                <th>Quantity</th>
                <th>type_data</th>
                <th>gain</th>
                <th>Slave_name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Signal.map((signal) => (
                <tr key={signal.signal_name + signal.Address_ip + signal.Unity + signal.Quantity + signal.type_data + signal.gain + signal.Slave_name}>
                  <td>{signal.signal_name}</td>
                  <td>{signal.Address_ip}</td>
                  <td>{signal.Unity}</td>
                  <td>{signal.Quantity}</td>
                  <td>{signal.type_data}</td>
                  <td>{signal.gain}</td>
                  <td>{signal.Slave_name}</td>
                  <td>
                    <button onClick={() => handleDelete(signal.Address_ip)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <label>Signal Name:</label>
            <input type="text" value={signalName} onChange={(e) => setSignalName(e.target.value)} />
          </div>
          <div>
            <label>Address IP:</label>
            <input type="number" min="1" value={addressIp} onChange={(e) => setAddressIp(e.target.value)} />
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
            <label>Type:</label>
            <select value={type_data} onChange={(e) => settype_data(e.target.value)}>
              <option value="" disabled>Select</option>
              <option value="I64">I64</option>
              <option value="I32">I32</option>
              <option value="I16">I16</option>
              <option value="U64">U64</option>
              <option value="U32">U32</option>
              <option value="U16">U16</option>
            </select>
          </div>
          <div>
            <label>Gain:</label>
            <select value={gain} onChange={(e) => setgain(e.target.value)}>
              <option value="" disabled>Select</option>
              <option value="1">1</option>
              <option value="10">10</option>
              <option value="100">100</option>
              <option value="1000">1000</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default SignalManager;
