import React, { useState, useEffect } from "react";
import { ordersAPI } from "../services/api";

const FAKE_ORDERS = [
  {
    _id: "ord_a1b2c3",
    customer: "Priya Sharma",
    items: [
      { name: "Wireless Keyboard", qty: 2 },
      { name: "Ergonomic Mouse", qty: 1 },
    ],
    total: 4497,
    status: "Delivered",
    date: "2025-03-18",
    paymentMethod: "UPI",
  },
  {
    _id: "ord_d4e5f6",
    customer: "Arjun Mehta",
    items: [{ name: "Standing Desk", qty: 1 }],
    total: 24999,
    status: "Processing",
    date: "2025-03-20",
    paymentMethod: "Credit Card",
  },
  {
    _id: "ord_g7h8i9",
    customer: "Sneha Reddy",
    items: [
      { name: "Notebook A4 Pack", qty: 5 },
      { name: "Ballpoint Pens (12)", qty: 3 },
    ],
    total: 2342,
    status: "Pending",
    date: "2025-03-21",
    paymentMethod: "COD",
  },
  {
    _id: "ord_j1k2l3",
    customer: "Rahul Nair",
    items: [
      { name: "HD Webcam 1080p", qty: 1 },
      { name: "USB-C Hub 7-in-1", qty: 2 },
    ],
    total: 8497,
    status: "Shipped",
    date: "2025-03-19",
    paymentMethod: "Net Banking",
  },
  {
    _id: "ord_m4n5o6",
    customer: "Kavya Iyer",
    items: [{ name: "Office Chair", qty: 2 }],
    total: 25998,
    status: "Delivered",
    date: "2025-03-15",
    paymentMethod: "UPI",
  },
  {
    _id: "ord_p7q8r9",
    customer: "Vikram Singh",
    items: [
      { name: "Desk Lamp LED", qty: 3 },
      { name: "Notebook A4 Pack", qty: 2 },
    ],
    total: 3395,
    status: "Cancelled",
    date: "2025-03-14",
    paymentMethod: "Credit Card",
  },
  {
    _id: "ord_s1t2u3",
    customer: "Divya Krishnan",
    items: [
      { name: "Wireless Keyboard", qty: 1 },
      { name: "Desk Lamp LED", qty: 1 },
    ],
    total: 2198,
    status: "Processing",
    date: "2025-03-22",
    paymentMethod: "UPI",
  },
  {
    _id: "ord_v4w5x6",
    customer: "Kiran Patel",
    items: [{ name: "USB-C Hub 7-in-1", qty: 1 }],
    total: 2499,
    status: "Shipped",
    date: "2025-03-17",
    paymentMethod: "COD",
  },
  {
    _id: "ord_y7z8a9",
    customer: "Meera Joshi",
    items: [
      { name: "Ballpoint Pens (12)", qty: 10 },
      { name: "Notebook A4 Pack", qty: 4 },
    ],
    total: 3386,
    status: "Pending",
    date: "2025-03-22",
    paymentMethod: "Net Banking",
  },
];

const STATUS_THEME = {
  Delivered: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
    stripe: "#22c55e",
  },
  Shipped: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    stripe: "#2563eb",
  },
  Processing: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    stripe: "#f59e0b",
  },
  Pending: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
    stripe: "#94a3b8",
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    dot: "bg-red-400",
    stripe: "#ef4444",
  },
};

const DEFAULT_THEME = {
  bg: "bg-slate-100",
  text: "text-slate-600",
  border: "border-slate-200",
  dot: "bg-slate-400",
  stripe: "#94a3b8",
};

const PAYMENT_ICONS = {
  UPI: "📱",
  "Credit Card": "💳",
  COD: "💵",
  "Net Banking": "🏦",
};

const initials = (name) =>
  name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "??";

const AVATAR_COLORS = [
  ["#dbeafe", "#1e40af"],
  ["#fef9c3", "#92400e"],
  ["#dcfce7", "#166534"],
  ["#f3e8ff", "#6b21a8"],
  ["#ffe4e6", "#9f1239"],
  ["#e0f2fe", "#0c4a6e"],
];

const avatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const OrderCard = ({ order, onDelete, idx }) => {
  const theme = STATUS_THEME[order.status] || DEFAULT_THEME;
  const [bg, fg] = avatarColor(order.customer);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
      {/* Stripe */}
      <div className="h-1.5 w-full" style={{ background: theme.stripe }} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Customer + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0"
              style={{ background: bg, color: fg }}
            >
              {initials(order.customer)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {order.customer}
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                #{order._id?.slice(-6)}
              </p>
            </div>
          </div>
          <span
            className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${theme.bg} ${theme.text} ${theme.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
            {order.status}
          </span>
        </div>

        {/* Items list */}
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Items
          </p>
          <ul className="space-y-1">
            {(order.items || []).slice(0, 3).map((item, i) => (
              <li key={i} className="flex justify-between text-xs">
                <span className="text-slate-600 truncate max-w-[70%]">
                  {item.name}
                </span>
                <span className="text-slate-400 font-medium">×{item.qty}</span>
              </li>
            ))}
            {(order.items || []).length > 3 && (
              <li className="text-[10px] text-slate-400">
                +{order.items.length - 3} more items
              </li>
            )}
          </ul>
        </div>

        {/* Total + Date */}
        <div className="flex items-center justify-between border-t border-b border-slate-100 py-3">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Total
            </p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">
              ₹{(order.total ?? 0).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Date
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              {new Date(order.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Payment method */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-base">
            {PAYMENT_ICONS[order.paymentMethod] || "💰"}
          </span>
          <span className="font-medium">
            {order.paymentMethod || "Unknown"}
          </span>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(order._id)}
          className="w-full py-2.5 text-xs font-bold rounded-xl bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-colors mt-auto"
        >
          Delete Order
        </button>
      </div>
    </div>
  );
};

const STATUSES = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data.length > 0 ? response.data : FAKE_ORDERS);
      setError("");
    } catch (err) {
      setError("Could not connect to server. Showing sample data.");
      setOrders(FAKE_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await ordersAPI.delete(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting order");
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchSearch =
      o.customer?.toLowerCase().includes(search.toLowerCase()) ||
      o._id?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Stat counts
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const pendingCount = orders.filter(
    (o) => o.status === "Pending" || o.status === "Processing",
  ).length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-slate-400 text-sm">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {orders.length} total orders
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
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-[#0f172a]">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Orders
          </p>
          <p className="text-3xl font-extrabold text-slate-800">
            {orders.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-amber-400">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Revenue
          </p>
          <p className="text-2xl font-extrabold text-amber-800">
            ₹{(totalRevenue / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-green-500">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Delivered
          </p>
          <p className="text-3xl font-extrabold text-green-600">
            {deliveredCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm border-t-4 border-t-orange-400">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            In Progress
          </p>
          <p className="text-3xl font-extrabold text-orange-500">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Search + Status filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by customer or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-2 border-slate-200 focus:border-[#1e3a5f] bg-white text-sm text-slate-700 px-4 py-2.5 rounded-lg outline-none placeholder:text-slate-400 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-bold px-3 py-2.5 rounded-lg border transition-colors ${
                statusFilter === s
                  ? "bg-[#0f172a] text-white border-[#0f172a]"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results hint */}
      {(search || statusFilter !== "All") && (
        <p className="text-xs text-slate-400 mb-3">
          Showing {filtered.length} of {orders.length} orders
        </p>
      )}

      {/* Orders grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 text-sm">
          No orders match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((order, idx) => (
            <OrderCard
              key={order._id}
              order={order}
              onDelete={handleDeleteOrder}
              idx={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
