import React from 'react';
import ReactApexChart from 'react-apexcharts';

function MultipleRadialbars(props) {
  const calculateAverage = (series) => {
    const total = series.reduce((acc, value) => acc + value, 0);
    return (total / series.length); // toFixed(2) for two decimal places
  };

  const options = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Average',
            formatter: function () {
              return calculateAverage(props.series);
            }
          }
        }
      }
    },
    labels: props.labels // Ensure this matches the length of series array
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

export default MultipleRadialbars;
