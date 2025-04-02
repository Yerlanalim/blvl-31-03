import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButtonLoading } from '../button-loading';

describe('ButtonLoading', () => {
  it('renders children when not loading', () => {
    render(<ButtonLoading>Click Me</ButtonLoading>);
    
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders loading text when isLoading is true', () => {
    render(<ButtonLoading isLoading>Click Me</ButtonLoading>);
    
    expect(screen.getByText('Click Me')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders custom loading text when provided', () => {
    render(
      <ButtonLoading isLoading loadingText="Loading...">
        Click Me
      </ButtonLoading>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Click Me')).not.toBeInTheDocument();
  });

  it('renders spinner icon when loading', () => {
    const { container } = render(<ButtonLoading isLoading>Click Me</ButtonLoading>);
    
    const spinnerIcon = container.querySelector('.animate-spin');
    expect(spinnerIcon).toBeInTheDocument();
  });

  it('is disabled when isLoading is true', () => {
    render(<ButtonLoading isLoading>Click Me</ButtonLoading>);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<ButtonLoading disabled>Click Me</ButtonLoading>);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('passes additional props to the button', () => {
    render(
      <ButtonLoading 
        data-testid="test-button" 
        className="test-class"
      >
        Click Me
      </ButtonLoading>
    );
    
    const button = screen.getByTestId('test-button');
    expect(button).toHaveClass('test-class');
  });
}); 