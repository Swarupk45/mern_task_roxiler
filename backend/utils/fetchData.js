const axios = require('axios');
const Transaction = require('../models/Transaction');
const fetchData = async () => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.insertMany(response.data);
    console.log('Database initialized with seed data');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
module.exports = fetchData;