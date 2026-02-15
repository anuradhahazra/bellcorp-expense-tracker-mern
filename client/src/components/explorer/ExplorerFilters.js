import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import './Explorer.css';

export default function ExplorerFilters({ onSearch, onFilterApply }) {
  const {
    explorerFilters,
    setExplorerFiltersState,
    fetchExplorer,
    categories,
    fetchCategories,
  } = useTransactions();

  const [searchInput, setSearchInput] = useState(explorerFilters.search);
  const [category, setCategory] = useState(explorerFilters.category);
  const [dateFrom, setDateFrom] = useState(explorerFilters.dateFrom);
  const [dateTo, setDateTo] = useState(explorerFilters.dateTo);
  const [amountMin, setAmountMin] = useState(explorerFilters.amountMin);
  const [amountMax, setAmountMax] = useState(explorerFilters.amountMax);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setSearchInput(explorerFilters.search);
    setCategory(explorerFilters.category);
    setDateFrom(explorerFilters.dateFrom);
    setDateTo(explorerFilters.dateTo);
    setAmountMin(explorerFilters.amountMin);
    setAmountMax(explorerFilters.amountMax);
  }, [explorerFilters.search, explorerFilters.category, explorerFilters.dateFrom, explorerFilters.dateTo, explorerFilters.amountMin, explorerFilters.amountMax]);

  const handleSearchChange = (e) => {
    const v = e.target.value;
    setSearchInput(v);
    setExplorerFiltersState({ search: v, page: 1 });
    if (onSearch) onSearch(v);
  };

  const handleApply = () => {
    setExplorerFiltersState({
      category,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      page: 1,
    });
    fetchExplorer({
      category,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      page: 1,
    });
    if (onFilterApply) onFilterApply();
  };

  const handleClear = () => {
    setSearchInput('');
    setCategory('');
    setDateFrom('');
    setDateTo('');
    setAmountMin('');
    setAmountMax('');
    setExplorerFiltersState({
      search: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      page: 1,
    });
    fetchExplorer({
      search: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      page: 1,
    });
  };

  return (
    <div className="explorer-filters">
      <div className="filter-row search-row">
        <input
          type="search"
          placeholder="Search by title or notes..."
          value={searchInput}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="filter-row filters-grid">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="filter-input"
          placeholder="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="filter-input"
          placeholder="To date"
        />
        <input
          type="number"
          value={amountMin}
          onChange={(e) => setAmountMin(e.target.value)}
          placeholder="Min amount"
          className="filter-input"
          min="0"
          step="0.01"
        />
        <input
          type="number"
          value={amountMax}
          onChange={(e) => setAmountMax(e.target.value)}
          placeholder="Max amount"
          className="filter-input"
          min="0"
          step="0.01"
        />
        <button type="button" onClick={handleApply} className="btn btn-primary">
          Apply
        </button>
        <button type="button" onClick={handleClear} className="btn btn-secondary">
          Clear
        </button>
      </div>
    </div>
  );
}
