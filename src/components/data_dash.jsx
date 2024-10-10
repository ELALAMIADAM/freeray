import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataDash = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async (dash_id) => {
    try {
      await axios.delete(`http://localhost:3001/deleteDash/${dash_id}`);
      setDashboardData(dashboardData.filter(data => data.dash_id !== dash_id));
    } catch (error) {
      setError(error.message);
    }
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
    <div>
      <h2>Dashboard Data</h2>
      <table>
        <thead>
          <tr>
            <th>Dashboard ID</th>
            <th>Logical Address</th>
            <th>Address IP</th>
            <th>Signal Name</th>
            <th>Slave Name</th>
            <th>Graph Name</th>
            <th>Signal Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData.map((data) => (
            <tr key={data.dash_id}>
              <td>{data.group_id}</td>
              <td>{data.logical_address}</td>
              <td>{data.address_ip}</td>
              <td>{data.signal_name}</td>
              <td>{data.slave_name}</td>
              <td>{data.group_name}</td>
              <td>{data.signal_value}</td>
              <td>
                <button onClick={() => handleDelete(data.dash_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataDash;
