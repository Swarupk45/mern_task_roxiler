const express = require('express');
const router = express.Router();
const {
  initializeDatabase,
  getTransactions,
  getBarChartData,
  getCombinedData,
} = require('../controllers/transactionController');
router.get('/initialize', initializeDatabase);
router.get('/transactions', getTransactions);
router.get('/bar-chart', getBarChartData);
router.get('/combined-data', getCombinedData);
module.exports = router;