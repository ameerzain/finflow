
import React from 'react';

interface ProgressBarProps {
  progress: number; // A value from 0 to 100+
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Clamp progress at 100% for visual representation, but color depends on original value.
  const clampedProgress = Math.min(progress, 100);

  let colorClass = 'bg-secondary'; // Green for under budget
  if (progress > 100) {
    colorClass = 'bg-red-500'; // Red for over budget
  } else if (progress >= 75) {
    colorClass = 'bg-yellow-500'; // Yellow for approaching budget
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  );
};
