import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorFallback from '../ErrorFallback';

describe('ErrorFallback', () => {
  it('renders default error message when no props provided', () => {
    render(<ErrorFallback />);
    
    expect(screen.getByText('Произошла ошибка')).toBeInTheDocument();
    expect(screen.getByText('Что-то пошло не так при загрузке данных.')).toBeInTheDocument();
  });

  it('renders custom title and message when provided', () => {
    render(
      <ErrorFallback 
        title="Custom Error Title" 
        message="Custom error message for testing" 
      />
    );
    
    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    expect(screen.getByText('Custom error message for testing')).toBeInTheDocument();
  });

  it('renders error details in development mode', () => {
    // Save original env
    const originalNodeEnv = process.env.NODE_ENV;
    
    // Mock development environment
    vi.stubEnv('NODE_ENV', 'development');
    
    const testError = new Error('Test error message');
    render(<ErrorFallback error={testError} />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    
    // Restore original env
    vi.stubEnv('NODE_ENV', originalNodeEnv);
  });

  it('does not render error details in production mode', () => {
    // Save original env
    const originalNodeEnv = process.env.NODE_ENV;
    
    // Mock production environment
    vi.stubEnv('NODE_ENV', 'production');
    
    const testError = new Error('Test error message');
    const { container } = render(<ErrorFallback error={testError} />);
    
    // Check if error message element exists
    const errorMessageElement = container.querySelector('.whitespace-pre-wrap');
    expect(errorMessageElement).toBeNull();
    
    // Restore original env
    vi.stubEnv('NODE_ENV', originalNodeEnv);
  });

  it('calls retry function when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockRetry = vi.fn();
    
    render(<ErrorFallback retry={mockRetry} />);
    
    const retryButton = screen.getByText('Попробовать снова');
    await user.click(retryButton);
    
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('renders with correct severity styles', () => {
    const { container, rerender } = render(<ErrorFallback severity="error" />);
    expect(container.firstChild).toHaveClass('bg-red-50');
    
    rerender(<ErrorFallback severity="warning" />);
    expect(container.firstChild).toHaveClass('bg-amber-50');
    
    rerender(<ErrorFallback severity="info" />);
    expect(container.firstChild).toHaveClass('bg-blue-50');
  });

  it('does not render retry button when retry function is not provided', () => {
    render(<ErrorFallback />);
    
    const retryButton = screen.queryByText('Попробовать снова');
    expect(retryButton).not.toBeInTheDocument();
  });
}); 