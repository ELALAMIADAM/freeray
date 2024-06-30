import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SlaveList = () => {
  const [Slaves, setSlaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="container_LIST">
      <table className="signal-slaves-table">
        <thead>
          <tr>
            <th>Logical Address</th>
            <th>Slave Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Slaves.map((slave) => (
            <tr key={slave.logical_address + slave.slave_name}>
              <td>{slave.logical_address}</td>
              <td>{slave.slave_name}</td>
              <td>
                <button onClick={() => handleDelete(slave.logical_address)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SlaveList;
