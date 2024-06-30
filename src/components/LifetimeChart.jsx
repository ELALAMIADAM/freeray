import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import 'react-datepicker/dist/react-datepicker.css';
import './LifetimeChart.css';
const LifetimeChart = ({allSeries}) => {

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
              return date.toLocaleDateString('en-GB', { year:'numeric'});
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
      <div id="chart">
        <ReactApexChart options={options} series={allSeries} type="area" height={350} />
      </div>
      
    </div>
  );
};

export default LifetimeChart;
