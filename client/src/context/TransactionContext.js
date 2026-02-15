import React, { createContext, useContext, useState, useCallback } from 'react';
import { transactionAPI } from '../utils/api';

const TransactionContext = createContext(null);

const defaultFilters = {
  page: 1,
  limit: 10,
  search: '',
  category: '',
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

export function TransactionProvider({ children }) {
  const [dashboard, setDashboard] = useState({ totalExpense: 0, categorySummary: [], recentTransactions: [] });
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [explorerFilters, setExplorerFilters] = useState(defaultFilters);
  const [explorerData, setExplorerData] = useState({ transactions: [], pagination: null });
  const [explorerLoading, setExplorerLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchDashboard = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const { data } = await transactionAPI.getDashboard();
      setDashboard({
        totalExpense: data.totalExpense ?? 0,
        categorySummary: data.categorySummary ?? [],
        recentTransactions: data.recentTransactions ?? [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await transactionAPI.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchExplorer = useCallback(async (overrides = {}, append = false) => {
    const params = { ...explorerFilters, ...overrides };
    setExplorerLoading(true);
    try {
      const { data } = await transactionAPI.getTransactions({
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        category: params.category || undefined,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
        amountMin: params.amountMin !== '' ? params.amountMin : undefined,
        amountMax: params.amountMax !== '' ? params.amountMax : undefined,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      });
      const newList = data.transactions ?? [];
      setExplorerData((prev) => ({
        transactions: append ? [...(prev.transactions || []), ...newList] : newList,
        pagination: data.pagination ?? null,
      }));
      setExplorerFilters((prev) => ({ ...prev, ...overrides }));
    } catch (err) {
      console.error(err);
    } finally {
      setExplorerLoading(false);
    }
  }, [explorerFilters.page, explorerFilters.limit, explorerFilters.search, explorerFilters.category, explorerFilters.dateFrom, explorerFilters.dateTo, explorerFilters.amountMin, explorerFilters.amountMax, explorerFilters.sortBy, explorerFilters.sortOrder]);

  const setExplorerFiltersState = useCallback((updates) => {
    setExplorerFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const invalidateDashboard = useCallback(() => {
    fetchDashboard();
    fetchCategories();
  }, [fetchDashboard, fetchCategories]);

  return (
    <TransactionContext.Provider
      value={{
        dashboard,
        dashboardLoading,
        fetchDashboard,
        explorerFilters,
        explorerData,
        explorerLoading,
        fetchExplorer,
        setExplorerFiltersState,
        categories,
        fetchCategories,
        invalidateDashboard,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
}
