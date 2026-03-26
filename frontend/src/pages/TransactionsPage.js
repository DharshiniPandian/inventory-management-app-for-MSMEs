import React, { useState, useEffect } from "react";
import { transactionsAPI } from "../services/api";
import TransactionCard from "../components/TransactionCard";

const FAKE_TRANSACTIONS = [
  {
    _id: "txn_a1b2c3",
    type: "Sale",
    amount: 4497,
    status: "Completed",
    method: "UPI",
    category: "Electronics",
    date: "2025-03-18",
    description: "Wireless Keyboard × 2, Ergonomic Mouse × 1",
  },
  {
    _id: "txn_d4e5f6",
    type: "Sale",
    amount: 24999,
    status: "Completed",
    method: "Credit Card",
    category: "Furniture",
    date: "2025-03-20",
    description: "Standing Desk × 1",
  },
  {
    _id: "txn_g7h8i9",
    type: "Purchase",
    amount: 18500,
    status: "Completed",
    method: "Net Banking",
    category: "Electronics",
    date: "2025-03-21",
    description: "Stock reorder from supplier — HD Webcam batch",
  },
  {
    _id: "txn_j1k2l3",
    type: "Sale",
    amount: 8497,
    status: "Pending",
    method: "COD",
    category: "Electronics",
    date: "2025-03-19",
    description: "HD Webcam 1080p × 1, USB-C Hub × 2",
  },
  {
    _id: "txn_m4n5o6",
    type: "Refund",
    amount: 3395,
    status: "Refunded",
    method: "Credit Card",
    category: "Stationery",
    date: "2025-03-14",
    description: "Customer return — damaged packaging",
  },
  {
    _id: "txn_p7q8r9",
    type: "Sale",
    amount: 25998,
    status: "Completed",
    method: "UPI",
    category: "Furniture",
    date: "2025-03-15",
    description: "Office Chair × 2",
  },
  {
    _id: "txn_s1t2u3",
    type: "Expense",
    amount: 2200,
    status: "Completed",
    method: "Cash",
    category: "Operations",
    date: "2025-03-22",
    description: "Warehouse rent — March 2025",
  },
  {
    _id: "txn_v4w5x6",
    type: "Sale",
    amount: 2499,
    status: "Completed",
    method: "COD",
    category: "Electronics",
    date: "2025-03-17",
    description: "USB-C Hub 7-in-1 × 1",
  },
  {
    _id: "txn_y7z8a9",
    type: "Purchase",
    amount: 9800,
    status: "Pending",
    method: "Net Banking",
    category: "Stationery",
    date: "2025-03-22",
    description: "Notebook A4 Pack × 20, Ballpoint Pens × 10",
  },
  {
    _id: "txn_b2c3d4",
    type: "Refund",
    amount: 1299,
    status: "Refunded",
    method: "UPI",
    category: "Electronics",
    date: "2025-03-16",
    description: "Wireless Keyboard — defective unit",
  },
  {
    _id: "txn_e5f6g7",
    type: "Sale",
    amount: 5697,
    status: "Failed",
    method: "Credit Card",
    category: "Electronics",
    date: "2025-03-13",
    description: "Payment gateway timeout",
  },
  {
    _id: "txn_h8i9j0",
    type: "Adjustment",
    amount: 500,
    status: "Completed",
    method: "Cash",
    category: "Inventory",
    date: "2025-03-12",
    description: "Stock count correction — Desk Lamp",
  },
];

const TYPES = ["All", "Sale", "Purchase", "Refund", "Expense", "Adjustment"];
const STATUSES = ["All", "Completed", "Pending", "Refunded", "Failed"];

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll();
      setTransactions(
        response.data.length > 0 ? response.data : FAKE_TRANSACTIONS,
      );
      setError("");
    } catch (err) {
      setError("Could not connect to server. Showing sample data.");
      setTransactions(FAKE_TRANSACTIONS);
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    const matchType = typeFilter === "All" || t.type === typeFilter;
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchSearch =
      t._id?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  // Stat calculations
  const totalSales = transactions
    .filter((t) => t.type === "Sale" && t.status === "Completed")
    .reduce((s, t) => s + (t.amount || 0), 0);
  const totalPurchases = transactions
    .filter((t) => t.type === "Purchase" && t.status === "Completed")
    .reduce((s, t) => s + (t.amount || 0), 0);
  const totalRefunds = transactions
    .filter((t) => t.type === "Refund")
    .reduce((s, t) => s + (t.amount || 0), 0);
  const pendingCount = transactions.filter(
    (t) => t.status === "Pending",
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-slate-400 text-sm">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {transactions.length} total transactions
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-green-500">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Sales Revenue
          </p>
          <p className="text-xl font-extrabold text-green-700">
            ₹{(totalSales / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-blue-500">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Purchases
          </p>
          <p className="text-xl font-extrabold text-blue-700">
            ₹{(totalPurchases / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-red-400">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Refunds
          </p>
          <p className="text-xl font-extrabold text-red-500">
            ₹{(totalRefunds / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-amber-400">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Pending
          </p>
          <p className="text-3xl font-extrabold text-amber-500">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by ID, category, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-slate-200 focus:border-[#1e3a5f] bg-white text-sm text-slate-700 px-4 py-2.5 rounded-lg outline-none placeholder:text-slate-400 transition-colors"
        />
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 flex-wrap mb-2">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider self-center mr-1">
          Type
        </span>
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors ${
              typeFilter === t
                ? "bg-[#0f172a] text-white border-[#0f172a]"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider self-center mr-1">
          Status
        </span>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors ${
              statusFilter === s
                ? "bg-[#0f172a] text-white border-[#0f172a]"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results hint */}
      {(search || typeFilter !== "All" || statusFilter !== "All") && (
        <p className="text-xs text-slate-400 mb-3">
          Showing {filtered.length} of {transactions.length} transactions
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 text-sm">
          No transactions match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((transaction) => (
            <TransactionCard key={transaction._id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
