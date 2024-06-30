import React, { useState } from 'react';
import axios from 'axios';
import './Insertgraph.css';

import Gradient_Circle from '../components/Gradient_Circle.jsx';
import Semi_Circular from '../components/Semi_Circular.jsx';
import Stroked_circular from '../components/Stroked_circular.jsx';
import Custom_Angle from '../components/Custom_Angle.jsx';
import Multiple_Radialbars from '../components/MultipleRadialbars.jsx';
import Pie from '../components/Pie.jsx';
import Radar from '../components/Radar.jsx';
import Multi_group from '../components/Multi_group.jsx';
import Line_chart from './Line_chart.jsx';

const Insertgraph = () => {
  const [addressIps, setAddressIps] = useState(['']);
  const [logicalAddresses, setLogicalAddresses] = useState(['']);
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [numSignals, setNumSignals] = useState(1);

  const seriesArray = [[75], [80], [80], [33, 75, 10, 80], [44, 55, 67, 83], [44, 55, 41, 17, 15], [{ name: 'Series 1', data: [20, 100, 40, 30, 50, 80, 33] }]];
  const labelsArray = [['Percent 1'], ['Percent 2'], ['Percent 3'], [['Percent 1'], ['Percent 2'], ['Percent 3'], ['Percent 4']], [['Percent 1'], ['Percent 2'], ['Percent 3'], ['Percent 4']], [['Percent 1'], ['Percent 2'], ['Percent 3'], ['Percent 4'], ['Percent 5']]];
  const charts = {
    Gradient_Circle,
    Semi_Circular,
    Stroked_circular,
    Custom_Angle,
    Multiple_Radialbars,
    Pie,
    Radar,
    Multi_group,
    Line_chart
  };

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

  const SelectedChart = charts[groupName];

  return (
    <div className="insertgraph-container">
      <form onSubmit={handleSubmit} className="insertgraph-form">
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
        {(groupName === 'Pie' || groupName === 'Custom_Angle'  || groupName === 'Multi_group' || groupName === 'Line_chart') && (
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
        <div className="form-grid">
          {logicalAddresses.map((logicalAddress, index) => (
            <div key={index} className="form-column">
              <h2>Signal {index + 1}</h2>
              <div className="form-group">
                <label>Logical address {index + 1}:</label>
                <input
                  type="number"
                  value={logicalAddress}
                  onChange={(e) => handleLogicalAddressChange(index, e.target.value)}
                />
              </div>
              <div className="form-group">
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
        <button type="submit">ADD TO DASHBOARD</button>
      </form>
      {SelectedChart && (
        <div className="preview-container">
          <h2>Graph Preview</h2>
          <div className="chart-preview">
            <SelectedChart
              series={seriesArray[Object.keys(charts).indexOf(groupName)]}
              labels={labelsArray[Object.keys(charts).indexOf(groupName)]}
            />
          </div>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Insertgraph;
