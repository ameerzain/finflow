import React from 'react';
import type { Currency } from '../types';
import { ProgressBar } from './ProgressBar';

interface BudgetSummaryCardProps {
  totalBudget: number;
  totalSpent: number;
  currency: Currency;
}

const formatCurrency = (amount: number, currency: Currency) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
}).format(amount);

export const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({ totalBudget, totalSpent, currency }) => {
  const progress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const remaining = totalBudget - totalSpent;

  return (
    <div className="bg-surface p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-on-surface mb-4">Monthly Budget Summary</h3>
      <div className="space-y-2">
        <ProgressBar progress={progress} />
        <div className="flex justify-between items-center text-on-surface-secondary">
          <span className="text-sm">Spent: <span className="font-semibold text-on-surface">{formatCurrency(totalSpent, currency)}</span></span>
          <span className="text-sm font-semibold">{formatCurrency(totalBudget, currency)}</span>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${remaining < 0 ? 'text-red-500' : 'text-secondary'}`}>
            {formatCurrency(remaining, currency)} {remaining >= 0 ? 'Remaining' : 'Overspent'}
          </p>
        </div>
      </div>
    </div>
  );
};
