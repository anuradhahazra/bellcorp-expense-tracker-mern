import React, { useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import './Dashboard.css';

export default function DashboardSummary() {
  const { dashboard, dashboardLoading, fetchDashboard } = useTransactions();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (dashboardLoading) {
    return (
      <div className="dashboard-section">
        <p className="muted">Loading dashboard...</p>
      </div>
    );
  }

  const { totalExpense, categorySummary, recentTransactions } = dashboard;

  return (
    <div className="dashboard-summary">
      <section className="dashboard-section total-card">
        <h3>Total Expense</h3>
        <p className="total-amount">
          {typeof totalExpense === 'number'
            ? `₹${totalExpense.toLocaleString('en-IN')}`
            : '₹0'}
        </p>
      </section>

      {categorySummary.length > 0 && (
        <section className="dashboard-section">
          <h3>Category Summary</h3>
          <ul className="category-list">
            {categorySummary.map((item) => (
              <li key={item.category}>
                <span className="cat-name">{item.category}</span>
                <span className="cat-amount">
                  ₹{item.total.toLocaleString('en-IN')} ({item.count})
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="dashboard-section">
        <h3>Recent Transactions</h3>
        {recentTransactions.length === 0 ? (
          <p className="muted">No transactions yet. Add one from Explorer.</p>
        ) : (
          <ul className="recent-list">
            {recentTransactions.map((t) => (
              <li key={t._id}>
                <span className="recent-title">{t.title}</span>
                <span className="recent-meta">
                  {t.category} · {new Date(t.date).toLocaleDateString()}
                </span>
                <span className="recent-amount">₹{Number(t.amount).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
