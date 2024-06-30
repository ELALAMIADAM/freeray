import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SignalList = () => {
  const [Signal, setSignal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchData();
  }, []);
  const handleDelete = async (Address_ip) => {
    try {
      await axios.delete(`http://localhost:3001/deleteSignal/${Address_ip}`);
      setSignal(Signal.filter(signal => signal.Address_ip !== Address_ip)); 
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
    <div className="container_LIST">
      
      <table className="signal-slaves-table">
        <thead>
          <tr>
            <th>Signal_name</th>
            <th>Address_ip</th>
            <th>Unity</th>
            <th>Quantity</th>
            <th>Slave_name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Signal.map((signal) => (
            <tr key={signal.signal_name + signal.Address_ip + signal.Unity + signal.Quantity + signal.Slave_name  }>
              <td>{signal.signal_name}</td>
              <td>{signal.Address_ip}</td>
              <td>{signal.Unity}</td>
              <td>{signal.Quantity}</td>
              <td>{signal.Slave_name}</td>
              <td>
                <button onClick={() => handleDelete(signal.Address_ip)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SignalList;










