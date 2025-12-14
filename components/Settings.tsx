import React, { useRef, useState } from 'react';
import type { BackupData, Transaction, Budgets, Currency, Category } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { UploadIcon } from './icons/UploadIcon';
import { ResetIcon } from './icons/ResetIcon';
import { WalletIcon } from './icons/WalletIcon';
import { TagIcon } from './icons/TagIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { BudgetTracker } from './BudgetTracker';
import { Categories } from './Categories';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface SettingsProps {
  // Budget Props
  transactions: Transaction[];
  budgets: Budgets;
  onSaveBudgets: (budgets: Budgets) => void;
  currency: Currency;
  // Category Props
  categories: Category[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryValue: string) => void;
  onOpenMergeCategoryModal: () => void;
  // Backup Props
  backupData: BackupData;
  onRestoreData: (data: BackupData) => void;
  onResetData: () => void;
}

type SettingsView = 'main' | 'budgets' | 'categories';

export const Settings: React.FC<SettingsProps> = ({ 
    transactions,
    budgets,
    onSaveBudgets,
    currency,
    categories,
    onAddCategory,
    onEditCategory,
    onDeleteCategory,
    onOpenMergeCategoryModal,
    backupData, 
    onRestoreData,
    onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settingsView, setSettingsView] = useState<SettingsView>('main');

  const handleDownloadBackup = () => {
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.download = `finflow_backup_${date}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm("Are you sure you want to import this backup? This will overwrite all your current data.")) {
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        
        if (data && Array.isArray(data.transactions) && Array.isArray(data.categories) && typeof data.budgets === 'object' && typeof data.currency === 'string') {
          onRestoreData(data as BackupData);
          alert('Backup restored successfully!');
        } else {
          throw new Error('Invalid backup file format.');
        }
      } catch (error) {
        // Log error in development only
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to import backup:', error);
        }
        alert('Failed to import backup. The file may be corrupted or in the wrong format.');
      } finally {
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const confirmationMessage = "Are you absolutely sure?\n\nThis action will delete all your transactions, custom categories, and budgets, resetting the app to its default state. This cannot be undone.";
    if (window.confirm(confirmationMessage)) {
      onResetData();
      alert("Application data has been successfully reset.");
    }
  };
  
  const BackButton: React.FC<{ title: string; onViewChange: () => void }> = ({ title, onViewChange }) => (
    <div className="mb-6">
        <button
            onClick={onViewChange}
            className="flex items-center gap-2 text-sm font-semibold text-on-surface-secondary hover:text-primary transition-colors"
        >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Settings
        </button>
        <h2 className="text-xl font-semibold text-on-surface mt-2">{title}</h2>
    </div>
  );

  if (settingsView === 'budgets') {
      return (
        <section>
            <BackButton title="Manage Budgets" onViewChange={() => setSettingsView('main')} />
            <BudgetTracker 
                transactions={transactions}
                budgets={budgets}
                onSaveBudgets={onSaveBudgets}
                currency={currency}
                categories={categories}
            />
        </section>
      )
  }

  if (settingsView === 'categories') {
    return (
      <section>
          <BackButton title="Manage Categories" onViewChange={() => setSettingsView('main')} />
          <Categories
            categories={categories}
            transactions={transactions}
            onAddCategory={onAddCategory}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onOpenMergeCategoryModal={onOpenMergeCategoryModal}
          />
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <h2 className="text-xl font-semibold text-on-surface">Settings</h2>
      
      <div className="bg-surface rounded-xl shadow overflow-hidden">
        <div className="p-6">
            <h3 className="text-lg font-semibold text-on-surface">General Settings</h3>
            <p className="mt-1 text-sm text-on-surface-secondary">
            Manage your budgets and categories to customize your tracking experience.
            </p>
        </div>
        <div className="border-t border-gray-200">
            <button
                onClick={() => setSettingsView('budgets')}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-on-surface hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <WalletIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <span className="font-semibold">Manage Budgets</span>
                        <p className="text-sm text-on-surface-secondary">Set and track your spending goals.</p>
                    </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
            <button
                onClick={() => setSettingsView('categories')}
                className="w-full flex items-center justify-between px-6 py-4 border-t border-gray-200 text-left text-on-surface hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                        <TagIcon className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                        <span className="font-semibold">Manage Categories</span>
                        <p className="text-sm text-on-surface-secondary">Organize your income and expenses.</p>
                    </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-on-surface">Backup & Restore</h3>
        <p className="mt-1 text-sm text-on-surface-secondary">
          Save all your data (transactions, categories, budgets) to a file on your device. You can use this file to restore your data on any device.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownloadBackup}
            className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-primary text-sm font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
          >
            <DownloadIcon className="w-5 h-5" />
            Download Backup
          </button>
          <button
            onClick={handleImportClick}
            className="flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-secondary text-sm font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all"
          >
            <UploadIcon className="w-5 h-5" />
            Import Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
        </div>
      </div>

      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-red-800">Danger Zone</h3>
        <p className="mt-1 text-sm text-red-600">
          This action is irreversible. Resetting will permanently delete all your data and restore the application to its original state.
        </p>
        <div className="mt-6">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
            >
              <ResetIcon className="w-5 h-5" />
              Reset All Data
            </button>
        </div>
      </div>
    </section>
  );
};