'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileFormValues, profileSchema } from '@/lib/zod-schemas';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useUpdateUserProfile } from '@/hooks/useSettings';
import { uploadAvatar } from '@/lib/firebase/storage';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function ProfileSettingsForm() {
  const { user } = useAuth();
  const { profile, isLoading } = useUserProfile();
  const { updateProfile, isPending } = useUpdateUserProfile();
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile?.displayName || '',
      photoURL: profile?.photoURL || null,
    },
    values: {
      displayName: profile?.displayName || '',
      photoURL: profile?.photoURL || null,
    },
  });
  
  const handleAvatarUpload = async (file: File) => {
    if (!user?.uid) return;
    
    try {
      setIsUploading(true);
      
      // Создаем объект URL для предпросмотра
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      
      // Загружаем файл в Firebase Storage
      const photoURL = await uploadAvatar(user.uid, file);
      
      // Обновляем форму со ссылкой на новый аватар
      form.setValue('photoURL', photoURL);
      
      toast.success('Аватар успешно загружен');
    } catch (error) {
      toast.error(`Ошибка при загрузке аватара: ${(error as Error).message}`);
      setAvatarPreview(null);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверяем, что файл - изображение
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите файл изображения');
        return;
      }
      
      // Проверяем размер файла (макс. 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 2MB');
        return;
      }
      
      handleAvatarUpload(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      await updateProfile({
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
    } catch (error) {
      toast.error(`Ошибка при обновлении профиля: ${(error as Error).message}`);
    }
  };
  
  // Функция для получения инициалов из имени
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 cursor-pointer" onClick={triggerFileInput}>
            <AvatarImage 
              src={avatarPreview || profile?.photoURL || ''} 
              alt={profile?.displayName || 'Аватар'} 
            />
            <AvatarFallback className="text-lg">
              {isUploading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
              ) : (
                getInitials(profile?.displayName)
              )}
            </AvatarFallback>
          </Avatar>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            {isUploading ? 'Загрузка...' : 'Изменить фото'}
          </Button>
        </div>
        
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ваше имя" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isPending || isUploading}>
          {isPending ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </form>
    </Form>
  );
} 