import { 
  getDocuments, 
  FAQ_COLLECTION 
} from '../firebase/firestore';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';

/**
 * Интерфейс для часто задаваемых вопросов (FAQ)
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

/**
 * Получение списка FAQ с возможностью фильтрации по категории
 * @param filters Объект с параметрами фильтрации (опционально)
 * @returns Promise со списком FAQ
 */
export const getFaqs = async (filters?: { category?: string }): Promise<FAQ[]> => {
  try {
    const queryConstraints: QueryConstraint[] = [
      orderBy('category', 'asc'),
      orderBy('order', 'asc')
    ];

    // Если указана категория, добавляем фильтр
    if (filters?.category) {
      queryConstraints.unshift(where('category', '==', filters.category));
    }

    const faqs = await getDocuments<FAQ>(FAQ_COLLECTION, queryConstraints);
    return faqs;
  } catch (error) {
    console.error('Ошибка при получении списка FAQ:', error);
    throw new Error('Не удалось загрузить список FAQ. Пожалуйста, попробуйте позже.');
  }
};

/**
 * Получение списка всех категорий FAQ
 * @returns Promise со списком категорий
 */
export const getFaqCategories = async (): Promise<string[]> => {
  try {
    const faqs = await getDocuments<FAQ>(FAQ_COLLECTION);
    
    // Извлекаем уникальные категории и сортируем их
    const categories = Array.from(new Set(faqs.map(faq => faq.category)))
      .sort((a, b) => a.localeCompare(b));
    
    return categories;
  } catch (error) {
    console.error('Ошибка при получении категорий FAQ:', error);
    throw new Error('Не удалось загрузить категории FAQ. Пожалуйста, попробуйте позже.');
  }
};

/**
 * Поиск по FAQ
 * @param query Строка для поиска
 * @returns Promise со списком найденных FAQ
 */
export const searchFaqs = async (query: string): Promise<FAQ[]> => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    const faqs = await getDocuments<FAQ>(FAQ_COLLECTION);
    const searchTerm = query.toLowerCase();
    
    // Фильтрация FAQ по вхождению поискового запроса
    const filteredFaqs = faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) || 
      faq.answer.toLowerCase().includes(searchTerm)
    );
    
    // Сортировка результатов по релевантности - сначала те, где запрос в заголовке
    return filteredFaqs.sort((a, b) => {
      const aHasQueryInQuestion = a.question.toLowerCase().includes(searchTerm);
      const bHasQueryInQuestion = b.question.toLowerCase().includes(searchTerm);
      
      if (aHasQueryInQuestion && !bHasQueryInQuestion) return -1;
      if (!aHasQueryInQuestion && bHasQueryInQuestion) return 1;
      
      // Если оба содержат или не содержат запрос в заголовке, сортируем по категории и порядку
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.order - b.order;
    });
  } catch (error) {
    console.error('Ошибка при поиске FAQ:', error);
    throw new Error('Не удалось выполнить поиск. Пожалуйста, попробуйте позже.');
  }
}; 