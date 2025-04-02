"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface FaqCategoriesProps {
  categories: string[] | undefined;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  isLoading: boolean;
}

export function FaqCategories({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading,
}: FaqCategoriesProps) {
  if (isLoading) {
    return (
      <div className="w-full space-y-2">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    );
  }

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      onCategoryChange(null);
    } else {
      onCategoryChange(value);
    }
  };

  return (
    <Tabs
      defaultValue="all"
      value={selectedCategory || "all"}
      onValueChange={handleCategoryChange}
      className="w-full"
    >
      <TabsList className="mb-4 flex flex-wrap h-auto">
        <TabsTrigger value="all" className="mb-1">
          Все категории
        </TabsTrigger>
        {categories?.map((category) => (
          <TabsTrigger key={category} value={category} className="mb-1">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
} 