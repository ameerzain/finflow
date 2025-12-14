import React from 'react';
import type { Category, Transaction } from '../types';
import { TransactionType } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MergeIcon } from './icons/MergeIcon';

interface CategoriesProps {
  categories: Category[];
  transactions: Transaction[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryValue: string) => void;
  onOpenMergeCategoryModal: () => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  transactions,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onOpenMergeCategoryModal,
}) => {
  const incomeCategories = categories.filter(c => c.type === TransactionType.INCOME);
  const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);

  const isCategoryInUse = (categoryValue: string) => {
    return transactions.some(t => t.category === categoryValue);
  };

  const CategoryList: React.FC<{ title: string; list: Category[] }> = ({ title, list }) => (
    <div>
      <h4 className="text-md font-semibold text-on-surface mb-2">{title}</h4>
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
        {list.map(cat => {
          const inUse = isCategoryInUse(cat.value);
          const isDefault = !!cat.isDefault;
          const isDisabled = isDefault || inUse;

          const handleDeleteClick = () => {
            // This handler is only reachable if the button is not disabled.
            if (window.confirm(`Are you sure you want to delete the category "${cat.label}"?`)) {
              onDeleteCategory(cat.value);
            }
          };

          const tooltip = isDefault
            ? 'Cannot delete a default category.'
            : inUse
            ? 'This category is in use. Merge it before deleting to reassign its transactions.'
            : `Delete category ${cat.label}`;
          
          const colorClass = isDefault
            ? 'text-gray-300'
            : inUse
            ? 'text-yellow-500' // Yellow if disabled because it's in use
            : 'text-gray-500 hover:text-red-500';

          return (
            <li key={cat.value} className="px-4 py-3 flex items-center justify-between">
              <span className="font-medium">
                {cat.icon} {cat.label}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditCategory(cat)}
                  className="p-2 text-gray-500 hover:text-primary transition-colors"
                  aria-label={`Edit category ${cat.label}`}
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className={`p-2 transition-colors ${colorClass} ${isDisabled ? 'cursor-not-allowed' : ''}`}
                  aria-label={tooltip}
                  title={tooltip}
                  disabled={isDisabled}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <section className="bg-surface p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-lg font-semibold text-on-surface">Edit Categories</h3>
            <p className="mt-1 text-sm text-on-surface-secondary">
                Add, edit, delete, or merge your custom income and expense categories.
            </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
           <button
            onClick={onOpenMergeCategoryModal}
            className="flex items-center gap-2 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all"
            >
            <MergeIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Merge</span>
          </button>
          <button
            onClick={onAddCategory}
            className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Add Category</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryList title="Expense Categories" list={expenseCategories} />
        <CategoryList title="Income Categories" list={incomeCategories} />
      </div>
    </section>
  );
};