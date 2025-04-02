"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FaqSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultsCount?: number;
}

export function FaqSearch({ 
  query, 
  onQueryChange, 
  resultsCount 
}: FaqSearchProps) {
  const [inputValue, setInputValue] = useState(query);

  // Update input value when search query changes
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Handle debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== query) {
        onQueryChange(inputValue);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [inputValue, onQueryChange, query]);

  // Clear search input
  const handleClear = () => {
    setInputValue("");
    onQueryChange("");
  };

  return (
    <div className="space-y-2 w-full max-w-md">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Поиск по вопросам и ответам..."
          className="pl-10 pr-10"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={handleClear}
            aria-label="Очистить поиск"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {inputValue && resultsCount !== undefined && (
        <p className="text-sm text-muted-foreground">
          Найдено {resultsCount} {resultsCount === 1 ? 'результат' : 
          (resultsCount >= 2 && resultsCount <= 4) ? 'результата' : 'результатов'}
        </p>
      )}
    </div>
  );
} 