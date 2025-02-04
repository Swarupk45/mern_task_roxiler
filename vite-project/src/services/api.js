import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const initializeDatabase = async () => {
  try {
    return await axios.get(`${API_URL}/initialize`);
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const getTransactions = async (month, page, perPage, search) => {
  try {
    console.log("serachhhhh",search)
    // const res=await axios.get(`${API_URL}/transactions`, { params: { month, page, perPage, search } });
    // console.log("resssssss",res)
    return await axios.get(`${API_URL}/transactions`, { params: { month, page, perPage, search } });
  } catch (error) {
    console.error("Error fetching transactions: from=====", error);
    throw error;
  }
};

export const getBarChartData = async (month) => {
  try {
    return await axios.get(`${API_URL}/bar-chart`, { params: { month } });
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    throw error;
  }
};


export const getCombinedData = async (month) => {
  try {
    return await axios.get(`${API_URL}/combined-data`, { params: { month } });
  } catch (error) {
    console.error("Error fetching combined data:", error);
    throw error;
  }
};
