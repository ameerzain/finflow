import React, { useState } from 'react';
import type { Transaction, Currency, Category } from '../../types';
import type { SortKey, SortOrder, TransactionTypeFilter } from '../../app/App';
import { TransactionType } from '../../types';
import { TrashIcon } from '../ui/icons/TrashIcon';
import { FilterIcon } from '../ui/icons/FilterIcon';
import { TransactionFiltersModal } from './TransactionFiltersModal';
import { SortAscIcon } from '../ui/icons/SortAscIcon';
import { SortDescIcon } from '../ui/icons/SortDescIcon';
import { ResetIcon } from '../ui/icons/ResetIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
  onEditTransaction: (transaction: Transaction) => void;
  currency: Currency;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedType: TransactionTypeFilter;
  onTypeChange: (value: TransactionTypeFilter) => void;
  categories: Category[];
  sortKey: SortKey;
  onSortKeyChange: (value: SortKey) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
  onResetFilters: () => void;
}

// Helper to escape CSV data
const escapeCsv = (str: string) => {
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const TransactionList: React.FC<TransactionListProps> = (props) => {
  const { 
    transactions, 
    onDeleteTransaction, 
    onEditTransaction, 
    currency, 
    searchTerm, 
    onSearchChange,
    selectedCategory,
    selectedType,
    sortKey,
    sortOrder,
    onSortOrderChange,
    onResetFilters,
    categories 
  } = props;
  
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const getCategoryDisplay = (value: string) => {
    const category = categories.find(c => c.value === value);
    return category ? `${category.icon} ${category.label}` : value;
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Description', 'Category', 'Amount'];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.type,
      escapeCsv(t.description),
      escapeCsv(getCategoryDisplay(t.category)),
      t.amount
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "transactions.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleDelete = (transaction: Transaction) => {
    const confirmMessage = `Are you sure you want to delete the transaction "${transaction.description}"?\n\nThis action cannot be undone.`;
    if (window.confirm(confirmMessage)) {
      onDeleteTransaction(transaction.id);
    }
  };

  const areFiltersActive = searchTerm || selectedCategory || selectedType !== 'all' || sortKey !== 'none';

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-on-surface">All Transactions</h2>
        <div className="flex items-center gap-2">
           <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            aria-label="Search transactions by description"
          />
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex-shrink-0 p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            aria-label={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            {sortOrder === 'asc' ? <SortAscIcon className="w-5 h-5" /> : <SortDescIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-on-surface-secondary text-sm font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            aria-label="Open filters"
          >
            <FilterIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button
            onClick={onResetFilters}
            disabled={!areFiltersActive}
            className={`
              flex-shrink-0 flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary transition-all 
              ${areFiltersActive
                ? 'bg-primary text-white hover:bg-blue-600 animate-pulse'
                : 'bg-gray-100 text-on-surface-secondary'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            aria-label="Reset filters"
            title={areFiltersActive ? "Reset all filters and sorting" : "No active filters to reset"}
          >
            <ResetIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow">
        <ul className="divide-y divide-gray-200">
          {transactions.length > 0 ? (
            transactions.map(t => (
              <li key={t.id} className="group p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">
                <div
                  className="flex-1 flex items-center space-x-3 sm:space-x-4 cursor-pointer overflow-hidden"
                  onClick={() => onEditTransaction(t)}
                  aria-label={`Edit transaction for ${t.description}`}
                >
                   <div className={`flex-shrink-0 w-2.5 h-10 rounded-full ${t.type === TransactionType.INCOME ? 'bg-secondary' : 'bg-red-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface truncate">{t.description}</p>
                    <p className="text-sm text-on-surface-secondary">{getCategoryDisplay(t.category)} - {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pl-2 sm:pl-4">
                  <p className={`font-bold w-24 text-sm sm:w-32 sm:text-base text-right ${t.type === TransactionType.INCOME ? 'text-secondary' : 'text-red-500'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(t.amount)}
                  </p>
                  <button 
                    onClick={() => handleDelete(t)}
                    className="text-gray-400 hover:text-red-600 p-2 rounded-full transition-all"
                    aria-label={`Delete transaction for ${t.description}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="p-8 text-center text-on-surface-secondary">
              No transactions yet. Add one to get started!
            </li>
          )}
        </ul>
      </div>

      <TransactionFiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        onExportCSV={handleExportCSV}
        {...props}
      />
    </section>
  );
};