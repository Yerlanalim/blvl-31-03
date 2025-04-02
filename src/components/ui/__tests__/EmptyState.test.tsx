import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from '../EmptyState';
import { FolderOpen, FilePlus, Search, AlertCircle, Info } from 'lucide-react';

describe('EmptyState', () => {
  it('renders default title and message when no props provided', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('Нет данных')).toBeInTheDocument();
    expect(screen.getByText('Здесь пока ничего нет')).toBeInTheDocument();
  });

  it('renders custom title and message when provided', () => {
    render(
      <EmptyState 
        title="Custom Empty Title" 
        message="Custom empty state message for testing" 
      />
    );
    
    expect(screen.getByText('Custom Empty Title')).toBeInTheDocument();
    expect(screen.getByText('Custom empty state message for testing')).toBeInTheDocument();
  });

  it('renders different icons based on icon prop', () => {
    const { container, rerender } = render(<EmptyState icon="folder" />);
    
    // Test different icon types
    rerender(<EmptyState icon="file" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    
    rerender(<EmptyState icon="search" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    
    rerender(<EmptyState icon="alert" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    
    rerender(<EmptyState icon="info" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders custom icon when provided as a node', () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;
    
    render(<EmptyState icon={<CustomIcon />} />);
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('calls action onClick when action button is clicked', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn();
    
    render(
      <EmptyState 
        action={{
          label: 'Test Action',
          onClick: mockAction
        }}
      />
    );
    
    const actionButton = screen.getByText('Test Action');
    await user.click(actionButton);
    
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when action is not provided', () => {
    const { container } = render(<EmptyState />);
    
    const actionButtons = container.querySelectorAll('button');
    expect(actionButtons.length).toBe(0);
  });

  it('applies custom className when provided', () => {
    const { container } = render(<EmptyState className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
}); 