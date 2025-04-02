'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Layers, Award, HelpCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  // Placeholder stats (these would be fetched from Firebase in a real implementation)
  const stats = [
    {
      title: 'Пользователи',
      value: '256',
      description: 'Зарегистрированных пользователей',
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Уровни',
      value: '12',
      description: 'Активных уровней обучения',
      icon: <Layers className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Артефакты',
      value: '36',
      description: 'Доступных артефактов',
      icon: <Award className="h-6 w-6 text-primary" />,
    },
    {
      title: 'FAQ',
      value: '24',
      description: 'Вопросов и ответов',
      icon: <HelpCircle className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Обзор платформы</h2>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Обновлено сегодня</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Недавняя активность</CardTitle>
            <CardDescription>Последние действия пользователей</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Здесь будет отображаться список последних действий пользователей на платформе.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Популярные уровни</CardTitle>
            <CardDescription>Наиболее посещаемые уровни</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Здесь будет отображаться список самых популярных уровней на платформе.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 