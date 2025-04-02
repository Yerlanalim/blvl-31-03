'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/lib/services/settings-service';
import { formatDate } from '@/lib/utils/date-utils';
import { Pencil } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

// Функция для получения инициалов из имени пользователя
const getInitials = (name: string | null): string => {
  if (!name) return 'БУ'; // БизнесУровень по умолчанию

  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  
  return name.substring(0, 2).toUpperCase();
};

type UserInfoCardProps = {
  profile: UserProfile | null;
};

export function UserInfoCard({ profile }: UserInfoCardProps) {
  // Функция для безопасного форматирования даты
  const formatCreatedAt = () => {
    if (!profile?.createdAt) return 'Неизвестно';
    
    // Проверяем, является ли createdAt экземпляром Timestamp
    if (profile.createdAt instanceof Timestamp) {
      return formatDate(profile.createdAt.toDate());
    }
    
    // Обрабатываем случай, когда createdAt уже является Date
    if (profile.createdAt instanceof Date) {
      return formatDate(profile.createdAt);
    }
    
    return 'Неизвестно';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Личная информация</CardTitle>
          <CardDescription>Основные данные вашего аккаунта</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">
          <Pencil className="mr-2 h-4 w-4" />
          Редактировать
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-shrink-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.photoURL || ''} alt={profile?.displayName || 'Пользователь'} />
            <AvatarFallback className="text-lg">{getInitials(profile?.displayName)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-3 flex-grow">
          <div>
            <p className="text-sm text-gray-500">Имя</p>
            <p className="font-medium">{profile?.displayName || 'Не указано'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{profile?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Дата регистрации</p>
            <p className="font-medium">
              {formatCreatedAt()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 