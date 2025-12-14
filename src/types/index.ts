
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: number;
  type: TransactionType;
  category: string; // This will now be the 'value' of the Category
  amount: number;
  date: string;
  description: string;
}

export interface Category {
  value: string;
  label: string;
  type: TransactionType;
  icon: string;
  isDefault?: boolean;
}

export type Budgets = Record<string, number>;

export type Currency = 'USD' | 'INR' | 'EUR' | 'AED';

export interface BackupData {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budgets;
  currency: Currency;
}
