import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const LeftNav = ({ onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <nav className={`bg-[#0f172a] text-white w-64 h-screen lg:w-[15%] flex flex-col ${collapsed ? 'collapsed' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h1 className="text-2xl font-bold text-slate-100">
                    Stock<span className="text-amber-400">Flow</span>
                </h1>
                <button onClick={toggleCollapse} className="focus:outline-none text-slate-400 hover:text-slate-100">
                    {collapsed ? (
                        <i className="fas fa-bars"></i>
                    ) : (
                        <i className="fas fa-chevron-left"></i>
                    )}
                </button>
            </div>

            <nav className="py-2 flex-1">
                <ul>
                    <li>
                        <a href="/dashboard" className={`flex items-center m-2 px-3 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors ${isActive('/dashboard') ? 'bg-[#1e3a5f] text-slate-100 font-semibold border-l-4 border-amber-400 !pl-2' : ''}`}>
                            <i className="fa-solid fa-house mr-3"></i>
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="/inventory" className={`flex items-center m-2 px-3 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors ${isActive('/inventory') ? 'bg-[#1e3a5f] text-slate-100 font-semibold border-l-4 border-amber-400 !pl-2' : ''}`}>
                            <i className="fa-solid fa-cart-flatbed mr-3"></i>
                            Inventory/Products
                        </a>
                    </li>
                    <li>
                        <a href="/categories" className={`flex items-center m-2 px-3 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors ${isActive('/categories') ? 'bg-[#1e3a5f] text-slate-100 font-semibold border-l-4 border-amber-400 !pl-2' : ''}`}>
                            <i className="fa-solid fa-table-list mr-3"></i>
                            Categories
                        </a>
                    </li>
                    <li>
                        <a href="/orders" className={`flex items-center m-2 px-3 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors ${isActive('/orders') ? 'bg-[#1e3a5f] text-slate-100 font-semibold border-l-4 border-amber-400 !pl-2' : ''}`}>
                            <i className="fa-solid fa-chart-line mr-3"></i>
                            Orders
                        </a>
                    </li>
                    <li>
                        <a href="/transactions" className={`flex items-center m-2 px-3 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors ${isActive('/transactions') ? 'bg-[#1e3a5f] text-slate-100 font-semibold border-l-4 border-amber-400 !pl-2' : ''}`}>
                            <i className="fa-solid fa-money-bill-trend-up mr-3"></i>
                            Transactions
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={onLogout}
                    className="w-full p-4 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                >
                    <i className="fa-solid fa-right-from-bracket mr-3"></i>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default LeftNav;