import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUsers, 
  getUserById, 
  updateUserRole, 
  deleteUser, 
  getUserStats,
  createUser,
  updateUserProfile,
  resetUserPassword,
  disableUser,
  enableUser,
  getUsersWithProgress
} from '@/lib/services/admin-service';
import { toast } from 'sonner';
import { User, UserSettings } from '@/types';

/**
 * Hook for fetching multiple users with optional filters
 */
export function useUsers(filters?: { search?: string; role?: string }) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => getUsers(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching a single user by ID
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId, // Only run if userId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for updating user role
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'user' | 'admin' }) => 
      updateUserRole(userId, role),
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      
      toast.success('Роль пользователя успешно обновлена');
    },
    onError: (error) => {
      toast.error(`Ошибка при обновлении роли: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      
      toast.success('Пользователь успешно удален');
    },
    onError: (error) => {
      toast.error(`Ошибка при удалении пользователя: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for fetching user statistics
 */
export function useUserStats() {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: getUserStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for creating a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      email, 
      password, 
      userData 
    }: { 
      email: string; 
      password: string; 
      userData: Omit<User, 'id' | 'email' | 'createdAt'> 
    }) => createUser(email, password, userData),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      
      toast.success('Пользователь успешно создан');
    },
    onError: (error) => {
      toast.error(`Ошибка при создании пользователя: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for updating user profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      userId, 
      userData 
    }: { 
      userId: string; 
      userData: Partial<User> 
    }) => updateUserProfile(userId, userData),
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      
      toast.success('Профиль пользователя успешно обновлен');
    },
    onError: (error) => {
      toast.error(`Ошибка при обновлении профиля: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for resetting a user's password
 */
export function useResetUserPassword() {
  return useMutation({
    mutationFn: (email: string) => resetUserPassword(email),
    onSuccess: () => {
      toast.success('Ссылка для сброса пароля отправлена на указанный email');
    },
    onError: (error) => {
      toast.error(`Ошибка при отправке ссылки для сброса пароля: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for disabling a user account
 */
export function useDisableUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => disableUser(userId),
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables] });
      
      toast.success('Аккаунт пользователя заблокирован');
    },
    onError: (error) => {
      toast.error(`Ошибка при блокировке аккаунта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for enabling a user account
 */
export function useEnableUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => enableUser(userId),
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables] });
      
      toast.success('Аккаунт пользователя разблокирован');
    },
    onError: (error) => {
      toast.error(`Ошибка при разблокировке аккаунта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for fetching users with their progress
 */
export function useUsersWithProgress() {
  return useQuery({
    queryKey: ['usersWithProgress'],
    queryFn: getUsersWithProgress,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
} 