"use client";

import { useFaqState } from "@/hooks/useFaqs";
import { FaqSearch, FaqCategories, FaqList } from "@/components/features/Faq";

export default function FaqPage() {
  // Use the combined state hook for managing FAQ data and UI state
  const {
    faqs,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    setCategory,
    setSearchQuery,
    isSearching,
    hasSearchResults,
  } = useFaqState();

  return (
    <div className="container py-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Часто задаваемые вопросы</h1>
        
        <div className="mb-6">
          <FaqSearch
            query={searchQuery}
            onQueryChange={setSearchQuery}
            resultsCount={isSearching && faqs ? faqs.length : undefined}
          />
        </div>

        {!isSearching && (
          <FaqCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setCategory}
            isLoading={isLoading}
          />
        )}
      </div>

      {error ? (
        <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
          Произошла ошибка при загрузке FAQ. Пожалуйста, попробуйте позже.
        </div>
      ) : (
        <FaqList
          faqs={faqs}
          isLoading={isLoading}
          query={searchQuery}
          groupByCategory={!isSearching && !selectedCategory}
        />
      )}
    </div>
  );
} 