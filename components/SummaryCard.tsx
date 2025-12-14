
import React from 'react';
import type { Currency } from '../types';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  currency: Currency;
}

const typeClasses = {
  income: 'text-secondary',
  expense: 'text-red-500',
  balance: 'text-primary',
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type, currency }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);

  return (
    <div className="bg-surface p-6 rounded-xl shadow transition-all hover:shadow-md">
      <h3 className="text-sm font-medium text-on-surface-secondary mb-1">{title}</h3>
      <p className={`text-3xl font-bold ${typeClasses[type]}`}>{formattedAmount}</p>
    </div>
  );
};
