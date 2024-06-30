import React from 'react';
import ReactApexChart from 'react-apexcharts';

function MultipleRadialbars(props) { // Ensure component name follows conventions
  const options = {
    options: {
      chart: {
        width: 380,
        type: 'donut',
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270
        }
      },
      dataLabels: {
        enabled: true
      },
      fill: {
        type: 'gradient',
      },
      legend: {
        formatter: function(val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex]
        }
      },
      title: {
        text: 'Gradient Donut with custom Start-angle'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
            
          }
        }
      }]
    },
    labels: props.labels
  };

  return (
    <div>
      <div id="card">
        <div id="chart">
          <ReactApexChart options={options} series={props.series} type="donut" width={380} />
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default MultipleRadialbars;
