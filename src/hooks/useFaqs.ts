'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getFaqs, 
  getFaqCategories, 
  searchFaqs,
  FAQ 
} from '@/lib/services/faq-service';

/**
 * Хук для получения списка FAQ с возможностью фильтрации по категории
 * @param filters Объект с параметрами фильтрации
 * @returns Объект с данными FAQ и состоянием запроса
 */
export const useFaqs = (filters?: { category?: string }) => {
  const { 
    data: faqs,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['faqs', filters],
    queryFn: async () => {
      try {
        return await getFaqs(filters);
      } catch (error) {
        console.error('Ошибка при получении списка FAQ:', error);
        toast.error('Не удалось загрузить список FAQ');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 минут кеширования
  });

  return {
    faqs,
    isLoading,
    error,
    refetch
  };
};

/**
 * Хук для получения списка категорий FAQ
 * @returns Объект с данными категорий и состоянием запроса
 */
export const useFaqCategories = () => {
  const {
    data: categories,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['faqCategories'],
    queryFn: async () => {
      try {
        return await getFaqCategories();
      } catch (error) {
        console.error('Ошибка при получении категорий FAQ:', error);
        toast.error('Не удалось загрузить категории FAQ');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 минут кеширования
  });

  return {
    categories,
    isLoading,
    error,
    refetch
  };
};

/**
 * Хук для поиска по FAQ
 * @param query Строка для поиска
 * @returns Объект с результатами поиска и состоянием запроса
 */
export const useSearchFaqs = (query: string) => {
  const {
    data: searchResults,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['searchFaqs', query],
    queryFn: async () => {
      try {
        return await searchFaqs(query);
      } catch (error) {
        console.error('Ошибка при поиске FAQ:', error);
        toast.error('Не удалось выполнить поиск');
        throw error;
      }
    },
    enabled: !!query && query.length >= 2, // Запрос выполняется только при наличии минимум 2 символов
    staleTime: 1000 * 60 * 5, // 5 минут кеширования
  });

  return {
    searchResults,
    isLoading,
    error,
    refetch
  };
};

/**
 * Хук для управления состоянием UI при работе с FAQ
 * @returns Объект с данными и функциями для управления состоянием
 */
export const useFaqState = () => {
  // Состояние выбранной категории
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Состояние поискового запроса
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Получение FAQ в зависимости от выбранной категории
  const { 
    faqs,
    isLoading: isFaqsLoading,
    error: faqsError
  } = useFaqs(selectedCategory ? { category: selectedCategory } : undefined);
  
  // Получение категорий
  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError
  } = useFaqCategories();
  
  // Поиск по FAQ
  const {
    searchResults,
    isLoading: isSearchLoading,
    error: searchError
  } = useSearchFaqs(searchQuery);

  // Выбор данных для отображения (результаты поиска или все FAQ)
  const displayData = useMemo<FAQ[] | undefined>(() => {
    if (searchQuery && searchQuery.length >= 2) {
      return searchResults;
    }
    return faqs;
  }, [searchQuery, searchResults, faqs]);
  
  // Обработчик изменения категории
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Сбрасываем поисковый запрос при смене категории
  };
  
  // Обработчик изменения поискового запроса
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null); // Сбрасываем выбранную категорию при поиске
  };

  return {
    // Данные
    faqs: displayData,
    categories,
    selectedCategory,
    searchQuery,
    
    // Состояния загрузки
    isLoading: isFaqsLoading || isCategoriesLoading || isSearchLoading,
    
    // Ошибки
    error: faqsError || categoriesError || searchError,
    
    // Функции для управления состоянием
    setCategory: handleCategoryChange,
    setSearchQuery: handleSearchChange,
    
    // Дополнительные флаги состояния
    isSearching: !!searchQuery && searchQuery.length >= 2,
    hasSearchResults: !!searchResults?.length,
    hasFilteredFaqs: !!faqs?.length
  };
}; 