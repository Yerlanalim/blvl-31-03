/**
 * Форматирует дату в русском формате
 * @param date Объект Date для форматирования
 * @returns Отформатированная дата в формате "ДД месяц ГГГГ"
 */
export function formatDate(date: Date): string {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Форматирует дату и время в русском формате
 * @param date Объект Date для форматирования
 * @returns Отформатированная дата и время в формате "ДД месяц ГГГГ, ЧЧ:ММ"
 */
export function formatDateTime(date: Date): string {
  const formattedDate = formatDate(date);
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${formattedDate}, ${hours}:${minutes}`;
}

/**
 * Возвращает относительную дату (сегодня, вчера, неделю назад и т.д.)
 * @param date Объект Date
 * @returns Строка с относительной датой
 */
export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'только что';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${getMinutesText(diffInMinutes)} назад`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${getHoursText(diffInHours)} назад`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'вчера';
  }
  
  if (diffInDays < 7) {
    return `${diffInDays} ${getDaysText(diffInDays)} назад`;
  }
  
  return formatDate(date);
}

// Вспомогательные функции для правильных окончаний
function getMinutesText(minutes: number): string {
  if (minutes >= 11 && minutes <= 14) return 'минут';
  const lastDigit = minutes % 10;
  if (lastDigit === 1) return 'минуту';
  if (lastDigit >= 2 && lastDigit <= 4) return 'минуты';
  return 'минут';
}

function getHoursText(hours: number): string {
  if (hours >= 11 && hours <= 14) return 'часов';
  const lastDigit = hours % 10;
  if (lastDigit === 1) return 'час';
  if (lastDigit >= 2 && lastDigit <= 4) return 'часа';
  return 'часов';
}

function getDaysText(days: number): string {
  if (days >= 11 && days <= 14) return 'дней';
  const lastDigit = days % 10;
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
  return 'дней';
} 