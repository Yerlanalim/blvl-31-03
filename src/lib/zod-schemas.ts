import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email-адрес' }),
  password: z
    .string()
    .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
    .max(100),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email-адрес' }),
  password: z.string().min(1, { message: 'Введите пароль' }),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email-адрес' }),
});

/**
 * Схема валидации для формы входа
 * - email: валидный email
 * - password: минимум 6 символов
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email обязателен' })
    .email({ message: 'Неверный формат email' }),
  password: z
    .string()
    .min(1, { message: 'Пароль обязателен' })
    .min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
});

/**
 * Схема валидации для формы регистрации
 * - email: валидный email
 * - password: минимум 6 символов
 * - passwordConfirm: должен совпадать с password
 */
export const registerFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email обязателен' })
      .email({ message: 'Неверный формат email' }),
    password: z
      .string()
      .min(1, { message: 'Пароль обязателен' })
      .min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
    passwordConfirm: z
      .string()
      .min(1, { message: 'Подтверждение пароля обязательно' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  });

/**
 * Схема валидации для формы сброса пароля
 * - email: валидный email
 */
export const resetPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email обязателен' })
    .email({ message: 'Неверный формат email' }),
});

/**
 * Схема валидации для формы профиля пользователя
 */
export const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }).max(50),
  photoURL: z.string().url({ message: 'Введите корректный URL' }).optional().nullable(),
});

/**
 * Схема валидации для формы настройки темы
 */
export const appearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    required_error: 'Выберите тему',
    invalid_type_error: 'Выберите допустимый вариант темы',
  }),
});

/**
 * Схема валидации для формы настройки уведомлений
 */
export const notificationSettingsSchema = z.object({
  notificationsEnabled: z.boolean(),
  emailNotificationsEnabled: z.boolean(),
});

/**
 * Схема валидации для формы настройки аккаунта
 */
export const accountSettingsSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email обязателен' })
    .email({ message: 'Неверный формат email' }),
});

// Типы на основе схем
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type AppearanceSettingsFormValues = z.infer<typeof appearanceSettingsSchema>;
export type NotificationSettingsFormValues = z.infer<typeof notificationSettingsSchema>;
export type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>;

// Note: Additional schemas will be added as needed for other forms in the application 