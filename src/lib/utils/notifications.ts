import { toast } from 'sonner';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  duration?: number;
  id?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show a notification toast with standardized formatting
 */
export const showNotification = (
  message: string,
  type: NotificationType = 'info',
  options?: NotificationOptions
) => {
  const { duration = 5000, id, description, action } = options || {};
  
  const toastOptions = {
    duration,
    id,
    description,
    action: action ? {
      label: action.label,
      onClick: action.onClick
    } : undefined
  };
  
  switch (type) {
    case 'success':
      return toast.success(message, toastOptions);
    case 'error':
      return toast.error(message, toastOptions);
    case 'warning':
      return toast.warning(message, toastOptions);
    case 'info':
    default:
      return toast.info(message, toastOptions);
  }
};

export const notifySuccess = (message: string, options?: NotificationOptions) => 
  showNotification(message, 'success', options);

export const notifyError = (message: string, options?: NotificationOptions) => 
  showNotification(message, 'error', options);

export const notifyWarning = (message: string, options?: NotificationOptions) => 
  showNotification(message, 'warning', options);

export const notifyInfo = (message: string, options?: NotificationOptions) => 
  showNotification(message, 'info', options);

// Predefined notification messages for common operations
export const NOTIFICATION_MESSAGES = {
  // Auth related
  LOGIN_SUCCESS: 'Вход выполнен успешно',
  REGISTER_SUCCESS: 'Регистрация выполнена успешно',
  LOGOUT_SUCCESS: 'Выход выполнен успешно',
  PASSWORD_RESET_EMAIL_SENT: 'Инструкции по сбросу пароля отправлены на ваш email',
  PASSWORD_RESET_SUCCESS: 'Пароль успешно изменен',
  
  // Profile/Settings related
  PROFILE_UPDATE_SUCCESS: 'Профиль успешно обновлен',
  SETTINGS_UPDATE_SUCCESS: 'Настройки успешно сохранены',
  
  // Content related
  LEVEL_COMPLETED: 'Уровень успешно завершен',
  TEST_COMPLETED: 'Тест успешно пройден',
  VIDEO_WATCHED: 'Видео отмечено как просмотренное',
  ARTIFACT_DOWNLOADED: 'Материал успешно скачан',
  
  // Error messages
  GENERIC_ERROR: 'Произошла ошибка. Пожалуйста, попробуйте позже',
  NETWORK_ERROR: 'Ошибка сети. Проверьте ваше подключение к интернету',
  AUTH_ERROR: 'Ошибка аутентификации. Пожалуйста, войдите снова',
  PERMISSION_ERROR: 'У вас нет доступа к этому ресурсу',
  VALIDATION_ERROR: 'Пожалуйста, проверьте введенные данные',
  
  // Form/Input related
  FORM_SUBMITTED: 'Форма успешно отправлена',
  FORM_VALIDATION_ERROR: 'Пожалуйста, исправьте ошибки в форме',
  REQUIRED_FIELD: 'Это поле обязательно для заполнения',
  INVALID_EMAIL: 'Пожалуйста, введите корректный email',
  INVALID_PASSWORD: 'Пароль должен содержать минимум 6 символов',
}; 