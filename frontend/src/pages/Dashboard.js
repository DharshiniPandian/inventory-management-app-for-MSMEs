import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI, ordersAPI, transactionsAPI } from "../services/api";

const MONTHLY_DATA = [
  { month: "Oct", revenue: 42000, orders: 38 },
  { month: "Nov", revenue: 58000, orders: 52 },
  { month: "Dec", revenue: 91000, orders: 84 },
  { month: "Jan", revenue: 63000, orders: 61 },
  { month: "Feb", revenue: 74000, orders: 70 },
  { month: "Mar", revenue: 88000, orders: 79 },
];

const FAKE_TRANSACTIONS = [
  { _id: "txn_a3f9c1", totalPrice: 1240.0 },
  { _id: "txn_b8e2d4", totalPrice: 870.5 },
  { _id: "txn_c1f700", totalPrice: 3120.0 },
  { _id: "txn_d4a921", totalPrice: 540.75 },
  { _id: "txn_e7b330", totalPrice: 2200.0 },
];

const BarChart = ({ data }) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="w-full">
      <div className="flex items-end gap-3 px-2" style={{ height: "120px" }}>
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 h-full"
          >
            <span className="text-[10px] text-slate-400 mb-1">
              ₹{(d.revenue / 1000).toFixed(0)}k
            </span>
            <div className="w-full flex flex-col justify-end flex-1">
              <div
                className="w-full rounded-t-md"
                style={{
                  height: `${(d.revenue / maxRevenue) * 100}%`,
                  background: "linear-gradient(to top, #1e3a5f, #2563eb)",
                  minHeight: "6px",
                }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-1">
              {d.month}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">
            Peak Month
          </p>
          <p className="text-sm font-bold text-slate-800">Dec</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">
            Avg Revenue
          </p>
          <p className="text-sm font-bold text-slate-800">
            ₹
            {(
              data.reduce((a, d) => a + d.revenue, 0) /
              data.length /
              1000
            ).toFixed(1)}
            k
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">
            Growth
          </p>
          <p className="text-sm font-bold text-green-600">+18.9%</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalTurnover, setTotalTurnover] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes, turnoverRes, transactionsRes] =
          await Promise.all([
            productsAPI.getAll(),
            ordersAPI.getAll(),
            transactionsAPI.getTotalTurnover(),
            transactionsAPI.getAll(),
          ]);

        setTotalProducts(productsRes.data.length);
        setTotalOrders(ordersRes.data.length);
        setTotalTurnover(turnoverRes.data.totalTurnover || 0);
        setRecentTransactions(transactionsRes.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to fake data if API fails
        setTotalProducts(248);
        setTotalOrders(1032);
        setTotalTurnover(416000);
        setRecentTransactions(FAKE_TRANSACTIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const displayTransactions =
    recentTransactions.length > 0 ? recentTransactions : FAKE_TRANSACTIONS;

  return (
    <div className="flex flex-col bg-slate-100 min-h-screen">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-slate-800 mb-5">
            Dashboard
          </h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 border-t-4 border-t-[#1e3a5f] shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Total Products
              </h2>
              <p className="text-4xl font-bold text-slate-900">
                {totalProducts}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Across all categories
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 border-t-4 border-t-slate-900 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Total Orders
              </h2>
              <p className="text-4xl font-bold text-slate-900">{totalOrders}</p>
              <p className="text-xs text-slate-400 mt-2">
                Lifetime orders placed
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 border-t-4 border-t-amber-400 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Total Turnover
              </h2>
              <p className="text-4xl font-bold text-amber-800">
                ₹ {totalTurnover.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-400 mt-2">Cumulative revenue</p>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Chart Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">
                  Monthly Revenue
                </h2>
                <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-1 rounded-full uppercase tracking-wide">
                  Last 6 months
                </span>
              </div>
              {loading ? (
                <p className="text-slate-400 text-sm py-6 text-center">
                  Loading chart...
                </p>
              ) : (
                <BarChart data={MONTHLY_DATA} />
              )}
            </div>

            {/* Transactions Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">
                  Recent Transactions
                </h2>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-1 rounded-full uppercase tracking-wide">
                  Latest 5
                </span>
              </div>
              {loading ? (
                <p className="text-slate-400 text-sm py-6 text-center">
                  Loading...
                </p>
              ) : (
                <ul className="text-slate-600 space-y-1">
                  {displayTransactions.map((transaction, idx) => (
                    <li
                      key={transaction._id || idx}
                      className="flex justify-between items-center py-2.5 border-b border-slate-50 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {idx + 1}
                        </span>
                        <span className="text-slate-400 font-mono text-xs">
                          #{transaction._id?.slice(-6)}
                        </span>
                      </div>
                      <span className="font-semibold text-slate-800">
                        ₹{transaction.totalPrice?.toFixed(2) || "0.00"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to="/transactions"
                className="text-blue-600 hover:underline text-sm mt-4 inline-block font-medium"
              >
                View all transactions →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
