
import React, { useState, useMemo, useEffect } from 'react';
import type { Transaction, Budgets, Currency, Category } from '../../types';
import { TransactionType } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface BudgetTrackerProps {
  transactions: Transaction[];
  budgets: Budgets;
  onSaveBudgets: (budgets: Budgets) => void;
  currency: Currency;
  categories: Category[];
}

const formatCurrency = (amount: number, currency: Currency) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
}).format(amount);

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({ transactions, budgets, onSaveBudgets, currency, categories }) => {
  const [editingBudgets, setEditingBudgets] = useState<Budgets>(budgets);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setEditingBudgets(budgets);
  }, [budgets]);
  
  const monthlyExpenses = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === TransactionType.EXPENSE &&
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }, [transactions]);

  const handleBudgetChange = (category: string, value: string) => {
    const amount = value ? parseFloat(value) : 0;
    setEditingBudgets(prev => ({
      ...prev,
      [category]: Math.max(0, amount) // Ensure budget is not negative
    }));
  };

  const handleSave = () => {
    onSaveBudgets(editingBudgets);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);

  return (
    <div className="bg-surface p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-on-surface mb-4">Set Budget Goals</h3>
      <p className="mt-1 text-sm text-on-surface-secondary mb-6">
        Set monthly spending limits for your expense categories to stay on track.
      </p>
      <div className="space-y-4">
        {expenseCategories.map(cat => {
          const spent = monthlyExpenses[cat.value] || 0;
          const budget = editingBudgets[cat.value] || 0;
          const progress = budget > 0 ? (spent / budget) * 100 : 0;
          const remaining = budget - spent;

          return (
            <div key={cat.value}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-1">
                <span className="font-medium">{cat.icon} {cat.label}</span>
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-2">
                  <span className="text-sm text-on-surface-secondary">Budget:</span>
                  <div className='flex items-center'>
                    <span className="font-semibold text-lg">{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(0).replace(/[0-9]/g, '').trim()}</span>
                    <input
                      type="number"
                      value={editingBudgets[cat.value] || ''}
                      onChange={e => handleBudgetChange(cat.value, e.target.value)}
                      placeholder="0"
                      className="w-24 px-2 py-1 text-right bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      aria-label={`Budget for ${cat.label}`}
                    />
                  </div>
                </div>
              </div>
              {budget > 0 && (
                <>
                  <ProgressBar progress={progress} />
                  <div className="flex justify-between text-sm text-on-surface-secondary mt-1">
                    <span>{formatCurrency(spent, currency)} of {formatCurrency(budget, currency)}</span>
                    <span className={`${remaining < 0 ? 'text-red-500 font-semibold' : ''}`}>
                      {formatCurrency(remaining, currency)} {remaining >= 0 ? 'left' : 'over'}
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-end">
        {showSuccess && <span className="text-green-600 mr-4 transition-opacity">Budgets saved!</span>}
        <button
          onClick={handleSave}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
        >
          Save Budgets
        </button>
      </div>
    </div>
  );
};
