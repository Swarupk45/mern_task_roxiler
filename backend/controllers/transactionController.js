const Transaction = require('../models/Transaction');
const fetchData=require("../utils/fetchData")
const axios = require('axios');
const initializeDatabase = async (req, res) => {
  try {
    await Transaction.deleteMany({});
    await fetchData();
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { month, page = 1, perPage = 10, search = "" } = req.query;
    console.log("🔍 Search Query Received:", search);

    const pageNum = parseInt(page);
    const perPageNum = parseInt(perPage);
    const monthNum = parseInt(month);

    if (!monthNum || isNaN(monthNum)) {
      return res.status(400).json({ error: "Valid month is required" });
    }
   
    const pipeline = [
     
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum] },
        },
      },
    ];

    if (search) {
      console.log("🔍 Applying search filter for:", search);

      const searchFilter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };

     
      const searchNumber = search.replace(/[^0-9.]/g, ""); 
      if (searchNumber) {
        searchFilter.$or.push(
          { price: parseFloat(searchNumber) },
          {
            $expr: {
              $regexMatch: { input: { $toString: "$price" }, regex: searchNumber },
            },
          } 
        );
      }

      pipeline.push({ $match: searchFilter });
    }

    pipeline.push(
      {
        $skip: (pageNum - 1) * perPageNum,
      },
      {
        $limit: perPageNum,
      }
    );
   
    const transactions = await Transaction.aggregate(pipeline);
    console.log("Transactions fetched==", transactions.length);

  
    const total = await Transaction.aggregate([
      ...pipeline.slice(0, -2), 
      {
        $count: "total",
      },
    ]);

    const totalCount = total.length > 0 ? total[0].total : 0;
    console.log("📊 Total transactions found:", totalCount);

    res.status(200).json({ transactions, total: totalCount });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBarChartData = async (req, res) => {
  console.log("getChartData")
  const { month } = req.query;
  const ranges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];
  try {
    const data = await Promise.all(
      ranges.map(async (range) => {
        const count = await Transaction.countDocuments({
          $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] },
          price: { $gte: range.min, $lte: range.max },
        });
        return { range: `${range.min}-${range.max}`, count };
      })
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCombinedData = async (req, res) => {
  const { month } = req.query;

  try {
    console.log("Fetching data for month:", month);

    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:5000/api/transactions?month=${month}`).catch(err => ({ error: err.message })),
      axios.get(`http://localhost:5000/api/statistics?month=${month}`).catch(err => ({ error: err.message })),
      axios.get(`http://localhost:5000/api/bar-chart?month=${month}`).catch(err => ({ error: err.message })),
      axios.get(`http://localhost:5000/api/pie-chart?month=${month}`).catch(err => ({ error: err.message })),
    ]);

    if (transactions.error || statistics.error || barChart.error || pieChart.error) {
      console.error("One or more APIs failed:", { transactions, statistics, barChart, pieChart });
      return res.status(500).json({ error: "Failed to fetch one or more APIs" });
    }

    res.status(200).json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });

  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  initializeDatabase,
  getTransactions,
  getBarChartData,
  getCombinedData,
};