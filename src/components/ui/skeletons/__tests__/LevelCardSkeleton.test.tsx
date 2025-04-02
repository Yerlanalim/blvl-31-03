import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LevelCardSkeleton from '../LevelCardSkeleton';

describe('LevelCardSkeleton', () => {
  it('renders skeleton elements', () => {
    const { container } = render(<LevelCardSkeleton />);
    
    // Check if skeleton elements are rendered
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
    
    // Check if card component is rendered (using shadcn class naming)
    expect(container.querySelector('[class*="card"]')).toBeInTheDocument();
    
    // Check content and footer areas with more flexible selectors
    expect(container.querySelector('[class*="card-content"]') || 
           container.querySelector('.p-4')).toBeInTheDocument();
    
    expect(container.querySelector('[class*="card-footer"]') || 
           container.querySelector('.p-4.pt-0')).toBeInTheDocument();
  });
}); 