/**
 * Utilities for standardizing form handling and validation
 */
import { z } from 'zod';
import { useForm, UseFormProps, FieldValues, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifyError } from '../notifications/notificationUtils';

/**
 * Create a hook for a form with Zod validation
 * @param schema Zod schema for form validation
 * @param options React Hook Form options
 * @returns React Hook Form methods with type safety
 */
export function createZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
) {
  type FormValues = z.infer<TSchema>;
  
  return function useZodForm(formOptions?: UseFormProps<FormValues>): UseFormReturn<FormValues> {
    return useForm<FormValues>({
      resolver: zodResolver(schema),
      ...options,
      ...formOptions,
    });
  };
}

/**
 * Common validation schemas for reuse across forms
 */
export const validationSchemas = {
  // Email validation
  email: z.string().email('Please enter a valid email address'),
  
  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  // Name validation
  name: z.string().min(2, 'Name must be at least 2 characters'),
  
  // Phone validation
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
  
  // URL validation
  url: z.string().url('Please enter a valid URL'),
  
  // Date validation
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date in YYYY-MM-DD format'),
  
  // Required field
  required: (fieldName: string = 'This field') => 
    z.string().min(1, `${fieldName} is required`),
  
  // Optional field that can be empty or must be valid
  optionalEmail: z.string().email('Please enter a valid email address').or(z.literal('')),
  
  // Number validation
  number: z.number().or(z.string().regex(/^\d+$/).transform(Number))
    .refine((n) => !isNaN(n), 'Please enter a valid number'),
  
  // Integer validation
  integer: z.number().int('Please enter a whole number').or(
    z.string().regex(/^\d+$/).transform(Number)
  ),
  
  // Positive number validation
  positiveNumber: z.number().positive('Please enter a positive number').or(
    z.string().regex(/^\d+$/).transform(Number)
      .refine((n) => n > 0, 'Please enter a positive number')
  )
};

/**
 * Helper for handling form submission errors
 */
export function handleFormError(error: unknown): void {
  const message = error instanceof Error 
    ? error.message 
    : 'An error occurred while submitting the form';
  
  notifyError(message);
  console.error('Form submission error:', error);
}

/**
 * Generic form submission handler
 * Provides error handling and loading state management
 */
export function createFormSubmitHandler<TFormData extends FieldValues>({
  onSubmit,
  onSuccess,
  onError = handleFormError,
}: {
  onSubmit: (data: TFormData) => Promise<any>;
  onSuccess?: (result: any, data: TFormData) => void;
  onError?: (error: unknown, data: TFormData) => void;
}) {
  return async (data: TFormData) => {
    try {
      const result = await onSubmit(data);
      if (onSuccess) {
        onSuccess(result, data);
      }
      return result;
    } catch (error) {
      if (onError) {
        onError(error, data);
      }
      throw error;
    }
  };
} 