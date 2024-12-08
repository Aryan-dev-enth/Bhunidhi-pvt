import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MotionChartProps {
  droneState: {
    pitch: number;
    roll: number;
    yaw: number;
    vgx: number;
    vgy: number;
    vgz: number;
    time: number;
  };
}

export function MotionChart({ droneState }: MotionChartProps) {
  const [motionData, setMotionData] = useState<any>({
    labels: [],
    datasets: [
      { label: 'Pitch', data: [], borderColor: 'rgb(255, 99, 132)', tension: 0.1 },
      { label: 'Roll', data: [], borderColor: 'rgb(54, 162, 235)', tension: 0.1 },
      { label: 'Yaw', data: [], borderColor: 'rgb(75, 192, 192)', tension: 0.1 },
      { label: 'VGX', data: [], borderColor: 'rgb(153, 102, 255)', tension: 0.1 },
      { label: 'VGY', data: [], borderColor: 'rgb(255, 159, 64)', tension: 0.1 },
      { label: 'VGZ', data: [], borderColor: 'rgb(201, 203, 207)', tension: 0.1 },
    ],
  });

  useEffect(() => {
    setMotionData((prevData: any) => {
      const newLabels = [...prevData.labels, droneState.time];
      const newDatasets = prevData.datasets.map((dataset: any) => {
        const field = dataset.label.toLowerCase(); // Maps dataset label to droneState keys
        const newData = [...dataset.data];
        if (newData.length >= 20) newData.shift();
        newData.push(droneState[field as keyof MotionChartProps['droneState']] as number);
        return { ...dataset, data: newData };
      });
      return { labels: newLabels.slice(-20), datasets: newDatasets };
    });
  }, [droneState]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Motion Data' },
    },
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Value' } },
    },
  };

  return <Line data={motionData} options={options} />;
}
