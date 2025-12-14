import { TransactionType } from '../types';
import type { Category, Transaction, Currency } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Expenses
  { value: 'food', label: 'Food', icon: '🍔', type: TransactionType.EXPENSE, isDefault: true },
  { value: 'transport', label: 'Transport', icon: '🚗', type: TransactionType.EXPENSE, isDefault: true },
  { value: 'housing', label: 'Housing', icon: '🏠', type: TransactionType.EXPENSE, isDefault: true },
  { value: 'utilities', label: 'Utilities', icon: '💡', type: TransactionType.EXPENSE, isDefault: true },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬', type: TransactionType.EXPENSE, isDefault: true },
  { value: 'health', label: 'Health', icon: '❤️', type: TransactionType.EXPENSE, isDefault: true },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', type: TransactionType.EXPENSE, isDefault: true },
  { value: 'other_expense', label: 'Other', icon: '💸', type: TransactionType.EXPENSE, isDefault: true },
  
  // Income
  { value: 'salary', label: 'Salary', icon: '💼', type: TransactionType.INCOME, isDefault: true },
  { value: 'freelance', label: 'Freelance', icon: '🧑‍💻', type: TransactionType.INCOME, isDefault: true },
  { value: 'investment', label: 'Investment', icon: '📈', type: TransactionType.INCOME, isDefault: true },
  { value: 'gift', label: 'Gift', icon: '🎁', type: TransactionType.INCOME, isDefault: true },
  { value: 'other_income', label: 'Other', icon: '💰', type: TransactionType.INCOME, isDefault: true },
];

export const ICON_OPTIONS: string[] = [
  '🍔', '🚗', '🏠', '💡', '🎬', '❤️', '🛍️', '💸', '💼', '🧑‍💻', '📈', '🎁', '💰',
  '✈️', '🛒', '💊', '🎓', '🐶', '🎨', '📱', '💻', '👕', '👠', '🍸', '🎵', '🏋️', '📚'
];


export const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'INR', label: '🇮🇳 INR' },
  { value: 'USD', label: '🇺🇸 USD' },
  { value: 'EUR', label: '🇪🇺 EUR' },
  { value: 'AED', label: '🇦🇪 AED' },
];

// Production: Empty initial transactions - users will start with a clean slate
export const INITIAL_TRANSACTIONS: Transaction[] = [];