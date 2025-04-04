'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import * as Sentry from '@sentry/nextjs';

/**
 * Component that will throw an error for demonstration
 */
function BuggyComponent({ shouldThrow = false }) {
  if (shouldThrow) {
    throw new Error('This is a demonstration error from BuggyComponent');
  }
  
  return (
    <div className="p-4 bg-muted rounded-md">
      <p>This is a buggy component that works fine unless the "shouldThrow" prop is true.</p>
    </div>
  );
}

/**
 * A component that lets the user trigger a render error
 */
function ErrorDemo() {
  const [shouldThrow, setShouldThrow] = useState(false);
  
  const handleToggleError = () => {
    // Track the action in Sentry
    Sentry.addBreadcrumb({
      category: 'ui-interaction',
      message: 'User toggled error state',
      data: { 
        newState: !shouldThrow,
        component: 'ErrorDemo' 
      },
      level: 'info',
    });
    
    setShouldThrow(!shouldThrow);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Boundary Demo</CardTitle>
        <CardDescription>
          This component demonstrates how ErrorBoundary captures React render errors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ErrorBoundary>
          <BuggyComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      </CardContent>
      <CardFooter>
        <Button onClick={handleToggleError} variant={shouldThrow ? "default" : "destructive"}>
          {shouldThrow ? "Reset Component" : "Trigger Error"}
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * A component that allows testing manual error reporting
 */
function ManualErrorReportingDemo() {
  const handleReportError = () => {
    try {
      // Simulate an error in an event handler
      throw new Error('Manually reported error from button click');
    } catch (error) {
      // Manually capture the error with Sentry
      Sentry.captureException(error, {
        tags: {
          component: 'ManualErrorReportingDemo',
          errorType: 'manual',
        },
        extra: {
          timestamp: new Date().toISOString(),
        },
      });
      
      // Show an alert to the user
      alert('Error reported to monitoring system!');
    }
  };
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Manual Error Reporting</CardTitle>
        <CardDescription>
          This demonstrates how to manually report errors to Sentry
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Not all errors are caught by ErrorBoundary. Event handler errors, 
          async errors, and other non-rendering errors need to be reported manually.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleReportError} variant="destructive">
          Report Manual Error
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Demo page for error monitoring
 */
export default function ErrorMonitoringDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Error Monitoring Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ErrorDemo />
        <ManualErrorReportingDemo />
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-xl font-semibold mb-2">How It Works</h2>
        <p>This demonstration shows two approaches to error monitoring:</p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>ErrorBoundary:</strong> Wraps components to catch and report render errors.
            The component provides a fallback UI when errors occur.
          </li>
          <li>
            <strong>Manual error reporting:</strong> Uses <code>Sentry.captureException()</code> to
            report errors in event handlers, async code, etc.
          </li>
        </ul>
      </div>
    </div>
  );
} 