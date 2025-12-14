
import React, { useState, useEffect } from 'react';
import type { Transaction, Category } from '../types';
import { TransactionType } from '../types';
import { XIcon } from './icons/XIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
  transactionToEdit?: Transaction | null;
  categories: Category[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, transactionToEdit, categories }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const isEditMode = Boolean(transactionToEdit);

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmount(String(transactionToEdit.amount));
      setCategory(transactionToEdit.category);
      setDescription(transactionToEdit.description);
      setDate(transactionToEdit.date);
    } else {
      // Reset form for "add" mode
      setType(TransactionType.EXPENSE);
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setError('');
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: TransactionType) => {
    if (type !== newType) {
      setType(newType);
      setCategory(''); // Reset category when type changes
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description || !date) {
      setError('Please fill in all fields.');
      return;
    }
    if (parseFloat(amount) <= 0) {
      setError('Amount must be positive.');
      return;
    }
    
    const transactionData = {
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    };

    if (isEditMode && transactionToEdit) {
      onSave({ ...transactionData, id: transactionToEdit.id });
    } else {
      onSave(transactionData);
    }
  };

  const availableCategories = categories.filter(c => c.type === type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-on-surface">{isEditMode ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleTypeChange(TransactionType.EXPENSE)}
              className={`p-3 rounded-lg font-semibold transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange(TransactionType.INCOME)}
              className={`p-3 rounded-lg font-semibold transition-colors ${type === TransactionType.INCOME ? 'bg-secondary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Income
            </button>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-on-surface-secondary">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-on-surface-secondary">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g., Groceries"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-on-surface-secondary">Category</label>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="" disabled>Select category</option>
                {availableCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-on-surface-secondary">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
            >
              {isEditMode ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
