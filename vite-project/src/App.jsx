import React from 'react';
import Navbar from './components/Navbar';
import TransactionTable from './components/TransactionTable';
import BarChart from './components/BarChart';
import { TransactionProvider } from './context/TransactionContext';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

const App = () => {
  return (
   <>
    <TransactionProvider>   
      <Navbar />
      <div className="container mx-auto p-4">
        <TransactionTable />
        <BarChart />
      </div>
    </TransactionProvider>
   </>
  );
};
export default App;