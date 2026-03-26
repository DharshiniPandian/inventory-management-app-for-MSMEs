import React, { useState, useEffect } from "react";
import { categoriesAPI } from "../services/api";

const FAKE_CATEGORIES = [
  {
    _id: "cat001",
    name: "Electronics",
    productCount: 4,
    description: "Devices, peripherals, and tech accessories",
    accent: "#2563eb",
    iconBg: "#eff6ff",
    icon: "⚡",
  },
  {
    _id: "cat002",
    name: "Furniture",
    productCount: 3,
    description: "Office and workspace furniture",
    accent: "#f59e0b",
    iconBg: "#fffbeb",
    icon: "🪑",
  },
  {
    _id: "cat003",
    name: "Stationery",
    productCount: 2,
    description: "Writing tools, notebooks, and office supplies",
    accent: "#22c55e",
    iconBg: "#f0fdf4",
    icon: "✏️",
  },
  {
    _id: "cat004",
    name: "Networking",
    productCount: 0,
    description: "Cables, routers, and connectivity gear",
    accent: "#8b5cf6",
    iconBg: "#f5f3ff",
    icon: "🔌",
  },
  {
    _id: "cat005",
    name: "Packaging",
    productCount: 0,
    description: "Boxes, tapes, and shipping materials",
    accent: "#f43f5e",
    iconBg: "#fff1f2",
    icon: "📦",
  },
];

const ACCENT_CYCLE = [
  { accent: "#2563eb", iconBg: "#eff6ff" },
  { accent: "#f59e0b", iconBg: "#fffbeb" },
  { accent: "#22c55e", iconBg: "#f0fdf4" },
  { accent: "#8b5cf6", iconBg: "#f5f3ff" },
  { accent: "#f43f5e", iconBg: "#fff1f2" },
  { accent: "#0ea5e9", iconBg: "#f0f9ff" },
];

const CATEGORY_ICONS = {
  Electronics: "⚡",
  Furniture: "🪑",
  Stationery: "✏️",
  Networking: "🔌",
  Packaging: "📦",
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      // setCategories(response.data.length > 0 ? response.data : FAKE_CATEGORIES);
      setCategories(FAKE_CATEGORIES);
      setError("");
    } catch (err) {
      setError("Could not connect to server. Showing sample data.");
      setCategories(FAKE_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await categoriesAPI.delete(categoryId);
      setCategories((prev) => prev.filter((c) => c._id !== categoryId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting category");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      setAdding(true);
      const response = await categoriesAPI.create({ name: newCategoryName });
      const idx = categories.length % ACCENT_CYCLE.length;
      const enriched = {
        ...response.data,
        ...ACCENT_CYCLE[idx],
        icon: CATEGORY_ICONS[response.data.name] || "📁",
      };
      setCategories((prev) => [...prev, enriched]);
      setNewCategoryName("");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding category");
    } finally {
      setAdding(false);
    }
  };

  const totalProducts = categories.reduce(
    (sum, c) => sum + (c.productCount || 0),
    0,
  );
  const maxProducts = Math.max(
    ...categories.map((c) => c.productCount || 0),
    1,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-slate-400 text-sm">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {categories.length} categories · {totalProducts} products total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border-2 border-slate-200 focus:border-[#1e3a5f] bg-white text-sm text-slate-700 px-4 py-2.5 rounded-lg outline-none placeholder:text-slate-400 w-52 transition-colors"
            placeholder="New category name..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            disabled={adding || !newCategoryName.trim()}
            className="bg-[#0f172a] hover:bg-[#1e293b] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors whitespace-nowrap"
          >
            {adding ? "Adding..." : "+ Add Category"}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-5 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Categories
          </p>
          <p className="text-3xl font-extrabold text-slate-800">
            {categories.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Products
          </p>
          <p className="text-3xl font-extrabold text-slate-800">
            {totalProducts}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Active
          </p>
          <p className="text-3xl font-extrabold text-green-600">
            {categories.filter((c) => (c.productCount || 0) > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Empty
          </p>
          <p className="text-3xl font-extrabold text-slate-300">
            {categories.filter((c) => (c.productCount || 0) === 0).length}
          </p>
        </div>
      </div>

      {/* Category Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-400 text-sm">
          No categories yet. Add your first one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((category, idx) => {
            const accentColor =
              category.accent || ACCENT_CYCLE[idx % ACCENT_CYCLE.length].accent;
            const iconBg =
              category.iconBg || ACCENT_CYCLE[idx % ACCENT_CYCLE.length].iconBg;
            const icon = category.icon || CATEGORY_ICONS[category.name] || "📁";
            const count = category.productCount || 0;
            const fillPct = Math.round((count / maxProducts) * 100);
            const isActive = count > 0;

            return (
              <div
                key={category._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Colored top stripe */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: accentColor }}
                />

                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Icon + Name */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: iconBg }}
                    >
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800 leading-tight">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Count + Badge */}
                  <div className="flex items-center justify-between border-t border-b border-slate-100 py-3">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Products
                      </p>
                      <p
                        className="text-3xl font-extrabold mt-0.5"
                        style={{ color: isActive ? "#0f172a" : "#cbd5e1" }}
                      >
                        {count}
                      </p>
                    </div>
                    <span
                      className="text-[11px] font-bold px-3 py-1.5 rounded-full"
                      style={
                        isActive
                          ? { background: "#dcfce7", color: "#15803d" }
                          : { background: "#f1f5f9", color: "#94a3b8" }
                      }
                    >
                      {isActive ? "Active" : "Empty"}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                      <span>Stock fill</span>
                      <span>{fillPct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${fillPct}%`,
                          background: accentColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="w-full py-2.5 text-xs font-semibold rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-colors mt-auto"
                  >
                    Delete Category
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
