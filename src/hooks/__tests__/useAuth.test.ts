import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import * as AuthContext from '@/context/AuthContext';

describe('useAuth hook', () => {
  const mockAuthContext = {
    user: { uid: 'test-user-id', email: 'test@example.com' },
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    resetPassword: vi.fn(),
    updateProfile: vi.fn(),
    error: null,
    isAdmin: vi.fn()
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should throw error when used outside AuthProvider', () => {
    // Мокируем useAuthContext, чтобы он возвращал null (имитируя использование вне провайдера)
    vi.spyOn(AuthContext, 'useAuthContext').mockImplementation(() => null);

    const { result } = renderHook(() => useAuth());
    
    expect(() => result.current).toThrow('useAuth must be used within an AuthProvider');
  });

  it('should return auth context when used within AuthProvider', () => {
    // Мокируем useAuthContext, чтобы он возвращал мок-объект контекста
    vi.spyOn(AuthContext, 'useAuthContext').mockImplementation(() => mockAuthContext);

    const { result } = renderHook(() => useAuth());
    
    expect(result.current).toBe(mockAuthContext);
    expect(result.current.user).toBe(mockAuthContext.user);
    expect(result.current.loading).toBe(false);
    expect(result.current.login).toBe(mockAuthContext.login);
    expect(result.current.register).toBe(mockAuthContext.register);
    expect(result.current.logout).toBe(mockAuthContext.logout);
  });

  it('should provide access to auth methods', async () => {
    // Мокируем useAuthContext
    vi.spyOn(AuthContext, 'useAuthContext').mockImplementation(() => mockAuthContext);

    const { result } = renderHook(() => useAuth());
    
    // Вызываем метод login из хука
    result.current.login('test@example.com', 'password');
    
    // Проверяем, что метод login был вызван с правильными аргументами
    expect(mockAuthContext.login).toHaveBeenCalledWith('test@example.com', 'password');
  });
}); 