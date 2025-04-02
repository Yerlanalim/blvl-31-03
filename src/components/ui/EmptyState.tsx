'use client';

import React from 'react';
import { FolderOpen, FilePlus, Search, AlertCircle, Info } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: 'folder' | 'file' | 'search' | 'alert' | 'info' | React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * A component to display an empty state with an optional action button
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Нет данных',
  message = 'Здесь пока ничего нет',
  icon = 'folder',
  action,
  className = '',
}) => {
  // Determine which icon to use
  let IconComponent: React.ReactNode;
  
  if (typeof icon === 'string') {
    switch (icon) {
      case 'folder':
        IconComponent = <FolderOpen className="h-12 w-12 text-gray-400" />;
        break;
      case 'file':
        IconComponent = <FilePlus className="h-12 w-12 text-gray-400" />;
        break;
      case 'search':
        IconComponent = <Search className="h-12 w-12 text-gray-400" />;
        break;
      case 'alert':
        IconComponent = <AlertCircle className="h-12 w-12 text-gray-400" />;
        break;
      case 'info':
        IconComponent = <Info className="h-12 w-12 text-gray-400" />;
        break;
      default:
        IconComponent = <FolderOpen className="h-12 w-12 text-gray-400" />;
    }
  } else {
    IconComponent = icon;
  }

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="flex justify-center mb-4">
        {IconComponent}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
        {message}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState; 