import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction, Currency } from '../types';
import { TransactionType } from '../types';

interface IncomeExpenseChartProps {
  transactions: Transaction[];
  currency: Currency;
}

const formatYAxis = (tickItem: number, currency: Currency) => {
    // Format large numbers to K, M, etc. for cleaner axis labels
    if (tickItem >= 1000000) {
        return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tickItem / 1000000)}M`;
    }
    if (tickItem >= 1000) {
        return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tickItem / 1000)}K`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tickItem);
};

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ transactions, currency }) => {
  const chartData = useMemo(() => {
    const dataByMonth: Record<string, { month: string; income: number; expense: number }> = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      // Using 'short' month name for brevity (e.g., 'Jan', 'Feb')
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = { month: monthLabel, income: 0, expense: 0 };
      }

      if (t.type === TransactionType.INCOME) {
        dataByMonth[monthKey].income += t.amount;
      } else {
        dataByMonth[monthKey].expense += t.amount;
      }
    });

    // Sort by month key (chronologically) and return the values
    return Object.keys(dataByMonth)
      .sort()
      .map(key => dataByMonth[key]);
  }, [transactions]);

  if (chartData.length < 2) {
    return (
      <div className="bg-surface p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Income vs. Expense Trend</h3>
        <div className="h-72 flex items-center justify-center text-on-surface-secondary">
          <p>Add more transactions to see a monthly trend.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-on-surface mb-4">Income vs. Expense Trend</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(tick) => formatYAxis(tick, currency)} />
            <Tooltip
              formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)}
              labelStyle={{ fontWeight: 'bold' }}
              itemStyle={{ textTransform: 'capitalize' }}
              cursor={{ fill: 'rgba(249, 250, 251, 0.5)' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
