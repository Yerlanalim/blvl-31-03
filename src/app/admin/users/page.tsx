'use client';

import React, { useState } from 'react';
import { Plus, Loader2, PencilIcon, Trash2Icon, KeyIcon, XIcon, CheckIcon } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserFormDialog from '@/components/admin/users/UserFormDialog';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';

export default function UsersPage() {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog();
  
  const { 
    users, 
    usersWithProgress,
    createUser, 
    updateUserProfile, 
    resetUserPassword,
    disableUser,
    enableUser,
    deleteUser 
  } = useUsers();
  
  const isCreating = createUser.isPending;
  const isUpdating = updateUserProfile.isPending;
  const isDeleting = deleteUser.isPending;
  const isResetting = resetUserPassword.isPending;
  const isDisabling = disableUser.isPending;
  const isEnabling = enableUser.isPending;
  
  const isProcessing = isCreating || isUpdating || isDeleting || isResetting || isDisabling || isEnabling;
  
  const handleCreateUser = (data: any) => {
    createUser.mutate({
      email: data.email,
      password: data.password,
      userData: {
        displayName: data.displayName,
        role: data.role,
        settings: data.settings,
      }
    }, {
      onSuccess: () => {
        setIsUserFormOpen(false);
      }
    });
  };
  
  const handleUpdateUser = (data: any) => {
    if (!selectedUser) return;
    
    updateUserProfile.mutate({
      userId: selectedUser.id,
      userData: {
        displayName: data.displayName,
        role: data.role,
        settings: data.settings,
      }
    }, {
      onSuccess: () => {
        setIsUserFormOpen(false);
        setSelectedUser(undefined);
      }
    });
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };
  
  const handleDeleteUser = (user: User) => {
    showConfirmDialog({
      title: 'Удалить пользователя',
      description: `Вы уверены, что хотите удалить пользователя ${user.displayName || user.email}? Это действие необратимо.`,
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      onConfirm: () => {
        deleteUser.mutate(user.id, {
          onSuccess: () => {
            toast.success('Пользователь успешно удален');
          }
        });
      }
    });
  };
  
  const handleResetPassword = (user: User) => {
    showConfirmDialog({
      title: 'Сбросить пароль',
      description: `Отправить письмо для сброса пароля пользователю ${user.displayName || user.email}?`,
      confirmText: 'Отправить',
      cancelText: 'Отмена',
      onConfirm: () => {
        resetUserPassword.mutate(user.email, {
          onSuccess: () => {
            toast.success('Письмо для сброса пароля успешно отправлено');
          }
        });
      }
    });
  };
  
  const handleToggleUserStatus = (user: User) => {
    if (user.disabled) {
      showConfirmDialog({
        title: 'Активировать пользователя',
        description: `Вы уверены, что хотите активировать пользователя ${user.displayName || user.email}?`,
        confirmText: 'Активировать',
        cancelText: 'Отмена',
        onConfirm: () => {
          enableUser.mutate(user.id, {
            onSuccess: () => {
              toast.success('Пользователь успешно активирован');
            }
          });
        }
      });
    } else {
      showConfirmDialog({
        title: 'Деактивировать пользователя',
        description: `Вы уверены, что хотите деактивировать пользователя ${user.displayName || user.email}?`,
        confirmText: 'Деактивировать',
        cancelText: 'Отмена',
        onConfirm: () => {
          disableUser.mutate(user.id, {
            onSuccess: () => {
              toast.success('Пользователь успешно деактивирован');
            }
          });
        }
      });
    }
  };
  
  const closeUserForm = () => {
    setIsUserFormOpen(false);
    setSelectedUser(undefined);
  };
  
  const handleFormSubmit = (data: any) => {
    if (selectedUser) {
      handleUpdateUser(data);
    } else {
      handleCreateUser(data);
    }
  };
  
  const getUserInitials = (user: User) => {
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Управление пользователями</h1>
        <Button onClick={() => setIsUserFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить пользователя
        </Button>
      </div>
      
      <Tabs defaultValue="all-users">
        <TabsList>
          <TabsTrigger value="all-users">Все пользователи</TabsTrigger>
          <TabsTrigger value="with-progress">Пользователи с прогрессом</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-users">
          <Card>
            <CardHeader>
              <CardTitle>Пользователи</CardTitle>
              <CardDescription>
                Список всех пользователей платформы
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : users.error ? (
                <div className="text-center text-destructive p-4">
                  Ошибка при загрузке пользователей
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Пользователь</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.data?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Нет пользователей
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.data?.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.displayName || 'Без имени'}</p>
                                  <p className="text-xs text-muted-foreground">ID: {user.id.substring(0, 8)}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.disabled ? (
                                <Badge variant="destructive">Неактивен</Badge>
                              ) : (
                                <Badge variant="success">Активен</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <span className="sr-only">Открыть меню</span>
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    <span>Редактировать</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                    <KeyIcon className="h-4 w-4 mr-2" />
                                    <span>Сбросить пароль</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleUserStatus(user)}>
                                    {user.disabled ? (
                                      <>
                                        <CheckIcon className="h-4 w-4 mr-2" />
                                        <span>Активировать</span>
                                      </>
                                    ) : (
                                      <>
                                        <XIcon className="h-4 w-4 mr-2" />
                                        <span>Деактивировать</span>
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteUser(user)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2Icon className="h-4 w-4 mr-2" />
                                    <span>Удалить</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="with-progress">
          <Card>
            <CardHeader>
              <CardTitle>Пользователи с прогрессом</CardTitle>
              <CardDescription>
                Список пользователей и их прогресс
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersWithProgress.isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : usersWithProgress.error ? (
                <div className="text-center text-destructive p-4">
                  Ошибка при загрузке данных пользователей
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Пользователь</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Прогресс</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersWithProgress.data?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Нет пользователей с прогрессом
                          </TableCell>
                        </TableRow>
                      ) : (
                        usersWithProgress.data?.map((userWithProgress) => (
                          <TableRow key={userWithProgress.user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>{getUserInitials(userWithProgress.user)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{userWithProgress.user.displayName || 'Без имени'}</p>
                                  <p className="text-xs text-muted-foreground">ID: {userWithProgress.user.id.substring(0, 8)}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{userWithProgress.user.email}</TableCell>
                            <TableCell>
                              <Badge variant={userWithProgress.user.role === 'admin' ? 'default' : 'secondary'}>
                                {userWithProgress.user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs">Прогресс:</span>
                                  <span className="text-xs font-medium">
                                    {userWithProgress.progress?.completedSections || 0} из {userWithProgress.progress?.totalSections || 0}
                                  </span>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-primary h-full" 
                                    style={{ 
                                      width: userWithProgress.progress?.totalSections 
                                        ? `${(userWithProgress.progress.completedSections / userWithProgress.progress.totalSections) * 100}%` 
                                        : '0%' 
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <span className="sr-only">Открыть меню</span>
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditUser(userWithProgress.user)}>
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    <span>Редактировать</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleResetPassword(userWithProgress.user)}>
                                    <KeyIcon className="h-4 w-4 mr-2" />
                                    <span>Сбросить пароль</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteUser(userWithProgress.user)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2Icon className="h-4 w-4 mr-2" />
                                    <span>Удалить</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <UserFormDialog
        user={selectedUser}
        isOpen={isUserFormOpen}
        isProcessing={isProcessing}
        onSubmit={handleFormSubmit}
        onCancel={closeUserForm}
      />
      
      <ConfirmDialog />
    </div>
  );
} 