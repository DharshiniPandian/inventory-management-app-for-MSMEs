import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";

const FAKE_PRODUCTS = [
  {
    _id: "p001",
    name: "Wireless Keyboard",
    category: { name: "Electronics" },
    price: 1299,
    stock: 45,
    sku: "EL-WK-001",
  },
  {
    _id: "p002",
    name: "USB-C Hub 7-in-1",
    category: { name: "Electronics" },
    price: 2499,
    stock: 18,
    sku: "EL-UC-002",
  },
  {
    _id: "p003",
    name: "Ergonomic Mouse",
    category: { name: "Electronics" },
    price: 1899,
    stock: 32,
    sku: "EL-EM-003",
  },
  {
    _id: "p004",
    name: "Office Chair",
    category: { name: "Furniture" },
    price: 12999,
    stock: 7,
    sku: "FU-OC-004",
  },
  {
    _id: "p005",
    name: "Standing Desk",
    category: { name: "Furniture" },
    price: 24999,
    stock: 3,
    sku: "FU-SD-005",
  },
  {
    _id: "p006",
    name: "Notebook A4 Pack",
    category: { name: "Stationery" },
    price: 349,
    stock: 120,
    sku: "ST-NB-006",
  },
  {
    _id: "p007",
    name: "Ballpoint Pens (12)",
    category: { name: "Stationery" },
    price: 199,
    stock: 200,
    sku: "ST-BP-007",
  },
  {
    _id: "p008",
    name: "HD Webcam 1080p",
    category: { name: "Electronics" },
    price: 3499,
    stock: 12,
    sku: "EL-WC-008",
  },
  {
    _id: "p009",
    name: "Desk Lamp LED",
    category: { name: "Furniture" },
    price: 899,
    stock: 54,
    sku: "FU-DL-009",
  },
];

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      // setProducts(response.data.length > 0 ? response.data : FAKE_PRODUCTS);
      setProducts(FAKE_PRODUCTS);
      setError("");
    } catch (err) {
      setError("Could not connect to server. Showing sample data.");
      setProducts(FAKE_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await productsAPI.delete(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting product");
    }
  };

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category?.name).filter(Boolean)),
  ];

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
    const matchCat =
      categoryFilter === "All" || p.category?.name === categoryFilter;
    return matchSearch && matchCat;
  });

  // Summary stats
  const totalValue = products.reduce(
    (sum, p) => sum + (p.price || 0) * (p.stock || 0),
    0,
  );
  const lowStockCount = products.filter(
    (p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 10,
  ).length;
  const outOfStock = products.filter((p) => (p.stock ?? 0) === 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-slate-400 text-sm">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      {/* Page header */}
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

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total SKUs
          </p>
          <p className="text-3xl font-extrabold text-slate-800">
            {products.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Inventory Value
          </p>
          <p className="text-2xl font-extrabold text-slate-800">
            ₹{(totalValue / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Low Stock
          </p>
          <p className="text-3xl font-extrabold text-orange-500">
            {lowStockCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Out of Stock
          </p>
          <p className="text-3xl font-extrabold text-red-400">{outOfStock}</p>
        </div>
      </div>

      {/* Search + Category filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-2 border-slate-200 focus:border-[#1e3a5f] bg-white text-sm text-slate-700 px-4 py-2.5 rounded-lg outline-none placeholder:text-slate-400 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs font-bold px-4 py-2.5 rounded-lg border transition-colors ${
                categoryFilter === cat
                  ? "bg-[#0f172a] text-white border-[#0f172a]"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {search || categoryFilter !== "All" ? (
        <p className="text-xs text-slate-400 mb-3">
          Showing {filtered.length} of {products.length} products
        </p>
      ) : null}

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 text-sm">
          No products match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
