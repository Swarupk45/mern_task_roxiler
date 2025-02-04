import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import TransactionContext from '../context/TransactionContext';

const BarChart = () => {
  const { data } = useContext(TransactionContext);

  if (!data.barChart) return null;

  const chartData = {
    labels: data.barChart.map((item) => item.range),
    datasets: [
      {
        label: 'Number of Items',
        data: data.barChart.map((item) => item.count),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-200 rounded-lg shadow-lg">
      <div className="p-6 bg-white rounded-lg shadow-lg min-w-full m-auto ">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Bar Chart</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
