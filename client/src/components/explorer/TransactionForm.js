import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactions } from '../../context/TransactionContext';
import { transactionAPI } from '../../utils/api';
import './TransactionForm.css';

export default function TransactionForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { categories, fetchCategories, invalidateDashboard, fetchExplorer, setExplorerFiltersState } = useTransactions();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    setFetchLoading(true);
    transactionAPI
      .getTransaction(id)
      .then(({ data }) => {
        if (!cancelled) {
          setTitle(data.title || '');
          setAmount(data.amount !== undefined ? String(data.amount) : '');
          setCategory(data.category || '');
          setDate(data.date ? new Date(data.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
          setNotes(data.notes || '');
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load transaction');
      })
      .finally(() => {
        if (!cancelled) setFetchLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    const num = Number(amount);
    if (Number.isNaN(num) || num < 0) {
      setError('Amount must be a positive number');
      return;
    }
    if (!category.trim()) {
      setError('Category is required');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await transactionAPI.update(id, { title: title.trim(), amount: num, category: category.trim(), date, notes: notes.trim() });
      } else {
        await transactionAPI.create({ title: title.trim(), amount: num, category: category.trim(), date, notes: notes.trim() });
      }
      invalidateDashboard();
      setExplorerFiltersState({ page: 1 });
      fetchExplorer({ page: 1 });
      navigate('/explorer');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="form-card">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h2>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Title *
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Groceries"
          />
        </label>
        <label>
          Amount (₹) *
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </label>
        <label>
          Category *
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="categories-list"
            required
            placeholder="e.g. Food, Transport"
          />
          <datalist id="categories-list">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label>
          Date *
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Optional notes"
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Add'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/explorer')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
