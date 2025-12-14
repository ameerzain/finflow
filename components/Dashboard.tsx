import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction, Currency, Category, Budgets } from '../types';
import { TransactionType } from '../types';
import { SummaryCard } from './SummaryCard';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { BudgetGoalCard } from './BudgetGoalCard';
import { AddGoalCard } from './AddGoalCard';
import { BudgetSummaryCard } from './BudgetSummaryCard';

interface DashboardProps {
  transactions: Transaction[];
  currency: Currency;
  categories: Category[];
  budgets: Budgets;
  onAddGoal: () => void;
  onEditGoal: (category: Category) => void;
  onRemoveGoal: (categoryValue: string) => void;
}

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#FBBF24'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions, currency, categories, budgets, onAddGoal, onEditGoal, onRemoveGoal }) => {
  const getCategoryDisplay = (value: string) => {
    const category = categories.find(c => c.value === value);
    return category ? `${category.icon} ${category.label}` : value;
  };

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === TransactionType.INCOME) {
          acc.totalIncome += t.amount;
        } else {
          acc.totalExpenses += t.amount;
        }
        acc.balance = acc.totalIncome - acc.totalExpenses;
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, balance: 0 }
    );
  }, [transactions]);

  // Calculate expenses by category for the selected month (transactions are already filtered)
  const monthlyExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }, [transactions]);
  
  const budgetedCategories = useMemo(() => {
    return categories.filter(c => budgets[c.value] > 0 && c.type === TransactionType.EXPENSE);
  }, [categories, budgets]);
  
  const hasUnbudgetedCategories = useMemo(() => {
      const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);
      return expenseCategories.some(c => !(c.value in budgets) || budgets[c.value] === 0);
  }, [categories, budgets]);

  const { totalBudget, totalMonthlySpentOnBudgets } = useMemo(() => {
    const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
    
    const totalMonthlySpentOnBudgets = Object.keys(budgets).reduce((sum, categoryValue) => {
        return sum + (monthlyExpenses[categoryValue] || 0);
    }, 0);

    return { totalBudget, totalMonthlySpentOnBudgets };
  }, [budgets, monthlyExpenses]);


  // Expense breakdown for selected month (transactions are already filtered)
  const expenseData = useMemo(() => {
    const expenseByCategory = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expenseByCategory).map(([name, value]) => ({
      name: getCategoryDisplay(name),
      value,
    }));
  }, [transactions, categories]);

  return (
    <section className="space-y-8">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Total Income" amount={totalIncome} type="income" currency={currency} />
          <SummaryCard title="Total Expenses" amount={totalExpenses} type="expense" currency={currency} />
          <SummaryCard title="Balance" amount={balance} type="balance" currency={currency} />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-on-surface mb-4">Monthly Budget Goals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {budgetedCategories.map(category => (
            <BudgetGoalCard
              key={category.value}
              category={category}
              budget={budgets[category.value] || 0}
              spent={monthlyExpenses[category.value] || 0}
              currency={currency}
              onClick={onEditGoal}
              onRemove={onRemoveGoal}
            />
          ))}
          {hasUnbudgetedCategories && <AddGoalCard onClick={onAddGoal} />}
        </div>
      </div>
      
      {totalBudget > 0 && (
        <BudgetSummaryCard
          totalBudget={totalBudget}
          totalSpent={totalMonthlySpentOnBudgets}
          currency={currency}
        />
      )}

      <div className="bg-surface p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Expense Breakdown</h3>
        {expenseData.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-on-surface-secondary">
            <p>No expense data to display.</p>
          </div>
        )}
      </div>

      <IncomeExpenseChart transactions={transactions} currency={currency} />
      
    </section>
  );
};
