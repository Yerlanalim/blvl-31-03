'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ErrorProvider } from '@/context/ErrorContext';

interface ProvidersProps {
  children: React.ReactNode;
}

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff with max of 30 seconds
      staleTime: 5 * 60 * 1000, // 5 minutes default stale time
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
      networkMode: 'offlineFirst', // Better offline behavior
    },
    mutations: {
      networkMode: 'offlineFirst', // Better offline behavior
      retry: 2, // Retry mutations twice by default
    },
  },
});

export default function Providers({ children }: ProvidersProps) {
  // Note: Additional providers like QueryClientProvider and AuthProvider 
  // will be added in future tasks
  
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <AuthProvider>
          <SettingsProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster 
                position="top-right" 
                closeButton
                richColors
                toastOptions={{
                  duration: 5000,
                  className: "border-border",
                  style: {
                    background: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                    border: "1px solid hsl(var(--border))",
                  },
                }}
              />
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </ErrorProvider>
    </QueryClientProvider>
  );
} 