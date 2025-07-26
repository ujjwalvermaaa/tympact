import React from 'react';
import { sampleJournalEntries } from '../data/sampleData';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function LifeLedger() {
  const data = {
    labels: sampleJournalEntries.map(e => e.date),
    datasets: [
      {
        label: 'Focus Score',
        data: sampleJournalEntries.map(e => e.focusScore),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Productivity',
        data: sampleJournalEntries.map(e => e.productivity),
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236,72,153,0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      y: { min: 0, max: 100 }
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col gap-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">Life Ledger</h2>
        <Line data={data} options={options} />
      </div>
    </div>
  );
} 