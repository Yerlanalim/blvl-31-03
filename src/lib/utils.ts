import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Форматирует дату в читаемый вид.
 * @param date Дата для форматирования (Date или строка или timestamp)
 * @returns Отформатированная дата в виде строки "DD.MM.YYYY"
 */
export function formatDate(date: Date | string | number): string {
  if (!date) return 'N/A';
  
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Некорректная дата';
  }
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}.${month}.${year}`;
}
