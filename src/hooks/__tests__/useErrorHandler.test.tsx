import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorProvider } from '@/context/ErrorContext';
import { useErrorHandler } from '../useErrorHandler';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    success: vi.fn(),
  },
}));

// Test component that uses the hook
const TestComponent = ({ 
  throwError = false, 
  errorMessage = 'Test error',
  customMessage = '',
  severity = 'error' as const,
  testAsync = false,
}) => {
  const { handleError, withErrorHandling } = useErrorHandler();
  
  const handleClick = () => {
    if (throwError) {
      const error = new Error(errorMessage);
      handleError(error, customMessage || undefined, severity);
    }
  };
  
  const handleAsyncClick = async () => {
    try {
      await (async () => {
        if (throwError) {
          throw new Error(errorMessage);
        }
        return 'success';
      })();
    } catch (error) {
      handleError(error, customMessage || undefined, severity);
    }
  };
  
  const wrappedFunction = withErrorHandling(
    async () => {
      if (throwError) {
        throw new Error(errorMessage);
      }
      return 'success';
    },
    customMessage || undefined,
    severity
  );
  
  return (
    <div>
      <button onClick={handleClick} data-testid="error-button">
        Trigger Error
      </button>
      <button onClick={handleAsyncClick} data-testid="async-error-button">
        Trigger Async Error
      </button>
      <button 
        onClick={() => wrappedFunction()} 
        data-testid="wrapped-error-button"
      >
        Trigger Wrapped Error
      </button>
    </div>
  );
};

// Wrapper component
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorProvider>{children}</ErrorProvider>
);

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('handles errors when handleError is called', async () => {
    const user = userEvent.setup();
    
    render(
      <TestComponent throwError={true} errorMessage="Test error message" />,
      { wrapper: Wrapper }
    );
    
    await user.click(screen.getByTestId('error-button'));
    
    expect(toast.error).toHaveBeenCalledWith('Test error message');
  });
  
  it('uses custom message when provided', async () => {
    const user = userEvent.setup();
    
    render(
      <TestComponent 
        throwError={true} 
        errorMessage="Original error" 
        customMessage="Custom error message" 
      />,
      { wrapper: Wrapper }
    );
    
    await user.click(screen.getByTestId('error-button'));
    
    expect(toast.error).toHaveBeenCalledWith('Custom error message');
  });
  
  it('handles different severity levels', async () => {
    const user = userEvent.setup();
    
    render(
      <TestComponent 
        throwError={true} 
        severity="warning" 
      />,
      { wrapper: Wrapper }
    );
    
    await user.click(screen.getByTestId('error-button'));
    
    expect(toast.warning).toHaveBeenCalled();
  });
  
  it('handles async function errors', async () => {
    const user = userEvent.setup();
    
    render(
      <TestComponent throwError={true} />,
      { wrapper: Wrapper }
    );
    
    await user.click(screen.getByTestId('async-error-button'));
    
    expect(toast.error).toHaveBeenCalled();
  });
  
  it('wraps functions with error handling', async () => {
    const user = userEvent.setup();
    
    render(
      <TestComponent throwError={true} />,
      { wrapper: Wrapper }
    );
    
    await user.click(screen.getByTestId('wrapped-error-button'));
    
    expect(toast.error).toHaveBeenCalled();
  });
}); 