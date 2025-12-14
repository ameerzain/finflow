
import React, { useState, useEffect, useMemo } from 'react';
import type { Category } from '../types';
import { XIcon } from './icons/XIcon';
import { TransactionType } from '../types';

interface MergeCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMerge: (fromValue: string, toValue: string) => void;
  categories: Category[];
}

export const MergeCategoryModal: React.FC<MergeCategoryModalProps> = ({ isOpen, onClose, onMerge, categories }) => {
  const [fromCategory, setFromCategory] = useState('');
  const [toCategory, setToCategory] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!isOpen) {
      setFromCategory('');
      setToCategory('');
      setError('');
    }
  }, [isOpen]);

  const selectedFromCategory = useMemo(() => categories.find(c => c.value === fromCategory), [fromCategory, categories]);

  const availableToCategories = useMemo(() => {
    if (!selectedFromCategory) return [];
    return categories.filter(c => c.type === selectedFromCategory.type && c.value !== selectedFromCategory.value);
  }, [selectedFromCategory, categories]);
  
  const handleFromChange = (value: string) => {
      setFromCategory(value);
      setToCategory(''); // Reset 'to' category when 'from' changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCategory || !toCategory) {
      setError('Please select both categories to merge.');
      return;
    }
    if (fromCategory === toCategory) {
      setError('Cannot merge a category into itself.');
      return;
    }
    const fromCat = categories.find(c => c.value === fromCategory);
    if (fromCat?.isDefault) {
        setError('Cannot merge from a default category.');
        return;
    }

    if (window.confirm(`Are you sure you want to merge "${selectedFromCategory?.label}" into "${categories.find(c=>c.value===toCategory)?.label}"? This action cannot be undone.`)) {
        onMerge(fromCategory, toCategory);
    }
  };
  
  const incomeCategories = categories.filter(c => c.type === TransactionType.INCOME && !c.isDefault);
  const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE && !c.isDefault);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-on-surface">Merge Categories</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-on-surface-secondary">
            Select a category to merge from, and a category to merge into. All transactions will be moved to the destination category, and the source category will be deleted. You can only merge from non-default categories.
          </p>
          <div>
            <label htmlFor="fromCategory" className="block text-sm font-medium text-on-surface-secondary">Merge From</label>
            <select
              id="fromCategory"
              value={fromCategory}
              onChange={e => handleFromChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="" disabled>Select source category...</option>
              <optgroup label="Expenses">
                {expenseCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
              </optgroup>
              <optgroup label="Income">
                {incomeCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
              </optgroup>
            </select>
          </div>
          <div>
            <label htmlFor="toCategory" className="block text-sm font-medium text-on-surface-secondary">Merge Into</label>
            <select
              id="toCategory"
              value={toCategory}
              onChange={e => setToCategory(e.target.value)}
              disabled={!fromCategory}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100"
            >
              <option value="" disabled>Select destination category...</option>
              {availableToCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!fromCategory || !toCategory}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Merge Categories
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
