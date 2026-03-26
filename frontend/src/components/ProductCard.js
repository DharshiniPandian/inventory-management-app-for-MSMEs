import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_THEME = {
    Electronics: { stripe: '#2563eb', iconBg: '#eff6ff', badge: 'bg-blue-50 text-blue-700', icon: '⚡' },
    Furniture:   { stripe: '#f59e0b', iconBg: '#fffbeb', badge: 'bg-amber-50 text-amber-700', icon: '🪑' },
    Stationery:  { stripe: '#22c55e', iconBg: '#f0fdf4', badge: 'bg-green-50 text-green-700', icon: '✏️' },
    Networking:  { stripe: '#8b5cf6', iconBg: '#f5f3ff', badge: 'bg-purple-50 text-purple-700', icon: '🔌' },
    Packaging:   { stripe: '#f43f5e', iconBg: '#fff1f2', badge: 'bg-rose-50 text-rose-700', icon: '📦' },
};

const DEFAULT_THEME = { stripe: '#64748b', iconBg: '#f8fafc', badge: 'bg-slate-100 text-slate-600', icon: '📁' };

const StockBar = ({ stock, max = 200 }) => {
    const pct = Math.min(Math.round((stock / max) * 100), 100);
    const color = stock === 0 ? '#ef4444' : stock < 10 ? '#f97316' : stock < 30 ? '#eab308' : '#22c55e';
    return (
        <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Stock level</span>
                <span>{stock} units</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
            </div>
        </div>
    );
};

const StockBadge = ({ stock }) => {
    if (stock === 0) return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">Out of Stock</span>;
    if (stock < 10) return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">Low Stock</span>;
    if (stock < 30) return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">Limited</span>;
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">In Stock</span>;
};

const ProductCard = ({ product, onDelete }) => {
    const catName = product.category?.name || product.category || 'Uncategorized';
    const theme = CATEGORY_THEME[catName] || DEFAULT_THEME;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
            {/* Colored stripe */}
            <div className="h-1.5 w-full" style={{ background: theme.stripe }} />

            <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                            style={{ background: theme.iconBg }}
                        >
                            {theme.icon}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 leading-tight">{product.name}</h3>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{product.sku || 'N/A'}</p>
                        </div>
                    </div>
                    <StockBadge stock={product.stock ?? product.quantity ?? 0} />
                </div>

                {/* Category pill */}
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full w-fit border ${theme.badge} border-current/20`}>
                    {catName}
                </span>

                {/* Price + Stock numbers */}
                <div className="flex items-center justify-between py-3 border-t border-b border-slate-100">
                    <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Price</p>
                        <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                            ₹{(product.price ?? 0).toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Qty</p>
                        <p className="text-xl font-extrabold text-slate-700 mt-0.5">
                            {product.stock ?? product.quantity ?? 0}
                            <span className="text-xs font-normal text-slate-400 ml-1">units</span>
                        </p>
                    </div>
                </div>

                {/* Stock bar */}
                <StockBar stock={product.stock ?? product.quantity ?? 0} />

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto pt-1">
                    <Link
                        to={`/inventory/edit/${product._id}`}
                        className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => onDelete(product._id)}
                        className="flex-1 text-xs font-bold py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;