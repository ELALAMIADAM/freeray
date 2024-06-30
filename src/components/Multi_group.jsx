import React from 'react';
import ReactApexChart from 'react-apexcharts';

function Multi_group() {

  const series = [
    {
      name: 'Blue',
      data: [
        { x: 'Category 1', y: 503 },
        { x: 'Category 2', y: 580 },
        { x: 'Category 3', y: 135 },
      ],
    },
    {
      name: 'Green',
      data: [
        { x: 'Category 1', y: 733 },
        { x: 'Category 2', y: 385 },
        { x: 'Category 3', y: 715 },
      ],
    },
    {
      name: 'Orange',
      data: [
        { x: 'Category 1', y: 255 },
        { x: 'Category 2', y: 211 },
        { x: 'Category 3', y: 441 },
      ],
    },
    {
      name: 'Red',
      data: [
        { x: 'Category 1', y: 428 },
        { x: 'Category 2', y: 749 },
        { x: 'Category 3', y: 559 },
      ],
    },
  ];

  const options = {
    chart: {
      height: 350,
      width: 600,
      type: 'line',
    },
    tooltip: {
      followCursor: true,
      intersect: false,
      shared: true,
    },
    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
      },
      formatter(val, opts) {
        const seriesName = opts.w.config.series[opts.seriesIndex].name;
        return val !== null ? seriesName : '';
      },
    },
    yaxis: {
      show: true,
      labels: {
        show: true,
      },
    },
    xaxis: {
      position: 'bottom',
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
    },
    stroke: {
      width: [2, 3, 4, 2],
      dashArray: [0, 0, 5, 2],
      curve: 'smooth',
    }
  };

  return (
    <div>
      <div id="card">
        <div id="chart">
          <ReactApexChart options={options} series={series} type="line" height={350} width={600} />
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default Multi_group;
