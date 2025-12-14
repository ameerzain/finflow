import React from 'react';
import { PlusCircleIcon } from '../ui/icons/PlusCircleIcon';

interface AddGoalCardProps {
  onClick: () => void;
}

export const AddGoalCard: React.FC<AddGoalCardProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-surface p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-blue-50 transition-all h-full flex flex-col items-center justify-center text-on-surface-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <PlusCircleIcon className="w-8 h-8 mb-2" />
      <span className="font-semibold text-sm">Add Monthly Goal</span>
    </button>
  );
};