import React, { createContext, useState, useEffect } from 'react';
import { getCombinedData } from '../services/api';
const TransactionContext = createContext();
export const TransactionProvider = ({ children }) => {
  const [month, setMonth] = useState('3');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getCombinedData(month);
      console.log("Fetched Data:", response);
      setData(response.data);
      setLoading(false);
    };
    fetchData();
  }, [month]);
  return (
    <TransactionContext.Provider value={{ month, setMonth, data, loading }}>
      {children}
    </TransactionContext.Provider>
  );
};
export default TransactionContext;