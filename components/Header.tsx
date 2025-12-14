
import React from 'react';
import { CURRENCIES } from '../constants';
import type { Currency } from '../types';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (value: Currency) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currency, onCurrencyChange, selectedMonth, onMonthChange }) => {
  // Parse selected month-year
  const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number);
  
  // Generate month options
  const months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' },
  ];

  // Generate year options (current year and past 10 years)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 10; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const handleMonthChange = (month: number) => {
    const newValue = `${selectedYear}-${String(month).padStart(2, '0')}`;
    onMonthChange(newValue);
  };

  const handleYearChange = (year: number) => {
    const newValue = `${year}-${String(selectedMonthNum).padStart(2, '0')}`;
    onMonthChange(newValue);
  };

  return (
    <header 
      className="bg-surface shadow-sm sticky top-0 z-40" 
      style={{ 
        paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)',
        marginTop: 'env(safe-area-inset-top, 0px)'
      }}
    >
      <div className="max-w-4xl mx-auto py-4 px-4 md:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            FinFlow
          </h1>
          <p className="text-sm text-on-surface-secondary">Your simple, beautiful money manager.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedMonthNum}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="py-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 appearance-none bg-white text-sm"
            aria-label="Select month"
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="py-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 appearance-none bg-white text-sm"
            aria-label="Select year"
          >
            {getYearOptions().map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            className="py-2 pl-3 pr-8 w-full sm:w-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 appearance-none bg-white text-sm"
            aria-label="Select currency"
          >
            {CURRENCIES.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
