import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '../RegisterForm';
import * as AuthHook from '@/hooks/useAuth';

// Мокируем хук useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    register: vi.fn(),
    loading: false,
    error: null
  }))
}));

// Мокируем useRouter из Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => null)
  }),
  redirect: vi.fn(),
}));

// Мокируем toast из sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

// Мокируем функции редиректа
vi.mock('@/lib/utils/auth-redirect', () => ({
  getRedirectUrl: vi.fn(() => null),
  clearRedirectUrl: vi.fn(),
  saveRedirectUrl: vi.fn(),
  getRedirectFromUrl: vi.fn(),
  createAuthUrlWithRedirect: vi.fn()
}));

describe('RegisterForm', () => {
  const mockRegister = vi.fn();
  const mockPush = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(AuthHook, 'useAuth').mockImplementation(() => ({
      register: mockRegister,
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      resetPassword: vi.fn(),
      updateProfile: vi.fn(),
      isAdmin: vi.fn()
    }));
  });

  it('renders the registration form', () => {
    renderWithProviders(<RegisterForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/подтверждение пароля/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeInTheDocument();
  });

  it('validates empty form submission', async () => {
    renderWithProviders(<RegisterForm />);
    
    const submitButton = screen.getByRole('button', { name: /зарегистрироваться/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email обязателен/i)).toBeInTheDocument();
      expect(screen.getByText(/пароль обязателен/i)).toBeInTheDocument();
      expect(screen.getByText(/подтверждение пароля обязательно/i)).toBeInTheDocument();
    });
    
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates invalid email format', async () => {
    renderWithProviders(<RegisterForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^пароль$/i);
    const passwordConfirmInput = screen.getByLabelText(/подтверждение пароля/i);
    const submitButton = screen.getByRole('button', { name: /зарегистрироваться/i });
    
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(passwordConfirmInput, 'password123');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/неверный формат email/i)).toBeInTheDocument();
    });
    
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates password too short', async () => {
    renderWithProviders(<RegisterForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^пароль$/i);
    const passwordConfirmInput = screen.getByLabelText(/подтверждение пароля/i);
    const submitButton = screen.getByRole('button', { name: /зарегистрироваться/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, '12345');
    await userEvent.type(passwordConfirmInput, '12345');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/пароль должен содержать минимум 6 символов/i)).toBeInTheDocument();
    });
    
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates password mismatch', async () => {
    renderWithProviders(<RegisterForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^пароль$/i);
    const passwordConfirmInput = screen.getByLabelText(/подтверждение пароля/i);
    const submitButton = screen.getByRole('button', { name: /зарегистрироваться/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(passwordConfirmInput, 'differentpassword');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/пароли не совпадают/i)).toBeInTheDocument();
    });
    
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('submits valid form data and attempts registration', async () => {
    renderWithProviders(<RegisterForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^пароль$/i);
    const passwordConfirmInput = screen.getByLabelText(/подтверждение пароля/i);
    const submitButton = screen.getByRole('button', { name: /зарегистрироваться/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(passwordConfirmInput, 'password123');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123', 'test');
    });
  });

  it('shows loading state when form is submitting', async () => {
    vi.mocked(AuthHook.useAuth).mockReturnValueOnce({
      register: vi.fn(() => new Promise(resolve => setTimeout(resolve, 100))),
      user: null,
      loading: true,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      resetPassword: vi.fn(),
      updateProfile: vi.fn(),
      isAdmin: vi.fn()
    });
    
    renderWithProviders(<RegisterForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^пароль$/i);
    const passwordConfirmInput = screen.getByLabelText(/подтверждение пароля/i);
    const submitButton = screen.getByRole('button', { name: /зарегистрироваться/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(passwordConfirmInput, 'password123');
    await userEvent.click(submitButton);
    
    // Проверяем, что кнопка отображает состояние загрузки
    expect(submitButton).toBeDisabled();
    expect(submitButton.textContent).toBe('Регистрация...');
  });
}); 