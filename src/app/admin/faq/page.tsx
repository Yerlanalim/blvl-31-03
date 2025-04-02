'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, MessagesSquare } from 'lucide-react';

export default function AdminFaqPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Управление FAQ</h2>
          <p className="text-muted-foreground">
            Добавление, редактирование и удаление часто задаваемых вопросов
          </p>
        </div>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          <span>Добавить вопрос</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Категории FAQ</CardTitle>
          <CardDescription>Управление категориями часто задаваемых вопросов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" size="sm" className="gap-1">
              <MessagesSquare className="h-4 w-4" />
              Все категории
            </Button>
            <Button variant="outline" size="sm">Общие вопросы</Button>
            <Button variant="outline" size="sm">Технические вопросы</Button>
            <Button variant="outline" size="sm">Вопросы об уровнях</Button>
            <Button variant="outline" size="sm">Вопросы об артефактах</Button>
            <Button variant="outline" size="sm">Вопросы о тестах</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Список вопросов</CardTitle>
          <CardDescription>Управление вопросами и ответами</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="flex flex-col">
              {/* FAQ 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b p-4 gap-2">
                <div>
                  <p className="font-medium">Как зарегистрироваться на платформе?</p>
                  <p className="text-xs text-muted-foreground">Категория: Общие вопросы</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* FAQ 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b p-4 gap-2">
                <div>
                  <p className="font-medium">Как разблокировать следующий уровень?</p>
                  <p className="text-xs text-muted-foreground">Категория: Вопросы об уровнях</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* FAQ 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-2">
                <div>
                  <p className="font-medium">Как скачать артефакт?</p>
                  <p className="text-xs text-muted-foreground">Категория: Вопросы об артефактах</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Это просто заглушка. Полное управление FAQ будет доступно в следующих версиях.
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 