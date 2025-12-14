import React, { useState, useCallback, useMemo } from 'react';
import { TransactionModal } from '../components/transactions/AddTransactionModal';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Header } from '../components/common/Header';
import { TransactionList } from '../components/transactions/TransactionList';
import { PlusIcon } from '../components/ui/icons/PlusIcon';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Transaction, Budgets, Currency, Category, BackupData } from '../types';
import { INITIAL_TRANSACTIONS, DEFAULT_CATEGORIES } from '../constants';
import { Tabs } from '../components/common/Tabs';
import { CategoryModal } from '../components/categories/CategoryModal';
import { Settings } from '../components/settings/Settings';
import { MergeCategoryModal } from '../components/categories/MergeCategoryModal';
import { BudgetGoalModal } from '../components/budget/BudgetGoalModal';

type Tab = 'dashboard' | 'transactions' | 'settings';
export type SortKey = 'none' | 'date' | 'amount' | 'category';
export type SortOrder = 'asc' | 'desc';
export type TransactionTypeFilter = 'all' | 'income' | 'expense';

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', INITIAL_TRANSACTIONS);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useLocalStorage<Budgets>('budgets', {});
  
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  
  const [isMergeCategoryModalOpen, setIsMergeCategoryModalOpen] = useState(false);
  const [isBudgetGoalModalOpen, setIsBudgetGoalModalOpen] = useState(false);
  const [categoryForBudgetEdit, setCategoryForBudgetEdit] = useState<Category | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState<TransactionTypeFilter>('all');
  const [currency, setCurrency] = useLocalStorage<Currency>('currency', 'INR');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Month-Year selector state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });
  
  const [sortKey, setSortKey] = useState<SortKey>('none');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSaveTransaction = useCallback((transactionData: Omit<Transaction, 'id'> | Transaction) => {
    if ('id' in transactionData) {
      setTransactions(prev => prev.map(t => t.id === transactionData.id ? transactionData : t));
    } else {
      setTransactions(prev => [...prev, { ...transactionData, id: Date.now() }]);
    }
    setIsTransactionModalOpen(false);
  }, [setTransactions]);

  const deleteTransaction = useCallback((id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [setTransactions]);

  const handleOpenAddTransactionModal = () => {
    setTransactionToEdit(null);
    setIsTransactionModalOpen(true);
  };

  const handleOpenEditTransactionModal = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleSaveCategory = useCallback((categoryData: Omit<Category, 'value'> | Category) => {
    if ('value' in categoryData) {
      // Update
      setCategories(prev => prev.map(c => c.value === categoryData.value ? categoryData : c));
    } else {
      // Add
      const newCategory = { ...categoryData, value: `custom-${Date.now()}` };
      setCategories(prev => [...prev, newCategory]);
    }
    setIsCategoryModalOpen(false);
  }, [setCategories]);

  const handleDeleteCategory = useCallback((categoryValue: string) => {
    // Also remove any budget set for this category
    setBudgets(prev => {
      const newBudgets = { ...prev };
      delete newBudgets[categoryValue];
      return newBudgets;
    });
    setCategories(prev => prev.filter(c => c.value !== categoryValue));
  }, [setCategories, setBudgets]);
  
  const handleOpenAddCategoryModal = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (category: Category) => {
    setCategoryToEdit(category);
    setIsCategoryModalOpen(true);
  };
  
  const handleSaveBudgets = useCallback((newBudgets: Budgets) => {
    setBudgets(newBudgets);
    setIsBudgetGoalModalOpen(false);
  }, [setBudgets]);
  
  const handleRemoveBudgetGoal = useCallback((categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    if (window.confirm(`Are you sure you want to remove the budget for "${category?.label || 'this category'}"?`)) {
      setBudgets(prev => {
        const newBudgets = { ...prev };
        delete newBudgets[categoryValue];
        return newBudgets;
      });
    }
  }, [setBudgets, categories]);

  const handleMergeCategories = useCallback((fromValue: string, toValue: string) => {
    // 1. Re-assign transactions
    setTransactions(prev => prev.map(t => {
      if (t.category === fromValue) {
        return { ...t, category: toValue };
      }
      return t;
    }));

    // 2. Delete the 'from' category
    setCategories(prev => prev.filter(c => c.value !== fromValue));

    // 3. Delete any budget associated with the 'from' category
    setBudgets(prev => {
      const newBudgets = { ...prev };
      delete newBudgets[fromValue];
      return newBudgets;
    });

    setIsMergeCategoryModalOpen(false);
  }, [setTransactions, setCategories, setBudgets]);
  
  const handleOpenAddBudgetGoalModal = () => {
    setCategoryForBudgetEdit(null);
    setIsBudgetGoalModalOpen(true);
  };

  const handleOpenEditBudgetGoalModal = (category: Category) => {
    setCategoryForBudgetEdit(category);
    setIsBudgetGoalModalOpen(true);
  };

  const handleCloseBudgetGoalModal = () => {
    setIsBudgetGoalModalOpen(false);
    setCategoryForBudgetEdit(null);
  }

  // Filter transactions by selected month
  const transactionsForSelectedMonth = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() + 1 === month;
    });
  }, [transactions, selectedMonth]);

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactionsForSelectedMonth.filter(t => {
      const searchMatch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = !selectedCategory || t.category === selectedCategory;
      const typeMatch = selectedType === 'all' || t.type === selectedType;
      return searchMatch && categoryMatch && typeMatch;
    });
    
    if (sortKey === 'none') {
      // Default sort: newest transactions first, based on their creation ID.
      return [...filtered].sort((a, b) => b.id - a.id);
    }
    
    const categoryMap = new Map(categories.map(c => [c.value, c.label]));

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
          case 'date':
              comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
              break;
          case 'amount':
              comparison = a.amount - b.amount;
              break;
          case 'category':
              const categoryA = categoryMap.get(a.category) || a.category;
              const categoryB = categoryMap.get(b.category) || b.category;
              comparison = categoryA.localeCompare(categoryB);
              break;
      }
      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });

    return sorted;
  }, [transactionsForSelectedMonth, searchTerm, selectedCategory, selectedType, sortKey, sortOrder, categories]);
  
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('all');
    setSortKey('none');
    setSortOrder('desc');
  }, []);

  const handleRestoreData = useCallback((data: BackupData) => {
    setTransactions(data.transactions);
    setCategories(data.categories);
    setBudgets(data.budgets);
    setCurrency(data.currency);
  }, [setTransactions, setCategories, setBudgets, setCurrency]);

  const handleResetData = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCategories(DEFAULT_CATEGORIES);
    setBudgets({});
  }, [setTransactions, setCategories, setBudgets]);

  return (
    <div 
      className="min-h-screen bg-gray-50 text-on-surface font-sans" 
      style={{ 
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1rem)',
        minHeight: '100dvh'
      }}
    >
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />
      
      <main className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              transactions={transactionsForSelectedMonth}
              currency={currency}
              categories={categories}
              budgets={budgets}
              onAddGoal={handleOpenAddBudgetGoalModal}
              onEditGoal={handleOpenEditBudgetGoalModal}
              onRemoveGoal={handleRemoveBudgetGoal}
            />
          )}
          {activeTab === 'transactions' && (
            <TransactionList
              transactions={filteredAndSortedTransactions}
              onDeleteTransaction={deleteTransaction}
              onEditTransaction={handleOpenEditTransactionModal}
              currency={currency}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              categories={categories}
              sortKey={sortKey}
              onSortKeyChange={setSortKey}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              onResetFilters={handleResetFilters}
            />
          )}
          {activeTab === 'settings' && (
             <Settings
                // Budget Props
                transactions={transactions}
                budgets={budgets}
                onSaveBudgets={handleSaveBudgets}
                currency={currency}
                // Category Props
                categories={categories}
                onAddCategory={handleOpenAddCategoryModal}
                onEditCategory={handleOpenEditCategoryModal}
                onDeleteCategory={handleDeleteCategory}
                onOpenMergeCategoryModal={() => setIsMergeCategoryModalOpen(true)}
                // Backup Props
                backupData={{ transactions, categories, budgets, currency }}
                onRestoreData={handleRestoreData}
                onResetData={handleResetData}
              />
          )}
        </div>
      </main>
      
      <button
        onClick={handleOpenAddTransactionModal}
        className="fixed bottom-6 right-6 bg-primary hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
        style={{ 
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
          right: 'calc(1.5rem + env(safe-area-inset-right))'
        }}
        aria-label="Add new transaction"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
        transactionToEdit={transactionToEdit}
        categories={categories}
      />
      
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        categoryToEdit={categoryToEdit}
      />

      <MergeCategoryModal
        isOpen={isMergeCategoryModalOpen}
        onClose={() => setIsMergeCategoryModalOpen(false)}
        onMerge={handleMergeCategories}
        categories={categories}
      />
      <BudgetGoalModal
        isOpen={isBudgetGoalModalOpen}
        onClose={handleCloseBudgetGoalModal}
        onSave={handleSaveBudgets}
        categories={categories}
        budgets={budgets}
        categoryToEdit={categoryForBudgetEdit}
      />
    </div>
  );
};

export default App;
