import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../services/api";
import InventoryTable from "../components/InventoryTable";

const FAKE_PRODUCTS = [
  { _id: "p001", name: "Wireless Keyboard",  category: { name: "Electronics" }, price: 1299,  stock: 45,  sku: "EL-WK-001", threshold: 10, unitsSold: 312 },
  { _id: "p002", name: "USB-C Hub 7-in-1",   category: { name: "Electronics" }, price: 2499,  stock: 18,  sku: "EL-UC-002", threshold: 20, unitsSold: 87  },
  { _id: "p003", name: "Ergonomic Mouse",     category: { name: "Electronics" }, price: 1899,  stock: 32,  sku: "EL-EM-003", threshold: 15, unitsSold: 204 },
  { _id: "p004", name: "Office Chair",        category: { name: "Furniture"   }, price: 12999, stock: 7,   sku: "FU-OC-004", threshold: 10, unitsSold: 43  },
  { _id: "p005", name: "Standing Desk",       category: { name: "Furniture"   }, price: 24999, stock: 3,   sku: "FU-SD-005", threshold: 5,  unitsSold: 21  },
  { _id: "p006", name: "Notebook A4 Pack",    category: { name: "Stationery"  }, price: 349,   stock: 120, sku: "ST-NB-006", threshold: 30, unitsSold: 560 },
  { _id: "p007", name: "Ballpoint Pens (12)", category: { name: "Stationery"  }, price: 199,   stock: 200, sku: "ST-BP-007", threshold: 50, unitsSold: 890 },
  { _id: "p008", name: "HD Webcam 1080p",     category: { name: "Electronics" }, price: 3499,  stock: 12,  sku: "EL-WC-008", threshold: 15, unitsSold: 134 },
  { _id: "p009", name: "Desk Lamp LED",       category: { name: "Furniture"   }, price: 899,   stock: 54,  sku: "FU-DL-009", threshold: 10, unitsSold: 278 },
];

const getStatus = (stock, threshold) => {
  if (stock === 0) return "Out of Stock";
  if (stock < threshold) return "Low Stock";
  if (stock < threshold * 2) return "Limited";
  return "In Stock";
};

const InventoryPage = () => {
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [search, setSearch]                 = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter]     = useState("All");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      await productsAPI.getAll();
      setProducts(FAKE_PRODUCTS);
      setError("");
    } catch {
      setError("Could not connect to server. Showing sample data.");
      setProducts(FAKE_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productsAPI.delete(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting product");
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category?.name).filter(Boolean))];
  const statuses   = ["All", "In Stock", "Limited", "Low Stock", "Out of Stock"];

  // Counts always reflect total products (not filtered), so badges are stable
  const categoryCount = (cat) =>
    cat === "All" ? products.length : products.filter((p) => p.category?.name === cat).length;

  const statusCount = (s) =>
    s === "All"
      ? products.length
      : products.filter((p) => getStatus(p.stock ?? 0, p.threshold ?? 10) === s).length;

  const filtered = products.filter((p) => {
    const q           = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
    const matchCat    = categoryFilter === "All" || p.category?.name === categoryFilter;
    const status      = getStatus(p.stock ?? 0, p.threshold ?? 10);
    const matchStatus = statusFilter === "All" || status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const totalValue    = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => getStatus(p.stock ?? 0, p.threshold ?? 10) === "Low Stock").length;
  const outOfStock    = products.filter((p) => (p.stock ?? 0) === 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-slate-400 text-sm">Loading products...</div>
      </div>
    );
  }

  // Color themes for status filter buttons
  const statusTheme = {
    "All":          { active: "bg-[#0f172a] text-white border-[#0f172a]",   inactive: "bg-white text-slate-500 border-slate-200 hover:border-slate-400",   badgeActive: "bg-white text-[#0f172a]",   badgeInactive: "bg-slate-700 text-white"   },
    "In Stock":     { active: "bg-green-600 text-white border-green-600",    inactive: "bg-white text-green-700 border-green-200 hover:border-green-400",    badgeActive: "bg-white text-green-700",   badgeInactive: "bg-green-600 text-white"   },
    "Limited":      { active: "bg-yellow-500 text-white border-yellow-500",  inactive: "bg-white text-yellow-700 border-yellow-200 hover:border-yellow-400", badgeActive: "bg-white text-yellow-600",  badgeInactive: "bg-yellow-500 text-white"  },
    "Low Stock":    { active: "bg-orange-500 text-white border-orange-500",  inactive: "bg-white text-orange-600 border-orange-200 hover:border-orange-400", badgeActive: "bg-white text-orange-600",  badgeInactive: "bg-orange-500 text-white"  },
    "Out of Stock": { active: "bg-red-500 text-white border-red-500",        inactive: "bg-white text-red-500 border-red-200 hover:border-red-400",          badgeActive: "bg-white text-red-600",     badgeInactive: "bg-red-500 text-white"     },
  };

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {products.length} products across {categories.length - 1} categories
          </p>
        </div>
        <Link
          to="/inventory/add-product"
          className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-colors"
        >
          + Add New Product
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Total SKUs</p>
          <p className="text-3xl font-extrabold text-slate-800">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Inventory Value</p>
          <p className="text-2xl font-extrabold text-slate-800">₹{(totalValue / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Low Stock</p>
          <p className="text-3xl font-extrabold text-orange-500">{lowStockCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Out of Stock</p>
          <p className="text-3xl font-extrabold text-red-400">{outOfStock}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-5">
        {/* Row 1: Search + Category filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-2 border-slate-200 focus:border-[#1e3a5f] bg-white text-sm text-slate-700 px-4 py-2.5 rounded-lg outline-none placeholder:text-slate-400 transition-colors"
          />

          {/* Category buttons */}
          <div className="flex gap-3 flex-wrap items-center">
            {categories.map((cat) => {
              const isActive = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`relative text-xs font-bold px-4 py-2.5 rounded-lg border transition-colors ${
                    isActive
                      ? "bg-[#0f172a] text-white border-[#0f172a]"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {cat}
                  {/* Count badge */}
                  <span
                    className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center leading-none shadow-sm ${
                      isActive ? "bg-white text-[#0f172a]" : "bg-[#0f172a] text-white"
                    }`}
                  >
                    {categoryCount(cat)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Status filter buttons */}
        <div className="flex gap-3 flex-wrap items-center">
          {statuses.map((s) => {
            const isActive = statusFilter === s;
            const t        = statusTheme[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`relative text-xs font-bold px-4 py-2 rounded-lg border transition-colors ${
                  isActive ? t.active : t.inactive
                }`}
              >
                {s}
                {/* Count badge */}
                <span
                  className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center leading-none shadow-sm ${
                    isActive ? t.badgeActive : t.badgeInactive
                  }`}
                >
                  {statusCount(s)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {(search || categoryFilter !== "All" || statusFilter !== "All") && (
        <p className="text-xs text-slate-400 mb-3">
          Showing {filtered.length} of {products.length} products
        </p>
      )}

      {/* Table */}
      <InventoryTable
        products={filtered}
        onDelete={handleDeleteProduct}
        getStatus={getStatus}
      />
    </div>
  );
};

export default InventoryPage;