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
            data: [1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: Object.values(legendColors),
          }
        ]
      },
    options: {
        responsive: false,
        plugins: {
            legend: {
                position: 'top'
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

export function hideChart() {
    document.getElementById('description').style.display = 'block';
    document.getElementById('chart').style.display = 'none';
}

export function updateChartData(chart, newValues) {
    document.getElementById('chart').style.display = 'block';
    document.getElementById('description').style.display = 'none';
    chart.data.datasets[0].data = newValues;
    chart.update();
}