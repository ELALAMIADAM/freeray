import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './YearChart.css'; // Updated import for standard CSS

const YearChart = ({ allSeries }) => {
  const initialDate = new Date(new Date().getFullYear(), 0, 1);

  const [selectedDate, setSelectedDate] = useState(initialDate);

  const filterSeriesByDate = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);

    return allSeries.map(series => ({
      ...series,
      data: series.data.filter(([time]) => {
        const currentTime = new Date(time);
        return currentTime >= startOfYear && currentTime <= endOfYear;
      })
    }));
  };

  const [series, setSeries] = useState(filterSeriesByDate(initialDate));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSeries(filterSeriesByDate(date));
  };

  const [options] = useState({
    chart: {
      height: 350,
      type: 'area'
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
      labels: {
        formatter: function (value) {
          const date = new Date(value);
          return date.toLocaleDateString('en-GB', { month: '2-digit' });
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
  });

  return (
    <div className="chart-container">
      <div className="date-picker-container">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          showYearPicker
          dateFormat="yyyy"
          className="custom-date-picker"
        />
      </div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="area" height={350} width={700}/>
      </div>
    </div>
  );
};

export default YearChart;
