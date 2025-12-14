import React from 'react';
import type { Category, Currency } from '../types';
import { ProgressBar } from './ProgressBar';
import { XIcon } from './icons/XIcon';

interface BudgetGoalCardProps {
  category: Category;
  budget: number;
  spent: number;
  currency: Currency;
  onClick: (category: Category) => void;
  onRemove: (categoryValue: string) => void;
}

const formatCurrency = (amount: number, currency: Currency) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
}).format(amount);

export const BudgetGoalCard: React.FC<BudgetGoalCardProps> = ({ category, budget, spent, currency, onClick, onRemove }) => {
  const progress = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = budget - spent;

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent edit modal from opening
    onRemove(category.value);
  };

  return (
    <div
      onClick={() => onClick(category)}
      className="bg-surface p-4 rounded-xl shadow transition-all hover:shadow-md h-full flex flex-col justify-between text-left w-full focus:outline-none focus:ring-2 focus:ring-primary relative group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(category); }}
    >
      <button
        onClick={handleRemoveClick}
        className="absolute top-1 right-1 z-10 p-1.5 text-gray-400 hover:text-red-600 bg-white/50 hover:bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
        aria-label={`Remove budget for ${category.label}`}
      >
        <XIcon className="w-3.5 h-3.5" />
      </button>

      <div>
        <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{category.icon}</span>
            <h4 className="font-semibold text-on-surface truncate pr-4">{category.label}</h4>
        </div>
        <ProgressBar progress={progress} />
        <div className="flex justify-between text-xs text-on-surface-secondary mt-1">
          <span>{formatCurrency(spent, currency)}</span>
          <span>{formatCurrency(budget, currency)}</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className={`text-sm font-semibold ${remaining < 0 ? 'text-red-500' : 'text-on-surface-secondary'}`}>
            {formatCurrency(Math.abs(remaining), currency)} {remaining >= 0 ? 'left' : 'over'}
        </p>
      </div>
    </div>
  );
};
