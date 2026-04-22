import React, { useState } from "react";
import { Link } from "react-router-dom";

const CATEGORY_THEME = {
  Electronics: { dot: "#2563eb", badge: "bg-blue-50 text-blue-700 border-blue-100",   icon: "⚡" },
  Furniture:   { dot: "#f59e0b", badge: "bg-amber-50 text-amber-700 border-amber-100", icon: "🪑" },
  Stationery:  { dot: "#22c55e", badge: "bg-green-50 text-green-700 border-green-100", icon: "✏️" },
  Networking:  { dot: "#8b5cf6", badge: "bg-purple-50 text-purple-700 border-purple-100", icon: "🔌" },
  Packaging:   { dot: "#f43f5e", badge: "bg-rose-50 text-rose-700 border-rose-100",    icon: "📦" },
};
const DEFAULT_THEME = { dot: "#64748b", badge: "bg-slate-100 text-slate-600 border-slate-200", icon: "📁" };

const StatusBadge = ({ status }) => {
  const map = {
    "In Stock":     "bg-green-50 text-green-700 border-green-100",
    "Limited":      "bg-yellow-50 text-yellow-700 border-yellow-100",
    "Low Stock":    "bg-orange-50 text-orange-600 border-orange-100",
    "Out of Stock": "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border ${map[status] || map["In Stock"]}`}>
      {status}
    </span>
  );
};

const COLUMNS = [
  { key: "name",      label: "Product"      },
  { key: "category",  label: "Category"     },
  { key: "stock",     label: "Quantity"     },
  { key: "threshold", label: "Threshold"    },
  { key: "status",    label: "Status"       },
  { key: "unitsSold", label: "Units Sold"   },
  { key: "price",     label: "Price"        },
];

const InventoryTable = ({ products, onDelete, getStatus }) => {
  const [sortKey, setSortKey]   = useState(null);
  const [sortDir, setSortDir]   = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...products].sort((a, b) => {
    if (!sortKey) return 0;
    let aVal, bVal;
    if (sortKey === "category") {
      aVal = a.category?.name ?? ""; bVal = b.category?.name ?? "";
    } else if (sortKey === "status") {
      const order = { "Out of Stock": 0, "Low Stock": 1, "Limited": 2, "In Stock": 3 };
      aVal = order[getStatus(a.stock ?? 0, a.threshold ?? 10)] ?? 99;
      bVal = order[getStatus(b.stock ?? 0, b.threshold ?? 10)] ?? 99;
    } else {
      aVal = a[sortKey] ?? 0; bVal = b[sortKey] ?? 0;
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ?  1 : -1;
    return 0;
  });

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 text-sm">
        No products match your search.
      </div>
    );
  }

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="ml-1 text-slate-300">↕</span>;
    return <span className="ml-1 text-slate-600">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5 cursor-pointer select-none hover:text-slate-600 whitespace-nowrap"
                >
                  {col.label}<SortIcon col={col.key} />
                </th>
              ))}
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((product) => {
              const catName = product.category?.name || product.category || "Uncategorized";
              const theme   = CATEGORY_THEME[catName] || DEFAULT_THEME;
              const stock   = product.stock ?? product.quantity ?? 0;
              const threshold = product.threshold ?? 10;
              const status  = getStatus(stock, threshold);

              return (
                <tr key={product._id} className="hover:bg-slate-50/70 transition-colors group">
                  {/* Product name + SKU */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: theme.dot + "18" }}
                      >
                        {theme.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm leading-tight">{product.name}</p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">{product.sku || "N/A"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${theme.badge}`}>
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: theme.dot }}
                      />
                      {catName}
                    </span>
                  </td>

                  {/* Quantity with mini bar */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-800">{stock}</span>
                      
                    </div>
                  </td>

                  {/* Threshold */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-slate-500 font-medium">{threshold}</span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={status} />
                  </td>

                  {/* Units Sold */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-700">
                      {(product.unitsSold ?? 0).toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900">
                      ₹{(product.price ?? 0).toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/inventory/edit/${product._id}`}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(product._id)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        <p className="text-xs text-slate-400">
          Total value:{" "}
          <span className="font-semibold text-slate-600">
            ₹{products.reduce((s, p) => s + (p.price ?? 0) * (p.stock ?? 0), 0).toLocaleString("en-IN")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default InventoryTable;