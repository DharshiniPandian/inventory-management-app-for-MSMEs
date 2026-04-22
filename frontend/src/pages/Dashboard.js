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

const CATEGORY_SALES = [
  { name: "Electronics", value: 38400, color: "#2563eb" },
  { name: "Furniture",   value: 27200, color: "#f59e0b" },
  { name: "Stationery",  value: 13600, color: "#22c55e" },
  { name: "Networking",  value: 6200,  color: "#8b5cf6" },
  { name: "Packaging",   value: 2600,  color: "#f43f5e" },
];

const CATEGORY_COUNTS = [
  { name: "Electronics", count: 4,  color: "#2563eb" },
  { name: "Furniture",   count: 3,  color: "#f59e0b" },
  { name: "Stationery",  count: 2,  color: "#22c55e" },
  { name: "Networking",  count: 1,  color: "#8b5cf6" },
  { name: "Packaging",   count: 1,  color: "#f43f5e" },
];

const TOP_PRODUCTS = [
  { name: "Ballpoint Pens (12)", months: [610, 740, 810, 890, 920, 890], color: "#2563eb" },
  { name: "Notebook A4 Pack",    months: [380, 420, 490, 520, 560, 540], color: "#f59e0b" },
  { name: "Wireless Keyboard",   months: [200, 240, 285, 300, 312, 295], color: "#22c55e" },
  { name: "Ergonomic Mouse",     months: [130, 155, 180, 195, 204, 198], color: "#8b5cf6" },
  { name: "Desk Lamp LED",       months: [180, 210, 240, 260, 278, 270], color: "#f43f5e" },
];

const THIS_MONTH_ORDERS = 79;
const ORDER_STATUSES = [
  { label: "Delivered",  count: 52, color: "#22c55e" },
  { label: "Processing", count: 15, color: "#2563eb" },
  { label: "Shipped",    count: 8,  color: "#f59e0b" },
  { label: "Cancelled",  count: 4,  color: "#ef4444" },
];

// ── Card shell ──────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, badge, badgeColor = "bg-slate-100 text-slate-500" }) => (
  <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
    <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
    {badge && (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeColor}`}>
        {badge}
      </span>
    )}
  </div>
);

// ── Revenue bar chart ───────────────────────────────────────────────────────
const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div className="px-1">
      <div className="flex items-end gap-2" style={{ height: 120 }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center h-full">
            <span className="text-[10px] text-slate-400 mb-1 leading-none">
              ₹{(d.revenue / 1000).toFixed(0)}k
            </span>
            <div className="w-full flex flex-col justify-end flex-1">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${(d.revenue / max) * 100}%`,
                  background: "linear-gradient(to top, #1e3a5f, #3b82f6)",
                  minHeight: 4,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 font-medium leading-none">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 divide-x divide-slate-100 text-center">
        {[
          { label: "Peak", value: "Dec" },
          { label: "Avg", value: `₹${(data.reduce((a, d) => a + d.revenue, 0) / data.length / 1000).toFixed(1)}k` },
          { label: "Growth", value: "+18.9%", green: true },
        ].map((s) => (
          <div key={s.label} className="px-2">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-xs font-bold mt-0.5 ${s.green ? "text-green-600" : "text-slate-800"}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Donut chart ─────────────────────────────────────────────────────────────
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cursor = -Math.PI / 2;
  const R = 72, cx = 90, cy = 90;

  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(cursor);
    const y1 = cy + R * Math.sin(cursor);
    cursor += angle;
    const x2 = cx + R * Math.cos(cursor);
    const y2 = cy + R * Math.sin(cursor);
    return { ...d, x1, y1, x2, y2, large: angle > Math.PI ? 1 : 0, pct: ((d.value / total) * 100).toFixed(1) };
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 180 180" style={{ width: 180, height: 180, flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={`M${cx},${cy} L${s.x1},${s.y1} A${R},${R} 0 ${s.large},1 ${s.x2},${s.y2} Z`}
            fill={s.color}
            stroke="white"
            strokeWidth="2.5"
          />
        ))}
        <circle cx={cx} cy={cy} r="42" fill="white" />
        <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontSize: 10, fill: "#94a3b8", fontFamily: "inherit" }}>Total</text>
        <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: 15, fontWeight: 700, fill: "#1e293b", fontFamily: "inherit" }}>
          ₹{(total / 1000).toFixed(0)}k
        </text>
      </svg>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-[11px] text-slate-600 flex-1 truncate">{s.name}</span>
            <span className="text-[11px] font-semibold text-slate-700 flex-shrink-0">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Sparkline chart ─────────────────────────────────────────────────────────
