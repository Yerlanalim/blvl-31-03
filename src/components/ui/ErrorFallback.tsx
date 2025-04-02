'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';

export interface ErrorFallbackProps {
  title?: string;
  message?: string;
  error?: Error | null;
  retry?: () => void;
  severity?: 'error' | 'warning' | 'info';
  className?: string;
}

/**
 * A component to display an error with optional retry functionality
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title,
  message,
  error,
  retry,
  severity = 'error',
  className = '',
}) => {
  // Set defaults based on severity
  const defaultTitle = {
    error: 'Произошла ошибка',
    warning: 'Внимание',
    info: 'Информация',
  }[severity];

  const defaultMessage = {
    error: 'Что-то пошло не так при загрузке данных.',
    warning: 'Возникла проблема при выполнении операции.',
    info: 'Обратите внимание на следующую информацию.',
  }[severity];

  // Color classes based on severity
  const colorClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }[severity];

  // Icon based on severity
  const Icon = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }[severity];

  return (
    <div className={`p-4 border rounded-md ${colorClasses} ${className}`}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-medium">{title || defaultTitle}</h3>
          <p className="mt-1">{message || defaultMessage}</p>
          
          {error && process.env.NODE_ENV === 'development' && (
            <div className="mt-2 p-2 bg-white/50 rounded text-sm overflow-auto max-h-[200px]">
              <pre className="whitespace-pre-wrap">{error.message}</pre>
              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Stack Trace</summary>
                  <pre className="whitespace-pre-wrap mt-2 text-xs opacity-75">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}
          
          {retry && (
            <button
              onClick={retry}
              className={`mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md 
                ${severity === 'error' ? 'bg-red-100 hover:bg-red-200 text-red-800' : 
                  severity === 'warning' ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' : 
                  'bg-blue-100 hover:bg-blue-200 text-blue-800'
                } transition-colors`}
            >
              <RefreshCw className="mr-1.5 h-4 w-4" /> Попробовать снова
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback; 