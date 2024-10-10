import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Gradient_Circle from './Gradient_Circle.jsx';
import Semi_Circular from './Semi_Circular.jsx';
import Stroked_circular from './Stroked_circular.jsx';
import Custom_Angle from '../components/Custom_Angle.jsx';
import Multiple_Radialbars from './MultipleRadialbars.jsx';
import Pie from './Pie.jsx';
import Radar from './Radar.jsx';
import Multi_group from './Multi_group.jsx';
import GraphYield from './GraphYield.jsx'; // Updated import
import styles from './DASH_ADDED.module.css'; 

function DASH_ADDED() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/dashboard');
      const groupedData = response.data.reduce((acc, item) => {
        if (!acc[item.group_id]) {
          acc[item.group_id] = {
            group_name: item.group_name,
            signal_values: [],
            signal_names: []
          };
        }
        acc[item.group_id].signal_values.push(item.signal_value);
        acc[item.group_id].signal_names.push(item.signal_name);
        return acc;
      }, {});
      setDashboardData(groupedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
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

  const chartComponents = {
    'Gradient_Circle': Gradient_Circle,
    'Semi_Circular': Semi_Circular,
    'Stroked_circular': Stroked_circular,
    'Custom_Angle': Custom_Angle,
    'Multiple_Radialbars': Multiple_Radialbars,
    'Pie': Pie,
    'Radar': Radar,
    'Multi_group': Multi_group,
    'GraphYield': GraphYield
  };

  return (
    <div>
      <div className={styles.dashboardGrid}>
        {Object.keys(dashboardData).map(groupId => {
          const chartData = dashboardData[groupId];
          const ChartComponent = chartComponents[chartData.group_name];
          return ChartComponent ? (
            <div className={styles.dashboardItem} key={groupId}>
              <ChartComponent series={chartData.signal_values} labels={chartData.signal_names} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

export default DASH_ADDED;
