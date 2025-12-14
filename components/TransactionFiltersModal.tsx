import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import type { SortKey, SortOrder, TransactionTypeFilter } from '../App';
import { XIcon } from './icons/XIcon';
import { ExportIcon } from './icons/ExportIcon';

interface TransactionFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  onExportCSV: () => void;
}

export const TransactionFiltersModal: React.FC<TransactionFiltersModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  categories,
  sortKey,
  onSortKeyChange,
  onExportCSV,
}) => {
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory);
  const [localSelectedType, setLocalSelectedType] = useState(selectedType);
  const [localSortKey, setLocalSortKey] = useState(sortKey);

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedCategory(selectedCategory);
      setLocalSelectedType(selectedType);
      setLocalSortKey(sortKey);
    }
  }, [isOpen, selectedCategory, selectedType, sortKey]);

  if (!isOpen) return null;

  const handleApplyFilters = () => {
    onCategoryChange(localSelectedCategory);
    onTypeChange(localSelectedType);
    onSortKeyChange(localSortKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-on-surface">Filters & Sort</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <fieldset>
            <legend className="block text-sm font-semibold text-on-surface-secondary mb-2">Filter By</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={localSelectedType}
                onChange={(e) => setLocalSelectedType(e.target.value as TransactionTypeFilter)}
                className="py-2 pl-3 pr-8 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 appearance-none bg-white"
                aria-label="Filter by type"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={localSelectedCategory}
                onChange={(e) => setLocalSelectedCategory(e.target.value)}
                className="py-2 pl-3 pr-8 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 appearance-none bg-white"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          
          <fieldset>
            <legend className="block text-sm font-semibold text-on-surface-secondary mb-2">Sort By</legend>
            <select
              value={localSortKey}
              onChange={(e) => setLocalSortKey(e.target.value as SortKey)}
              className="py-2 pl-3 pr-8 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 appearance-none bg-white"
              aria-label="Sort by"
            >
              <option value="none">Sort by...</option>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </fieldset>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={handleApplyFilters}
              className="w-full sm:w-auto bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
            >
              Apply Filters
            </button>
            <button
                onClick={onExportCSV}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-primary text-sm font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
            >
                <ExportIcon className="w-5 h-5" />
                Export to CSV
            </button>
        </div>
      </div>
    </div>
  );
};
