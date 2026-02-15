import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactions } from '../../context/TransactionContext';
import { transactionAPI } from '../../utils/api';
import './DeleteTransaction.css';

export default function DeleteTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invalidateDashboard, fetchExplorer, setExplorerFiltersState } = useTransactions();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    transactionAPI
      .getTransaction(id)
      .then(({ data }) => {
        if (!cancelled) setTransaction(data);
      })
      .catch(() => {
        if (!cancelled) setError('Transaction not found');
      });
    return () => { cancelled = true; };
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await transactionAPI.delete(id);
      invalidateDashboard();
      setExplorerFiltersState({ page: 1 });
      fetchExplorer({ page: 1 });
      navigate('/explorer');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  if (error && !transaction) {
    return (
      <div className="delete-card">
        <p className="delete-error">{error}</p>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/explorer')}>
          Back to Explorer
        </button>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="delete-card">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="delete-card">
      <h2>Delete Transaction</h2>
      <p>Are you sure you want to delete this transaction?</p>
      <div className="delete-preview">
        <strong>{transaction.title}</strong>
        <span>₹{Number(transaction.amount).toLocaleString('en-IN')} · {transaction.category}</span>
        <span>{new Date(transaction.date).toLocaleDateString()}</span>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/explorer')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
