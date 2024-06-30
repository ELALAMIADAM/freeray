import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DailyChart from '../components/DailyChart.jsx';
import MonthChart from '../components/MonthChart.jsx';
import YearChart from '../components/YearChart.jsx';
import LifetimeChart from '../components/LifetimeChart.jsx';


function graph_yield() {
  const [selectedChart, setSelectedChart] = useState('day');
  const [allSeries, setAllSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    switch (selectedChart) {
      case 'day':
        fetchDataDay();
        break; 
      case 'month':
        fetchDataMonth();
        break;
      case 'year':
        fetchDataYear();
        break; 
      case 'lifetime':
        fetchDataLife();
        break;
      default:
        fetchDataDay();
    }
  }, [selectedChart]); // Ensure the effect runs when selectedChart changes
  

  const fetchDataDay = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/chartDataDay');
      const transformedData = transformDataD(response.data);
      setAllSeries(transformedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const fetchDataMonth = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/chartDataMonth');
      const transformedData = transformDataM(response.data);
      setAllSeries(transformedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const fetchDataYear = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/chartDataYear');
      const transformedData = transformDataYM(response.data);
      setAllSeries(transformedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const fetchDataLife = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/chartDataLife');
      const transformedData = transformDataYear(response.data);
      setAllSeries(transformedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const transformDataYear = (data) => {
    // Group data by series
    const seriesMap = new Map();
  
    data.forEach(({ year, total_value }) => {
      if (!seriesMap.has('series1')) {
        seriesMap.set('series1', []);
      }
      seriesMap.get('series1').push([new Date(year, 0).getTime(), parseInt(total_value)]);
    });
  
    // Convert map to array of series objects
    return Array.from(seriesMap, ([name, data]) => ({ name, data }));
  };
  
  const transformDataYM = (data) => {
    // Group data by series
    const seriesMap = new Map();
  
    data.forEach(({ month, total_value }) => {
      if (!seriesMap.has('series1')) {
        seriesMap.set('series1', []);
      }
      seriesMap.get('series1').push([new Date(month).getTime(), parseInt(total_value)]);
    });
  
    // Convert map to array of series objects
    return Array.from(seriesMap, ([name, data]) => ({ name, data }));
  };
  
  
  const transformDataM = (data) => {
    // Group data by series
    const seriesMap = new Map();
  
    data.forEach(({ date, total_value }) => {
      const timestamp = new Date(date).getTime();
      if (!seriesMap.has('series1')) {
        seriesMap.set('series1', []);
      }
      seriesMap.get('series1').push([timestamp, parseInt(total_value)]);
    });
  
    // Convert map to array of series objects
    return Array.from(seriesMap, ([name, data]) => ({ name, data }));
  };
  
  
  const transformDataD = (data) => {
    // Group data by series
    const seriesMap = new Map();

    data.forEach(({ datetime, value }) => {
      const date = new Date(datetime).getTime();
      if (!seriesMap.has('series1')) {
        seriesMap.set('series1', []);
      }
      seriesMap.get('series1').push([date, value]);
    });

    // Convert map to array of series objects
    return Array.from(seriesMap, ([name, data]) => ({ name, data }));
  };

  const renderChart = () => {
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error: {error}</p>;
    } else {
      switch (selectedChart) {
        case 'day':
          return <DailyChart allSeries={allSeries} />;
        case 'month':
          return <MonthChart allSeries={allSeries} />;
        case 'year':
          return <YearChart allSeries={allSeries} />;
        case 'lifetime':
          return <LifetimeChart allSeries={allSeries} />;
        default:
          return <DailyChart allSeries={allSeries} />;
      }
    }
  };

  return (
    <div>
      
    <div className="containers">
      <div className="chart-buttons">
        <button className={selectedChart === 'day' ? 'selected' : ''} onClick={() => setSelectedChart('day')}>Day</button>
        <button className={selectedChart === 'month' ? 'selected' : ''} onClick={() => setSelectedChart('month')}>Month</button>
        <button className={selectedChart === 'year' ? 'selected' : ''} onClick={() => setSelectedChart('year')}>Year</button>
        <button className={selectedChart === 'lifetime' ? 'selected' : ''} onClick={() => setSelectedChart('lifetime')}>Lifetime</button>
      </div>

      <div className="chart-container">
        {renderChart()}
      </div>
    </div>
    </div>
  );
}

export default graph_yield;
