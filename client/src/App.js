import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import DeleteTransactionPage from './pages/DeleteTransaction';
import './assets/index.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8' }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/explorer"
        element={
          <ProtectedRoute>
            <Layout>
              <Explorer />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/new"
        element={
          <ProtectedRoute>
            <Layout>
              <AddTransaction />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/edit/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <EditTransaction />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/delete/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DeleteTransactionPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <AppRoutes />
      </TransactionProvider>
    </AuthProvider>
  );
}
