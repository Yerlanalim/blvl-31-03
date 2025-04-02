'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyLoadProps {
  children: ReactNode;
  height?: string | number;
  width?: string | number;
  className?: string;
  threshold?: number;
  fallback?: ReactNode;
  onVisible?: () => void;
}

/**
 * A component that renders its children only when they are close to the viewport.
 * Useful for optimizing initial page load performance.
 */
export function LazyLoad({
  children,
  height,
  width,
  className = '',
  threshold = 0.1,
  fallback,
  onVisible,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRendered) {
          setIsVisible(true);
          setHasRendered(true);
          if (onVisible) onVisible();
        }
      },
      {
        threshold,
        rootMargin: '200px', // Load content when within 200px of viewport
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hasRendered, threshold, onVisible]);

  // Style for container
  const style: React.CSSProperties = {
    height: height || 'auto',
    width: width || 'auto',
    position: 'relative',
  };

  // Default loading skeleton
  const defaultFallback = (
    <Skeleton className={`w-full ${typeof height === 'number' ? `h-[${height}px]` : height || 'h-40'}`} />
  );

  return (
    <div ref={ref} style={style} className={className}>
      {isVisible ? children : fallback || defaultFallback}
    </div>
  );
}

export default LazyLoad; 