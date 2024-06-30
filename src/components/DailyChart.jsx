import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DailyChart.css';

const DailyChart = ({ allSeries }) => {
  const initialDate = new Date('2024-05-01');
  // const initialDate = new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const filterSeriesByDate = (date) => {
    const startOfDay = date.setHours(0, 0, 0, 0);
    const endOfDay = date.setHours(23, 59, 59, 999);

    return allSeries.map(series => ({
      ...series,
      data: series.data.filter(([time]) => time >= startOfDay && time <= endOfDay)
    }));
  };

  const [series, setSeries] = useState(filterSeriesByDate(initialDate));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSeries(filterSeriesByDate(date));
  };

  const getChartOptions = (date) => {
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);

    return {
      chart: {
        height: 350,
        type: 'area',
        zoom: {
          autoScaleYaxis: true,
        },
      },
      title: {
        text: 'My Chart Title',
        align: 'left'
      },
      subtitle: {
        text: 'My Chart Subtitle',
        align: 'left'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      grid: {
        show: true,
        borderColor: '#90A4AE',
        strokeDashArray: 1,
        position: 'back',
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        row: {
          colors: undefined,
          opacity: 0.5
        },
        column: {
          colors: undefined,
          opacity: 0.5
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
      },
      xaxis: {
        type: 'datetime',
        min: startOfDay,
        max: endOfDay,
        labels: {
          formatter: function (value, timestamp) {
            const date = new Date(timestamp);
            if (date.getHours() === 0 && date.getMinutes() === 0) {
              return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
            }
            return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          }
        }
      },
      yaxis: {
        min: 0 
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
    };
  };

  const [options, setOptions] = useState(getChartOptions(initialDate));

  useEffect(() => {
    setOptions(getChartOptions(selectedDate));
  }, [selectedDate]);

  return (
    <div className="chart-container">
      <div className="date-picker-container">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="custom-date-picker" 
        />
      </div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="area" height={350} />
      </div>
      <div id="html-dist">
        {/* Your HTML distribution content */}
      </div>
    </div>
  );
};

export default DailyChart;
