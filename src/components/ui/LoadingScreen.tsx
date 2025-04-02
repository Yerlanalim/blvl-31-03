'use client';

import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = 'Загрузка...' }: LoadingScreenProps) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 