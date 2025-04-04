/**
 * Utility for creating standardized React Query hooks
 * This reduces duplication in data fetching patterns throughout the application
 */
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { handleError, ErrorType } from '../error-handling/errorHandler';

interface QueryOptions<TData, TError> {
  staleTime?: number;
  cacheTime?: number;
  enabled?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  select?: (data: any) => TData;
}

interface MutationOptions<TData, TError, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
  onMutate?: (variables: TVariables) => Promise<any> | any;
  invalidateQueries?: QueryKey[];
  optimisticUpdate?: (currentData: any, variables: TVariables) => any;
}

/**
 * Create a standardized query hook
 */
export function createQueryHook<TData, TError = Error, TParams extends any[] = []>(
  queryKeyFn: (...params: TParams) => QueryKey,
  queryFn: (...params: TParams) => Promise<TData>,
  defaultOptions: QueryOptions<TData, TError> = {},
  errorType: ErrorType = ErrorType.Unknown
) {
  return (...params: TParams) => {
    const queryKey = queryKeyFn(...params);
    
    return useQuery({
      queryKey,
      queryFn: async () => {
        try {
          return await queryFn(...params);
        } catch (error) {
          handleError(error, errorType);
          throw error;
        }
      },
      staleTime: defaultOptions.staleTime,
      gcTime: defaultOptions.cacheTime,
      enabled: defaultOptions.enabled,
      select: defaultOptions.select,
    });
  };
}

/**
 * Create a standardized mutation hook
 */
export function createMutationHook<TData, TVariables, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TError, TVariables> = {},
  errorType: ErrorType = ErrorType.Unknown
) {
  return () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (variables: TVariables) => {
        try {
          return await mutationFn(variables);
        } catch (error) {
          handleError(error, errorType);
          throw error;
        }
      },
      onSuccess: (data, variables) => {
        // Invalidate relevant queries
        if (options.invalidateQueries) {
          options.invalidateQueries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey });
          });
        }
        
        // Call custom onSuccess if provided
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: options.onError,
      onSettled: options.onSettled,
      onMutate: async (variables) => {
        // Handle optimistic updates if provided
        if (options.optimisticUpdate) {
          await Promise.all(
            (options.invalidateQueries || []).map(async (queryKey) => {
              // Cancel any outgoing refetches
              await queryClient.cancelQueries({ queryKey });
              
              // Get current query data
              const previousData = queryClient.getQueryData(queryKey);
              
              // Optimistically update the cache
              queryClient.setQueryData(queryKey, options.optimisticUpdate!(previousData, variables));
              
              return { queryKey, previousData };
            })
          );
        }
        
        // Call custom onMutate if provided
        if (options.onMutate) {
          return options.onMutate(variables);
        }
      },
    });
  };
}

/**
 * Create a standardized list query hook with filtering capabilities
 */
export function createFilteredListQueryHook<TData, TFilter, TError = Error>(
  queryKeyFn: (filter: TFilter) => QueryKey,
  queryFn: (filter: TFilter) => Promise<TData[]>,
  defaultOptions: QueryOptions<TData[], TError> = {},
  errorType: ErrorType = ErrorType.Unknown
) {
  return (filter: TFilter) => {
    const queryKey = queryKeyFn(filter);
    
    return useQuery({
      queryKey,
      queryFn: async () => {
        try {
          return await queryFn(filter);
        } catch (error) {
          handleError(error, errorType);
          throw error;
        }
      },
      staleTime: defaultOptions.staleTime,
      gcTime: defaultOptions.cacheTime,
      enabled: defaultOptions.enabled,
      select: defaultOptions.select,
    });
  };
} 