import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DynamicOptions<T> {
  loading?: ComponentType;
  ssr?: boolean;
  loadingTimeout?: number;
}

/**
 * Creates a dynamically imported component with customizable loading state
 * 
 * @param importFn Function that imports the component
 * @param options Options for dynamic loading
 * @returns Dynamically loaded component
 */
export function dynamicImport<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicOptions<T> = {}
) {
  const {
    loading,
    ssr = false,
    loadingTimeout = 3000
  } = options;

  return dynamic(importFn, {
    loading,
    ssr,
    loading: loading || (() => <Skeleton className="w-full h-24" />),
    loadingTimeout
  });
}

/**
 * Default loading component for large sections
 */
export const DefaultLoadingSection = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-10 w-3/4" />
    <Skeleton className="h-6 w-1/2" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </div>
  </div>
);

/**
 * Default loading component for list items
 */
export const DefaultLoadingItem = () => (
  <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

/**
 * Creates a component with lazy loading based on visibility
 * Useful for content below the fold
 */
export const withLazyLoading = <T,>(
  Component: ComponentType<T>,
  options: {
    fallback?: ReactNode;
    threshold?: number;
  } = {}
) => {
  const LazyComponent = dynamic(
    () => Promise.resolve({ default: Component }),
    { 
      ssr: false,
      loading: () => <>{options.fallback || <DefaultLoadingItem />}</>
    }
  );

  return LazyComponent;
}; 