import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LeftNav from './components/LeftNav';
import Footer from './components/Footer';
import Header from './components/Header';

import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/Inventory';
import AddProductForm from './components/AddProductForm';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import TransactionsPage from './pages/TransactionsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-100">
                <div className="text-slate-400 text-sm">Loading...</div>
            </div>
        );
    }

    return (
        <Router>
            {isAuthenticated ? (
                // Authenticated layout: nav fixed on left, content fills right
                <div className="flex h-screen overflow-hidden">

                    {/* Left nav: fixed height, never scrolls */}
                    <LeftNav onLogout={handleLogout} />

                    {/* Right side: flex column, fills remaining width */}
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

                        {/* Header: always visible at top */}
                        <Header />

                        {/* Main content: scrollable, grows to fill space between header and footer */}
                        <main className="flex-1 overflow-y-auto bg-slate-100">
                            <Routes>
                                <Route path="/dashboard"             element={<Dashboard />} />
                                <Route path="/inventory"             element={<InventoryPage />} />
                                <Route path="/inventory/add-product" element={<AddProductForm />} />
                                <Route path="/categories"            element={<CategoriesPage />} />
                                <Route path="/orders"                element={<OrdersPage />} />
                                <Route path="/transactions"          element={<TransactionsPage />} />
                                <Route path="/"                      element={<Navigate to="/dashboard" />} />
                                <Route path="*"                      element={<Navigate to="/dashboard" />} />
                            </Routes>
                        </main>

                        {/* Footer: always pinned at bottom of right column */}
                        <Footer />

                    </div>
                </div>
            ) : (
                // Unauthenticated layout: full page routes
                <Routes>
                    <Route path="/"         element={<LandingPage />} />
                    <Route path="/login"    element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="*"         element={<Navigate to="/" />} />
                </Routes>
            )}
        </Router>
    );
};

export default App;