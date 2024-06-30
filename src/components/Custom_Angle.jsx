import React from 'react';
import ReactApexChart from 'react-apexcharts';

function Custom_Angle(props) {
  const options = {
    chart: {
        height: 390,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            }
          },
          barLabels: {
            enabled: true,
            useSeriesColors: true,
            margin: 8,
            fontSize: '16px',
            formatter: function(seriesName, opts) {
              return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
            },
          },
        }
      },
      colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
    labels: props.labels

  };

  return (
    <div>
      <div id="card">
        <div id="chart">
          <ReactApexChart options={options} series={props.series} type="radialBar" height={350} />
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default Custom_Angle;
