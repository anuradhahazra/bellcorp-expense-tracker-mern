import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../../context/TransactionContext';
import ExplorerFilters from './ExplorerFilters';
import './Explorer.css';

export default function TransactionExplorer() {
  const {
    explorerFilters,
    explorerData,
    explorerLoading,
    fetchExplorer,
    setExplorerFiltersState,
  } = useTransactions();

  const loadMore = useCallback(() => {
    const nextPage = (explorerFilters.page || 1) + 1;
    setExplorerFiltersState({ page: nextPage });
    fetchExplorer({ page: nextPage }, true);
  }, [explorerFilters.page, fetchExplorer, setExplorerFiltersState]);

  useEffect(() => {
    fetchExplorer();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchExplorer({ search: explorerFilters.search, page: 1 });
    }, 300);
    return () => clearTimeout(t);
  }, [explorerFilters.search]);

  const { transactions, pagination } = explorerData;
  const hasMore = pagination?.hasMore ?? false;
  const total = pagination?.total ?? 0;

  return (
    <div className="explorer-wrap">
      <ExplorerFilters />
      {explorerLoading && transactions.length === 0 ? (
        <div className="explorer-loading">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="explorer-empty">
          <p>No transactions found.</p>
          <p>
            <Link to="/transactions/new">Add your first transaction</Link> or
            adjust filters.
          </p>
        </div>
      ) : (
        <>
          <ul className="transaction-list">
            {transactions.map((t) => (
              <li key={t._id} className="transaction-item">
                <span className="title">{t.title}</span>
                <span className="meta">
                  {t.category} · {new Date(t.date).toLocaleDateString()}
                </span>
                <span className="amount">₹{Number(t.amount).toLocaleString('en-IN')}</span>
                <div className="actions">
                  <Link to={`/transactions/edit/${t._id}`}>
                    <button type="button" className="btn btn-secondary">
                      Edit
                    </button>
                  </Link>
                  <Link to={`/transactions/delete/${t._id}`}>
                    <button type="button" className="btn btn-danger">
                      Delete
                    </button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="explorer-load-more">
              <button
                type="button"
                onClick={loadMore}
                disabled={explorerLoading}
              >
                {explorerLoading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
          {total > 0 && (
            <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Showing {transactions.length} of {total}
            </p>
          )}
        </>
      )}
    </div>
  );
}
