import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
  droneState: {
    pitch: number;
    roll: number;
    yaw: number;
    bat: number;
    time: number;
  };
}

export function LineChart({ droneState }: LineChartProps) {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      { label: 'Pitch', data: [], borderColor: 'rgb(255, 99, 132)', tension: 0.1 },
      { label: 'Roll', data: [], borderColor: 'rgb(54, 162, 235)', tension: 0.1 },
      { label: 'Yaw', data: [], borderColor: 'rgb(75, 192, 192)', tension: 0.1 },
      { label: 'Battery', data: [], borderColor: 'rgb(255, 206, 86)', tension: 0.1 },
    ],
  });

  useEffect(() => {
    const updateChart = () => {
      setChartData(prevData => {
        const newLabels = [...prevData.labels, droneState.time];
        const newDatasets = prevData.datasets.map(dataset => {
          const newData = [...dataset.data];
          if (newData.length >= 20) newData.shift();
          switch (dataset.label) {
            case 'Pitch':
              newData.push(droneState.pitch);
              break;
            case 'Roll':
              newData.push(droneState.roll);
              break;
            case 'Yaw':
              newData.push(droneState.yaw);
              break;
            case 'Battery':
              newData.push(droneState.bat);
              break;
          }
          return { ...dataset, data: newData };
        });
        return { labels: newLabels.slice(-20), datasets: newDatasets };
      });
    };

    updateChart();
  }, [droneState]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Drone Telemetry' },
    },
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Value' } },
    },
  };

  return <Line data={chartData} options={options} />;
}

