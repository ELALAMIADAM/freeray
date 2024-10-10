import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MonthChart.css';

const MonthChart = ({allSeries}) => {
  // const initialDate = new Date('2024-05'); // Start of the initial month
  const initialMonthDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // This will always be the start of the current month

  const [selectedDate, setSelectedDate] = useState(initialMonthDate);

  const filterSeriesByDate = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    return allSeries.map(series => ({
        ...series,
        data: series.data.filter(([time]) => {
            const currentTime = new Date(time);
            return currentTime >= startOfMonth && currentTime <= endOfMonth;
        })
    }));
  };

  const [series, setSeries] = useState(filterSeriesByDate(initialMonthDate));

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
              return date.toLocaleDateString('en-GB', { month: 'short', day: '2-digit' });
          }
      },
      min: new Date(initialMonthDate.getFullYear(), initialMonthDate.getMonth(), 1).getTime(),
      max: new Date(initialMonthDate.getFullYear(), initialMonthDate.getMonth() + 1, 0, 23, 59, 59, 999).getTime()
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
          showMonthYearPicker
          dateFormat="yyyy-MM"
          className="custom-date-picker" 
        />
      </div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="area" height={350} width={700} />
      </div>
    </div>
  );
};

export default MonthChart;
