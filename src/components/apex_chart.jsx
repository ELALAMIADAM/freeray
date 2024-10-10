import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const ApexChart = () => {
  const [series, setSeries] = useState([{
    data: []
  }]);

  const [options] = useState({
    chart: {
      id: 'realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Active Power Over Time',
      align: 'left'
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime',
      title: {
        text: 'Time'
      }
    },
    yaxis: {
      title: {
        text: 'Active Power'
      },
      max: 100
    },
    legend: {
      show: false
    },
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/active-power');
      const data = response.data.map(entry => ({
        x: new Date(entry.temps), // Use "temps" as the timestamp field
        y: entry.Active_power   // Use "Active_power" for the y-value
      }));
      setSeries([{ data }]);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Fetch new data every 10 seconds
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="line" height={350} />
      </div>
    </div>
  );
};

export default ApexChart;