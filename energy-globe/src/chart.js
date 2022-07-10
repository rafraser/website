import { Chart, ArcElement, DoughnutController, Legend, SubTitle, Title, Tooltip } from 'chart.js';
import { legendColors } from './legend';

// for tree-shaking
Chart.register(ArcElement, DoughnutController, Legend, SubTitle, Title, Tooltip);

// Config
const chartConfig = {
    type: 'doughnut',
    data: {
        labels: Object.keys(legendColors),
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: Object.values(legendColors),
          }
        ]
      },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                display: window.innerWidth > 800,
            },
            title: {
                display: true,
                text: 'Energy Source Breakdown'
            },
            subtitle: {
                display: true,
                text: 'Displaying capacity (MW) of power plants visible on screen'
            },
        }
    }
}

export function createChart() {
    return new Chart(document.getElementById('chart'), chartConfig);
}

export function updateChartData(chart, newValues) {
    chart.data.datasets[0].data = newValues;
    chart.update();
}