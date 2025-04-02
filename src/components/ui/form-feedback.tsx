'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  description?: string;
  showValidationStatus?: boolean;
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  description?: string;
  showValidationStatus?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, label, description, showValidationStatus = true, className, ...props }, ref) => {
    const form = useFormContext();
    const [isFocused, setIsFocused] = useState(false);
    const fieldState = form?.getFieldState(name, form.formState);

    const isValid = fieldState?.isDirty && !fieldState?.invalid;
    const isInvalid = fieldState?.invalid && fieldState?.isTouched;

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  {...props}
                  ref={ref}
                  onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                  }}
                  onBlur={(e) => {
                    setIsFocused(false);
                    field.onBlur();
                    props.onBlur?.(e);
                  }}
                  className={cn(
                    {
                      "pr-10": showValidationStatus && (isValid || isInvalid),
                      "border-green-400 focus-visible:ring-green-400/20": showValidationStatus && isValid,
                      "border-red-400 focus-visible:ring-red-400/20": showValidationStatus && isInvalid,
                    },
                    className
                  )}
                />
                {showValidationStatus && isValid && !isFocused && (
                  <CheckCircle2 className="h-4 w-4 absolute right-3 top-3 text-green-500" />
                )}
                {showValidationStatus && isInvalid && !isFocused && (
                  <AlertCircle className="h-4 w-4 absolute right-3 top-3 text-red-500" />
                )}
                {showValidationStatus && isFocused && description && (
                  <HelpCircle className="h-4 w-4 absolute right-3 top-3 text-blue-500" />
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

FormInput.displayName = 'FormInput';

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ name, label, description, showValidationStatus = true, className, ...props }, ref) => {
    const form = useFormContext();
    const [isFocused, setIsFocused] = useState(false);
    const fieldState = form?.getFieldState(name, form.formState);

    const isValid = fieldState?.isDirty && !fieldState?.invalid;
    const isInvalid = fieldState?.invalid && fieldState?.isTouched;

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="relative">
                <Textarea
                  {...field}
                  {...props}
                  ref={ref}
                  onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                  }}
                  onBlur={(e) => {
                    setIsFocused(false);
                    field.onBlur();
                    props.onBlur?.(e);
                  }}
                  className={cn(
                    {
                      "pr-10": showValidationStatus && (isValid || isInvalid),
                      "border-green-400 focus-visible:ring-green-400/20": showValidationStatus && isValid,
                      "border-red-400 focus-visible:ring-red-400/20": showValidationStatus && isInvalid,
                    },
                    className
                  )}
                />
                {showValidationStatus && isValid && !isFocused && (
                  <CheckCircle2 className="h-4 w-4 absolute right-3 top-3 text-green-500" />
                )}
                {showValidationStatus && isInvalid && !isFocused && (
                  <AlertCircle className="h-4 w-4 absolute right-3 top-3 text-red-500" />
                )}
                {showValidationStatus && isFocused && description && (
                  <HelpCircle className="h-4 w-4 absolute right-3 top-3 text-blue-500" />
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export function FormSubmitButton({ 
  children, 
  isSubmitting, 
  className,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isSubmitting?: boolean }) {
  return (
    <button
      type="submit"
      className={cn(
        "flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
      disabled={isSubmitting}
      {...props}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Отправка...
        </>
      ) : (
        children
      )}
    </button>
  );
} 