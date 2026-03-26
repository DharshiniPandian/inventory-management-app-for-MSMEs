import React from 'react';

const TYPE_THEME = {
    Sale:      { stripe: '#22c55e', icon: '↑', iconBg: '#f0fdf4', iconColor: '#15803d', badge: 'bg-green-50 text-green-700 border-green-200',  amountColor: 'text-green-700' },
    Refund:    { stripe: '#ef4444', icon: '↓', iconBg: '#fff1f2', iconColor: '#b91c1c', badge: 'bg-red-50 text-red-600 border-red-200',        amountColor: 'text-red-600'   },
    Purchase:  { stripe: '#2563eb', icon: '↗', iconBg: '#eff6ff', iconColor: '#1d4ed8', badge: 'bg-blue-50 text-blue-700 border-blue-200',     amountColor: 'text-blue-700'  },
    Expense:   { stripe: '#f59e0b', icon: '↘', iconBg: '#fffbeb', iconColor: '#b45309', badge: 'bg-amber-50 text-amber-700 border-amber-200',  amountColor: 'text-amber-700' },
    Adjustment:{ stripe: '#8b5cf6', icon: '↔', iconBg: '#f5f3ff', iconColor: '#6d28d9', badge: 'bg-purple-50 text-purple-700 border-purple-200', amountColor: 'text-purple-700'},
};

const DEFAULT_THEME = TYPE_THEME.Sale;

const STATUS_THEME = {
    Completed: 'bg-green-50 text-green-700 border-green-200',
    Pending:   'bg-amber-50 text-amber-700 border-amber-200',
    Failed:    'bg-red-50 text-red-600 border-red-200',
    Refunded:  'bg-blue-50 text-blue-700 border-blue-200',
};

const PAYMENT_ICONS = {
    UPI:           '📱',
    'Credit Card': '💳',
    COD:           '💵',
    'Net Banking': '🏦',
    Cash:          '💵',
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const TransactionCard = ({ transaction }) => {
    const theme = TYPE_THEME[transaction.type] || DEFAULT_THEME;
    const statusClass = STATUS_THEME[transaction.status] || STATUS_THEME.Pending;
    const isNegative = transaction.type === 'Refund' || transaction.type === 'Expense';

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
            {/* Colored top stripe */}
            <div className="h-1.5 w-full" style={{ background: theme.stripe }} />

            <div className="p-5 flex flex-col gap-4 flex-1">

                {/* Header: icon + ID + status */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-extrabold flex-shrink-0"
                            style={{ background: theme.iconBg, color: theme.iconColor }}
                        >
                            {theme.icon}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 leading-tight">
                                Transaction
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                #{transaction._id?.slice(-6) || 'N/A'}
                            </p>
                        </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusClass}`}>
                        {transaction.status || 'Pending'}
                    </span>
                </div>

                {/* Type badge */}
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border w-fit ${theme.badge}`}>
                    {transaction.type || 'Sale'}
                </span>

                {/* Amount + Date */}
                <div className="flex items-center justify-between py-3 border-t border-b border-slate-100">
                    <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Amount</p>
                        <p className={`text-2xl font-extrabold mt-0.5 ${theme.amountColor}`}>
                            {isNegative ? '−' : '+'}₹{(transaction.amount ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date</p>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                            {formatDate(transaction.date || transaction.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Payment</p>
                        <p className="text-sm font-semibold text-slate-700">
                            {PAYMENT_ICONS[transaction.method] || '💰'} {transaction.method || 'N/A'}
                        </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Category</p>
                        <p className="text-sm font-semibold text-slate-700 truncate">
                            {transaction.category || 'General'}
                        </p>
                    </div>
                </div>

                {/* Note / description */}
                {transaction.description && (
                    <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Note</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{transaction.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionCard;