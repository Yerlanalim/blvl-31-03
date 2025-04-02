import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../card';

describe('Card component', () => {
  it('renders the Card with children', () => {
    render(
      <Card data-testid="card">
        <div>Card Content</div>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveTextContent('Card Content');
  });

  it('renders CardHeader with custom className', () => {
    render(
      <CardHeader data-testid="card-header" className="custom-class">
        Header Content
      </CardHeader>
    );
    
    const header = screen.getByTestId('card-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('custom-class');
    expect(header).toHaveClass('flex flex-col space-y-1.5 p-6');
    expect(header).toHaveTextContent('Header Content');
  });

  it('renders CardTitle with proper styling', () => {
    render(
      <CardTitle data-testid="card-title">Card Title</CardTitle>
    );
    
    const title = screen.getByTestId('card-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveTextContent('Card Title');
  });

  it('renders CardDescription with proper styling', () => {
    render(
      <CardDescription data-testid="card-description">Card Description</CardDescription>
    );
    
    const description = screen.getByTestId('card-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm text-muted-foreground');
    expect(description).toHaveTextContent('Card Description');
  });

  it('renders CardContent with proper styling', () => {
    render(
      <CardContent data-testid="card-content">Content</CardContent>
    );
    
    const content = screen.getByTestId('card-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('p-6 pt-0');
    expect(content).toHaveTextContent('Content');
  });

  it('renders CardFooter with proper styling', () => {
    render(
      <CardFooter data-testid="card-footer">Footer</CardFooter>
    );
    
    const footer = screen.getByTestId('card-footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex items-center p-6 pt-0');
    expect(footer).toHaveTextContent('Footer');
  });

  it('renders a full card with all components', () => {
    render(
      <Card data-testid="full-card">
        <CardHeader>
          <CardTitle>Example Card</CardTitle>
          <CardDescription>This is a description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content of the card</p>
        </CardContent>
        <CardFooter>
          <p>Footer content</p>
        </CardFooter>
      </Card>
    );
    
    const card = screen.getByTestId('full-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Example Card');
    expect(card).toHaveTextContent('This is a description');
    expect(card).toHaveTextContent('This is the main content of the card');
    expect(card).toHaveTextContent('Footer content');
  });
}); 