import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';

const CATEGORY_COLORS = {
  Electronics: { dot: '#2563eb', bg: '#eff6ff' },
  Furniture:   { dot: '#f59e0b', bg: '#fffbeb' },
  Stationery:  { dot: '#22c55e', bg: '#f0fdf4' },
  Networking:  { dot: '#8b5cf6', bg: '#f5f3ff' },
  Packaging:   { dot: '#f43f5e', bg: '#fff1f2' },
};

const FieldLabel = ({ children, required }) => (
  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
    {children}
    {required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const inputBase =
  'w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1e3a5f] focus:bg-white focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all';

const AddProductForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', description: '', sku: '', price: '', quantity: '', category: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    categoriesAPI.getAll()
      .then(r => setCategories(r.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await productsAPI.create({
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        category: formData.category,
      });
      setSuccess('Product added successfully!');
      setFormData({ name: '', description: '', sku: '', price: '', quantity: '', category: '' });
      setTimeout(() => navigate('/inventory'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const selectedCat = categories.find(c => c._id === formData.category);
  const catTheme = selectedCat ? (CATEGORY_COLORS[selectedCat.name] || { dot: '#64748b', bg: '#f8fafc' }) : null;

  const filled = Object.values(formData).filter(Boolean).length;
  const total  = Object.keys(formData).length;
  const progress = Math.round((filled / total) * 100);

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add Product</h1>
          <p className="text-sm text-slate-400 mt-0.5">Fill in the details to add a new product to inventory</p>
        </div>
        <Link
          to="/inventory"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-4 py-2 rounded-lg transition-colors"
        >
          ← Back to Inventory
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Alerts */}
        {error && (
          <div className="mb-4 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">!</span>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-start gap-3 p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            {success}
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-slate-100">
            <div
              className="h-full bg-[#1e3a5f] transition-all duration-500 rounded-r-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Product details</h2>
                <p className="text-xs text-slate-400 mt-0.5">{filled} of {total} fields completed</p>
              </div>
              {catTheme && (
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{ background: catTheme.bg, color: catTheme.dot, borderColor: catTheme.dot + '30' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: catTheme.dot }} />
                  {selectedCat.name}
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Product name</FieldLabel>
                  <input
                    type="text" name="name" placeholder="e.g. Wireless Keyboard"
                    value={formData.name} onChange={handleChange}
                    className={inputBase} required
                  />
                </div>
                <div>
                  <FieldLabel required>SKU</FieldLabel>
                  <input
                    type="text" name="sku" placeholder="e.g. EL-WK-001"
                    value={formData.sku} onChange={handleChange}
                    className={`${inputBase} font-mono`} required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  name="description" placeholder="Brief product description…"
                  value={formData.description} onChange={handleChange}
                  rows={3}
                  className={`${inputBase} resize-none`}
                />
              </div>

              {/* Price + Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Price (₹)</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">₹</span>
                    <input
                      type="number" name="price" placeholder="0.00"
                      value={formData.price} onChange={handleChange}
                      className={`${inputBase} pl-7`}
                      min="0" step="0.01" required
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel required>Quantity</FieldLabel>
                  <input
                    type="number" name="quantity" placeholder="0"
                    value={formData.quantity} onChange={handleChange}
                    className={inputBase} min="0" required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <FieldLabel required>Category</FieldLabel>
                <select
                  name="category" value={formData.category}
                  onChange={handleChange}
                  className={`${inputBase} cursor-pointer`} required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-2" />

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-[#0f172a] hover:bg-[#1e293b] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Adding product…
                    </span>
                  ) : 'Add product'}
                </button>
                <Link
                  to="/inventory"
                  className="text-sm font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 px-5 rounded-xl transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Helper note */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Fields marked <span className="text-red-400 font-semibold">*</span> are required
        </p>
      </div>
    </div>
  );
};

export default AddProductForm;