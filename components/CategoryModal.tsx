
import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { TransactionType } from '../types';
import { ICON_OPTIONS } from '../constants';
import { XIcon } from './icons/XIcon';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'value'> | Category) => void;
  categoryToEdit?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, categoryToEdit }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [error, setError] = useState('');

  const isEditMode = Boolean(categoryToEdit);

  useEffect(() => {
    if (categoryToEdit) {
      setType(categoryToEdit.type);
      setLabel(categoryToEdit.label);
      setIcon(categoryToEdit.icon);
    } else {
      // Reset form for "add" mode
      setType(TransactionType.EXPENSE);
      setLabel('');
      setIcon(ICON_OPTIONS[0]);
    }
    setError('');
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError('Category name cannot be empty.');
      return;
    }
    
    const categoryData = {
      label: label.trim(),
      type,
      icon,
    };

    if (isEditMode && categoryToEdit) {
      onSave({ ...categoryData, value: categoryToEdit.value, isDefault: categoryToEdit.isDefault });
    } else {
      onSave(categoryData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-on-surface">{isEditMode ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-secondary">Type</label>
            <div className={`grid grid-cols-2 gap-4 mt-1 ${isEditMode ? 'opacity-50' : ''}`}>
              <button
                type="button"
                onClick={() => setType(TransactionType.EXPENSE)}
                disabled={isEditMode}
                className={`p-3 rounded-lg font-semibold transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'} ${isEditMode ? 'cursor-not-allowed' : ''}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType(TransactionType.INCOME)}
                disabled={isEditMode}
                className={`p-3 rounded-lg font-semibold transition-colors ${type === TransactionType.INCOME ? 'bg-secondary text-white' : 'bg-gray-100 hover:bg-gray-200'} ${isEditMode ? 'cursor-not-allowed' : ''}`}
              >
                Income
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-on-surface-secondary">Category Name</label>
            <input
              type="text"
              id="label"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g., Groceries"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-secondary">Icon</label>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIcon(opt)}
                  className={`text-2xl p-2 rounded-lg transition-all ${icon === opt ? 'bg-primary ring-2 ring-offset-2 ring-primary' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
            >
              {isEditMode ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
