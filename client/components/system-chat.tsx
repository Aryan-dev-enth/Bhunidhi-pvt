import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SystemChartProps {
  droneState: {
    bat: number;
    templ: number;
    temph: number;
    tof: number;
    h: number;
    baro: number;
    time: number;
  };
}

export function SystemChart({ droneState }: SystemChartProps) {
  const [systemData, setSystemData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "Battery",
        data: [],
        borderColor: "rgb(255, 206, 86)",
        tension: 0.1,
      },
      {
        label: "Temperature High",
        data: [],
        borderColor: "rgb(99, 255, 222)",
        tension: 0.1,
      },
      { label: "TOF", data: [], borderColor: "rgb(75, 75, 192)", tension: 0.1 },
      {
        label: "Height",
        data: [],
        borderColor: "rgb(192, 75, 192)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    setSystemData((prevData: any) => {
      const newLabels = [...prevData.labels, droneState.time];
      const newDatasets = prevData.datasets.map((dataset: any) => {
        const field = dataset.label.toLowerCase().replace(" ", ""); // Maps dataset label to droneState keys
        const newData = [...dataset.data];
        if (newData.length >= 20) newData.shift();
        newData.push(
          droneState[field as keyof SystemChartProps["droneState"]] as number
        );
        return { ...dataset, data: newData };
      });
      return { labels: newLabels.slice(-20), datasets: newDatasets };
    });
  }, [droneState]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "System Data" },
    },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Value" } },
    },
  };

  return <Line data={systemData} options={options} />;
}
