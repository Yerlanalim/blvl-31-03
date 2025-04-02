import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../form';
import { Input } from '../input';

// Создаем тестовый компонент с формой
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

function TestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  return (
    <Form {...form}>
      <form data-testid="test-form">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} data-testid="username-input" />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

describe('Form component', () => {
  it('renders a form with all components', () => {
    render(<TestForm />);
    
    const form = screen.getByTestId('test-form');
    expect(form).toBeInTheDocument();
    
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    
    const input = screen.getByTestId('username-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'johndoe');
    
    const description = screen.getByText('This is your public display name.');
    expect(description).toBeInTheDocument();
  });

  it('applies correct styling to form components', () => {
    render(<TestForm />);
    
    // FormLabel styling
    const label = screen.getByText('Username');
    expect(label).toHaveAttribute('for'); // Should have a for attribute connected to the input
    
    // FormDescription styling
    const description = screen.getByText('This is your public display name.');
    expect(description).toHaveClass('text-sm');
    expect(description).toHaveClass('text-muted-foreground');
  });

  it('does not display FormMessage when there is no error', () => {
    render(<TestForm />);
    
    // Поскольку ошибки нет, FormMessage не должен отображаться
    const errorMessages = screen.queryByText('Username must be at least 2 characters.');
    expect(errorMessages).not.toBeInTheDocument();
  });
}); 