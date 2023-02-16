import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

ChartJS.defaults.showLine = false;

const LineGraph = (props) => {
  const { data, labels, maintainAspectRatio = true } = props;

  const chartData = {
    labels: ['r', 'r', 'uy', 'pp'],
    datasets: [
      {
        data: [10, 60, 85, 95, 33, 44, 77],
        fill: false,
        borderWidth: 4,
        pointBorderWidth: 0,
        tension: 0,
        pointBackgroundColor: '#4C9974',
        pointHoverRadius: 7,
        pointRadius: 5,
        hoverBorderWidth: 2,
        pointHoverBorderColor: '#4c9a744d',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: maintainAspectRatio,
    scale: {
      ticks: {
        backdropColor: 'rgba(122,156,23,1)',
      },
    },
  };
  return <Line data={chartData} options={options} />;
};

export default LineGraph;
