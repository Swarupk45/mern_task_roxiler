import React, { useContext, useEffect, useState } from "react";
import TransactionContext from "../context/TransactionContext";
import { getTransactions, getCombinedData } from "../services/api";

const TransactionTable = () => {
  const { data, month, setMonth, loading } = useContext(TransactionContext);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(2);
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions(month, page, perPage, search);
        if (response?.data) {
          setTransactions(response.data.transactions || []);
          setTotal(response.data.total || 0);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [month, page, perPage, search]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getCombinedData();
        if (response?.data?.statistics) {
          console.log("bbbbbbbbbb", response?.data?.statistics)
          setStatistics({
            totalSaleAmount: response.data.statistics.totalSaleAmount,
            totalSoldItems: response.data.statistics.totalSoldItems,
            totalNotSoldItems: response.data.statistics.totalNotSoldItems,
          });
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, [month]);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <>

      <div className="p-6 bg-gray-200 rounded-lg shadow-lg">

        <div className="mb-6">
          <div className="flex justify-between">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white"
            />
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="py-2 px-2 rounded bg-white"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full table-auto border-[4px] border-spacing-0">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm font-semibold border-b">
                <th className="py-3 px-6 text-left border-e">Title</th>
                <th className="py-3 px-6 text-left border-e">Description</th>
                <th className="py-3 px-6 text-left border-e">Price</th>
                <th className="py-3 px-6 text-left border-e">Category</th>
                <th className="py-3 px-6 text-left border-e">Sold</th>
                <th className="py-3 px-6 text-left">Date of Sale</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="text-center border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="py-4 px-6 text-gray-700 border-e">{transaction.title || "N/A"}</td>
                    <td className="py-4 px-6 text-gray-700 border-e">{transaction.description || "N/A"}</td>
                    <td className="py-4 px-6 text-gray-700 border-e">${transaction.price?.toFixed(2) || "0.00"}</td>
                    <td className="py-4 px-6 text-gray-700 border-e">{transaction.category || "N/A"}</td>
                    <td className="py-4 px-6 text-gray-700 border-e">{transaction.sold ? "Yes" : "No"}</td>
                    <td className="py-4 px-6 text-gray-700">
                      {transaction.dateOfSale
                        ? new Date(transaction.dateOfSale).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-6">
          <p>page {page}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`p-3 px-6 bg-blue-500 text-white rounded-lg shadow-md ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page * perPage >= total}
              className={`p-3 px-6 bg-blue-500 text-white rounded-lg shadow-md ${page * perPage >= total ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
            >
              Next
            </button>
          </div>
          <p>per Page {perPage}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg w-full mb-6 mt-3">
          <h2 className="text-2xl font-semibold mb-4">Sales Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-lg font-medium text-gray-600">Total Sale Amount:</span>
              <span className="text-xl font-bold text-blue-500">₹{data?.statistics.totalSaleAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-medium text-gray-600">Total Sold Items:</span>
              <span className="text-xl font-bold text-green-500">{data?.statistics.totalSoldItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-medium text-gray-600">Total Not Sold Items:</span>
              <span className="text-xl font-bold text-red-500">{data?.statistics.totalNotSoldItems}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionTable;
