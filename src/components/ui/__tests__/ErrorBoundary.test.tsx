import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';

// Component that always throws an error when rendered
const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  // Suppress React's error logging during tests
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders fallback UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Что-то пошло не так/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  it('allows retry after an error', async () => {
    const user = userEvent.setup();
    
    let shouldThrow = true;
    
    const ToggleError = () => {
      if (shouldThrow) {
        throw new Error('Toggle error');
      }
      return <div data-testid="no-error">No Error</div>;
    };
    
    render(
      <ErrorBoundary>
        <ToggleError />
      </ErrorBoundary>
    );
    
    // Error is shown
    expect(screen.getByText(/Что-то пошло не так/i)).toBeInTheDocument();
    
    // Change condition so component won't throw on retry
    shouldThrow = false;
    
    // Click retry
    await user.click(screen.getByText(/Попробовать снова/i));
    
    // Component should render without error now
    expect(screen.getByTestId('no-error')).toBeInTheDocument();
  });

  it('uses custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom error UI</div>;
    
    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Custom error UI/i)).toBeInTheDocument();
  });

  it('calls onError callback when an error occurs', () => {
    const handleError = vi.fn();
    
    render(
      <ErrorBoundary onError={handleError}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(handleError).toHaveBeenCalled();
  });
}); 