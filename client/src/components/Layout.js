import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <Link to="/dashboard" className="logo">
          Bellcorp Expense Tracker
        </Link>
        <nav className="layout-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/explorer">Explorer</Link>
          <Link to="/transactions/new">Add Transaction</Link>
          <span className="user-name">{user?.name}</span>
          <button type="button" onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </nav>
      </header>
      <main className="layout-main">
        <div className="app-container">{children}</div>
      </main>
    </div>
  );
}
