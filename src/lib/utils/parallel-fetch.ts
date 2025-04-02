/**
 * Runs multiple async operations in parallel and waits for all of them to complete
 * 
 * @param fetchers Array of async functions that fetch data
 * @returns Promise that resolves to an array of results
 */
export async function fetchParallel<T>(fetchers: (() => Promise<T>)[]): Promise<T[]> {
  return Promise.all(fetchers.map(fetcher => fetcher()));
}

/**
 * Runs multiple async operations in parallel with error handling
 * If any operation fails, the results of successful operations are still returned
 * 
 * @param fetchers Object with named async functions
 * @returns Promise with object containing results and errors
 */
export async function fetchParallelWithFallback<T extends Record<string, unknown>>(
  fetchers: { [K in keyof T]: () => Promise<T[K]> }
): Promise<{
  results: Partial<T>;
  errors: Partial<Record<keyof T, Error>>;
  hasErrors: boolean;
}> {
  const keys = Object.keys(fetchers) as Array<keyof T>;
  const results: Partial<T> = {};
  const errors: Partial<Record<keyof T, Error>> = {};
  
  await Promise.allSettled(
    keys.map(async (key) => {
      try {
        results[key] = await fetchers[key]();
      } catch (error) {
        errors[key] = error as Error;
      }
    })
  );
  
  const hasErrors = Object.keys(errors).length > 0;
  
  return {
    results,
    errors,
    hasErrors
  };
}

/**
 * Executes a function with retry logic
 * 
 * @param fn Function to execute with retry logic
 * @param retries Maximum number of retries
 * @param delay Delay between retries in ms
 * @returns Promise with the result of the function
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return withRetry(fn, retries - 1, delay * 2);
  }
} 