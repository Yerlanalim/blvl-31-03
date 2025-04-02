'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * An optimized image component that leverages Next.js image optimization 
 * with loading states and error handling
 */
export function OptimizedImage({
  src,
  alt,
  width = 0,
  height = 0,
  className = '',
  objectFit = 'cover',
  priority = false,
  quality = 75,
  onLoad,
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);

  // Default blur data URL - light gray background
  const defaultBlurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  
  // Handler for image load completion
  const handleImageLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // Handler for image load error
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Calculate display values
  const imageWidth = width || undefined;
  const imageHeight = height || undefined;

  // Automatic aspect ratio if only one dimension is provided
  const aspectRatio = width && height ? width / height : undefined;

  // If there's an error loading the image
  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{ width: imageWidth, height: imageHeight, aspectRatio }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} style={{ aspectRatio }}>
      {isLoading && (
        <Skeleton 
          className="absolute inset-0"
          style={{ width: imageWidth, height: imageHeight }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={imageWidth}
        height={imageHeight}
        quality={quality}
        priority={priority}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit === 'cover' && "object-cover",
          objectFit === 'contain' && "object-contain",
          objectFit === 'fill' && "object-fill",
          objectFit === 'none' && "object-none",
          objectFit === 'scale-down' && "object-scale-down",
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}

export default OptimizedImage; 