import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './SemiCircular.css'
function Semi_Circular(props) {
  const options = {
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: true
          },
          value: {
            offsetY: -50,
            fontSize: '22px'
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91]
      },
    },
    labels: props.labels
  };

  return (
    <div>
      <div id="card">
        <div id="chart">
          <ReactApexChart options={options} series={props.series} type="radialBar" height={400} />
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default Semi_Circular;