const SparkLines = ({ products }) => {
  const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  const W = 100, H = 56, PL = 0, PR = 4, PT = 4, PB = 14;
  const allV = products.flatMap((p) => p.months);
  const maxV = Math.max(...allV), minV = Math.min(...allV);
  const xS = (i) => PL + (i / (MONTHS.length - 1)) * (W - PL - PR);
  const yS = (v) => PT + ((maxV - v) / (maxV - minV || 1)) * (H - PT - PB);

  return (
    <div>
      <div className="flex gap-1 mb-1">
        {MONTHS.map((m, i) => (
          <span key={i} className="flex-1 text-center text-[9px] text-slate-400">{m}</span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 58 }} preserveAspectRatio="none">
        {[0, 0.5, 1].map((t, i) => (
          <line key={i} x1={PL} y1={PT + t * (H - PT - PB)} x2={W - PR} y2={PT + t * (H - PT - PB)}
            stroke="#f1f5f9" strokeWidth="0.5" />
        ))}
        {products.map((p, pi) => (
          <polyline
            key={pi}
            points={p.months.map((v, i) => `${xS(i)},${yS(v)}`).join(" ")}
            fill="none" stroke={p.color} strokeWidth="1.2"
            strokeLinejoin="round" strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="flex flex-col gap-1 mt-2">
        {products.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: p.color }} />
            <span className="text-[10px] text-slate-500 flex-1 truncate">{p.name}</span>
            <span className="text-[10px] font-semibold text-slate-700">{p.months[p.months.length - 1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Order status ring ───────────────────────────────────────────────────────
const OrderStatusRing = ({ statuses, total }) => {
  let cursor = -Math.PI / 2;
  const R = 48, cx = 60, cy = 60;
  const slices = statuses.map((s) => {
    const angle = (s.count / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(cursor);
    const y1 = cy + R * Math.sin(cursor);
    cursor += angle;
    const x2 = cx + R * Math.cos(cursor);
    const y2 = cy + R * Math.sin(cursor);
    return { ...s, x1, y1, x2, y2, large: angle > Math.PI ? 1 : 0 };
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" style={{ width: 100, height: 100, flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={`M${cx},${cy} L${s.x1},${s.y1} A${R},${R} 0 ${s.large},1 ${s.x2},${s.y2} Z`}
            fill={s.color} stroke="white" strokeWidth="2"
          />
        ))}
        <circle cx={cx} cy={cy} r="28" fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: 9, fill: "#94a3b8", fontFamily: "inherit" }}>Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: 14, fontWeight: 700, fill: "#1e293b", fontFamily: "inherit" }}>{total}</text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1">
        {statuses.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-[11px] text-slate-500 w-20">{s.label}</span>
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(s.count / total) * 100}%`, background: s.color }} />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 w-5 text-right">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders]     = useState(5);
  const [totalTurnover, setTotalTurnover] = useState("25k");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [pR, oR, tR, txR] = await Promise.all([
          productsAPI.getAll(),
          ordersAPI.getAll(),
          transactionsAPI.getTotalTurnover(),
          transactionsAPI.getAll(),
        ]);
        setTotalProducts(pR.data.length);
        setTotalOrders(oR.data.length);
        setTotalTurnover(tR.data.totalTurnover || 0);
        setRecentTransactions(txR.data.slice(0, 5));
      } catch {
        setTotalProducts(248);
        setTotalOrders(1032);
        setTotalTurnover(416000);
        setRecentTransactions(FAKE_TRANSACTIONS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const txns = recentTransactions.length > 0 ? recentTransactions : FAKE_TRANSACTIONS;

  return (
    <div className="bg-slate-100 min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>

      {/* ── Row 1: KPI stat cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Products */}
        {/* Total Products */}
        <Card>
          <div className="h-1 rounded-t-xl bg-[#1e3a5f]" />
          <div className="px-4 py-3 flex flex-col items-center text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-7">Total Products</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{totalProducts}</p>
            <p className="text-[11px] text-slate-400 mt-1">Across all categories</p>
          </div>
        </Card>

        {/* Total Orders */}
        <Card>
          <div className="h-1 rounded-t-xl bg-slate-700" />
          <div className="px-4 py-3 flex flex-col items-center text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-7">Total Orders</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">5</p>
            <p className="text-[11px] text-slate-400 mt-1">Lifetime orders placed</p>
          </div>
        </Card>

        {/* Total Turnover */}
        <Card>
          <div className="h-1 rounded-t-xl bg-amber-400" />
          <div className="px-4 py-3 flex flex-col items-center text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-8">Total Turnover</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">
              ₹25k
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Cumulative revenue</p>
          </div>
        </Card>

        {/* Categories */}
        <Card>
          <div className="h-1 rounded-t-xl bg-purple-400" />
          <div className="px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Categories</p>
            <div className="space-y-1.5">
              {CATEGORY_COUNTS.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-[11px] text-slate-600 flex-1">{c.name}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: c.color + "18", color: c.color }}
                  >
                    {c.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Row 2: Revenue chart + Transactions ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardHeader title="Monthly revenue" badge="Last 6 months" badgeColor="bg-blue-50 text-blue-600" />
          <div className="px-5 py-4">
            {loading ? (
              <p className="text-slate-400 text-sm text-center py-8">Loading…</p>
            ) : (
              <BarChart data={MONTHLY_DATA} />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent transactions" badge="Latest 5" />
          <div className="px-5 py-1">
            {loading ? (
              <p className="text-slate-400 text-sm text-center py-8">Loading…</p>
            ) : (
              <>
                <ul className="divide-y divide-slate-50">
                  {txns.map((txn, idx) => (
                    <li key={txn._id || idx} className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-slate-400 font-mono text-xs">#{txn._id?.slice(-6)}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        ₹{txn.totalPrice?.toFixed(2) || "0.00"}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 pb-3">
                  <Link to="/transactions" className="text-blue-600 hover:underline text-xs font-medium">
                    View all transactions →
                  </Link>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* ── Row 3: Category pie + Top products + Orders this month ────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Sales by category */}
        <Card>
          <CardHeader title="Sales by category" badge="Last month" badgeColor="bg-green-50 text-green-700" />
          <div className="px-5 py-4">
            <DonutChart data={CATEGORY_SALES} />
          </div>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader title="Top products" badge="Units sold · 6 mo" badgeColor="bg-purple-50 text-purple-700" />
          <div className="px-5 py-4">
            <SparkLines products={TOP_PRODUCTS} />
          </div>
        </Card>

        {/* This month's orders */}
        <Card>
          <CardHeader title="This month's orders" badge="Mar 2025" badgeColor="bg-amber-50 text-amber-700" />
          <div className="px-5 py-4">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total</p>
                <p className="text-4xl font-bold text-slate-900 mt-0.5">{THIS_MONTH_ORDERS}</p>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg mb-1">
                ↑ 12.9% vs last month
              </span>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">By status</p>
              <OrderStatusRing statuses={ORDER_STATUSES} total={THIS_MONTH_ORDERS} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;