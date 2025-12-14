import React, { useState, useMemo, useEffect } from 'react';
import type { Category, Budgets } from '../../types';
import { TransactionType } from '../../types';
import { XIcon } from '../ui/icons/XIcon';

interface BudgetGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budgets: Budgets) => void;
  categories: Category[];
  budgets: Budgets;
  categoryToEdit?: Category | null;
}

export const BudgetGoalModal: React.FC<BudgetGoalModalProps> = ({ isOpen, onClose, onSave, categories, budgets, categoryToEdit }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const isEditMode = Boolean(categoryToEdit);

  const unbudgetedCategories = useMemo(() => {
    return categories.filter(c => c.type === TransactionType.EXPENSE && (!budgets[c.value] || budgets[c.value] === 0));
  }, [categories, budgets]);

  useEffect(() => {
    if (isOpen) {
        if (isEditMode && categoryToEdit) {
            setSelectedCategory(categoryToEdit.value);
            setAmount(String(budgets[categoryToEdit.value] || ''));
        } else {
            setSelectedCategory('');
            setAmount('');
        }
        setError('');
    }
  }, [isOpen, isEditMode, categoryToEdit, budgets]);


  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      setError('Please select a category.');
      return;
    }
    const budgetAmount = parseFloat(amount);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      setError('Please enter a valid, positive budget amount.');
      return;
    }
    
    const newBudgets = {
      ...budgets,
      [selectedCategory]: budgetAmount
    };

    onSave(newBudgets);
    
    // Parent component handles closing and resetting state
  };
  
  const categoriesForSelect = isEditMode && categoryToEdit ? [categoryToEdit] : unbudgetedCategories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-on-surface">{isEditMode ? 'Edit Monthly Goal' : 'Add Monthly Goal'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="goal_category" className="block text-sm font-medium text-on-surface-secondary">Category</label>
            <select
              id="goal_category"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              disabled={isEditMode}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="" disabled>Select a category...</option>
              {categoriesForSelect.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="goal_amount" className="block text-sm font-medium text-on-surface-secondary">Budget Amount</label>
            <input
              type="number"
              id="goal_amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
            >
              {isEditMode ? 'Save Changes' : 'Set Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};