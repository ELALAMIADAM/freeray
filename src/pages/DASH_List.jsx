import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DASH_List.module.css';

// Import the individual graph components
import Gradient_Circle from '../components/Gradient_Circle.jsx';
import Semi_Circular from '../components/Semi_Circular.jsx';
import Stroked_circular from '../components/Stroked_circular.jsx';
import Custom_Angle from '../components/Custom_Angle.jsx';
import Multiple_Radialbars from '../components/MultipleRadialbars.jsx';
import Pie from '../components/Pie.jsx';
import Radar from '../components/Radar.jsx';
import Multi_group from '../components/Multi_group.jsx';
import Line_chart from '../components/Line_chart.jsx';

const DASH_List = () => {
  const [addressIps, setAddressIps] = useState(['']);
  const [logicalAddresses, setLogicalAddresses] = useState(['']);
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [numSignals, setNumSignals] = useState(1);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);

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
    Line_chart,
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

  useEffect(() => {
    fetchData();
  }, [dataChanged]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      address_ip: addressIps,
      logical_address: logicalAddresses,
      group_name: groupName || 'DefaultGroup',
    };

    try {
      const response = await axios.post('http://localhost:3001/insert_graph', data);
      setMessage(response.data.message);
      setDataChanged(!dataChanged);
    } catch (error) {
      setMessage(`Error: ${error.response?.data.error || error.message}`);
    }
  };

  const handleGraphChange = (e) => {
    const selectedGraph = e.target.value;
    setGroupName(selectedGraph);
    let numAddresses = 1;

    if (selectedGraph === 'Custom_Angle' || selectedGraph === 'Pie' || selectedGraph === 'Multi_group' || selectedGraph === 'Line_chart') {
      numAddresses = numSignals;
    }

    setLogicalAddresses(Array(numAddresses).fill(''));
    setAddressIps(Array(numAddresses).fill(''));
  };

  const handleNumSignalsChange = (e) => {
    const num = parseInt(e.target.value);
    setNumSignals(num);
    setLogicalAddresses(Array(num).fill(''));
    setAddressIps(Array(num).fill(''));
  };

  const handleAddressIpChange = (index, value) => {
    const newAddressIps = [...addressIps];
    newAddressIps[index] = value;
    setAddressIps(newAddressIps);
  };

  const handleLogicalAddressChange = (index, value) => {
    const newLogicalAddresses = [...logicalAddresses];
    newLogicalAddresses[index] = value;
    setLogicalAddresses(newLogicalAddresses);
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
    <div className={styles.dashboardContainer}>
      <div className={styles.insertGraphContainer}>
        <form onSubmit={handleSubmit} className={styles.insertGraphForm}>
          <div>
            <label>Graph:</label>
            <select value={groupName} onChange={handleGraphChange}>
              <option value="" disabled>Select</option>
              <option value="Gradient_Circle">Gradient_Circle</option>
              <option value="Semi_Circular">Semi_Circular</option>
              <option value="Stroked_circular">Stroked_circular</option>
              <option value="Custom_Angle">Custom_Angle</option>
              <option value="Multiple_Radialbars">Multiple_Radialbars</option>
              <option value="Pie">Pie</option>
              <option value="Radar">Radar</option>
              <option value="Multi_group">Multi_group</option>
              <option value="Line_chart">Line_chart</option>
            </select>
          </div>
          {(groupName === 'Pie' || groupName === 'Custom_Angle' || groupName === 'Multi_group' || groupName === 'Line_chart') && (
            <div>
              <label>Number of Signals:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={numSignals}
                onChange={handleNumSignalsChange}
              />
            </div>
          )}
          <div className={styles.formGrid}>
            {logicalAddresses.map((logicalAddress, index) => (
              <div key={index} className={styles.formColumn}>
                <h2>Signal {index + 1}</h2>
                <div className={styles.formGroup}>
                  <label>Logical address {index + 1}:</label>
                  <input
                    type="number"
                    value={logicalAddress}
                    onChange={(e) => handleLogicalAddressChange(index, e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Address IP {index + 1}:</label>
                  <input
                    type="number"
                    value={addressIps[index]}
                    onChange={(e) => handleAddressIpChange(index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className={styles.button} type="submit">ADD TO DASHBOARD</button>
        </form>
        {SelectedChart && (
          <div className={styles.previewContainer}>
            <h2>Graph Preview</h2>
            <div className={styles.chartPreview}>
              <SelectedChart
                series={seriesArray[Object.keys(charts).indexOf(groupName)]}
                labels={labelsArray[Object.keys(charts).indexOf(groupName)]}
              />
            </div>
          </div>
        )}
        {message && <p className={styles.errorMessage}>{message}</p>}
      </div>
      <div className={styles.dataDashContainer}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div className={styles.containerList}>
            <h2>Dashboard Data</h2>
            <table className={styles.signalSlavesTable}>
              <thead>
                <tr>
                  <th>dashboard_id</th>
                  <th>Logical Address</th>
                  <th>Address IP</th>
                  <th>Signal Name</th>
                  <th>Slave Name</th>
                  <th>Graph Name</th>
                  <th>signal_value</th>
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
                      <button className={styles.button} onClick={() => handleDelete(data.dash_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DASH_List;
