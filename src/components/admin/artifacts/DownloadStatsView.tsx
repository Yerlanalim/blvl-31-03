'use client';

import React from 'react';
import { Artifact } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Users, TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface DownloadStatsViewProps {
  artifact: Artifact;
}

interface DownloadRecord {
  date: string;
  count: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  downloadedAt: string;
}

export function DownloadStatsView({ artifact }: DownloadStatsViewProps) {
  // Generate mock data for the chart
  // In a real application, this would come from the API
  const generateMockChartData = (): DownloadRecord[] => {
    const data: DownloadRecord[] = [];
    const now = new Date();
    
    // Generate data for the last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = subDays(now, i);
      const formattedDate = format(date, 'dd MMM', { locale: ru });
      
      // Generate a random count that generally increases over time
      // but follows a pattern where weekends have fewer downloads
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Base count is higher for more recent days
      let count = Math.floor((14 - i) / 2);
      
      // Weekend adjustment
      if (isWeekend) {
        count = Math.max(0, count - 2);
      }
      
      // Random factor
      count += Math.floor(Math.random() * 3);
      
      data.push({
        date: formattedDate,
        count,
      });
    }
    
    return data;
  };

  // Generate mock users who downloaded the artifact
  // In a real application, this would come from the API
  const generateMockUsers = (): User[] => {
    const users: User[] = [];
    const now = new Date();
    
    const mockUsers = [
      { id: '1', name: 'Иван Петров', email: 'ivan@example.com', role: 'user' },
      { id: '2', name: 'Анна Смирнова', email: 'anna@example.com', role: 'user' },
      { id: '3', name: 'Сергей Иванов', email: 'sergey@example.com', role: 'admin' },
      { id: '4', name: 'Елена Козлова', email: 'elena@example.com', role: 'user' },
      { id: '5', name: 'Дмитрий Соколов', email: 'dmitry@example.com', role: 'user' },
    ];
    
    // Choose a random subset of users
    const numUsers = Math.min(artifact.downloadCount, mockUsers.length);
    const shuffled = [...mockUsers].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numUsers; i++) {
      const days = Math.floor(Math.random() * 14);
      const downloadedAt = format(
        subDays(now, days), 
        'dd MMM yyyy, HH:mm', 
        { locale: ru }
      );
      
      users.push({
        ...shuffled[i],
        downloadedAt,
      });
    }
    
    return users.sort((a, b) => 
      new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
    );
  };

  const chartData = generateMockChartData();
  const users = generateMockUsers();
  
  // Calculate total downloads from chart data (for demo purposes)
  const totalDownloadsFromChart = chartData.reduce((sum, record) => sum + record.count, 0);

  // Generate mock monthly data
  const generateMonthlyData = () => {
    return [
      { month: 'Янв', downloads: 5 },
      { month: 'Фев', downloads: 8 },
      { month: 'Мар', downloads: 12 },
      { month: 'Апр', downloads: 15 },
      { month: 'Май', downloads: 10 },
      { month: 'Июн', downloads: 7 },
    ];
  };

  const monthlyData = generateMonthlyData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Статистика скачиваний
        </CardTitle>
        <CardDescription>
          Данные о скачиваниях артефакта пользователями
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="timeline">График</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-md flex flex-col items-center justify-center space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Всего скачиваний
                </h3>
                <p className="text-3xl font-bold">{artifact.downloadCount}</p>
              </div>
              <div className="p-4 border rounded-md flex flex-col items-center justify-center space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  За 14 дней
                </h3>
                <p className="text-3xl font-bold">{totalDownloadsFromChart}</p>
              </div>
            </div>

            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none',
                    }}
                  />
                  <Bar 
                    dataKey="downloads" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Распределение по уровням</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>Уровень 1: Основы бизнеса</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">42%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                        <span>Уровень 2: Маркетинг</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">25%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Уровень 3: Финансы</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">18%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>Уровень 4: Стратегия</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">15%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="pt-4">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Динамика скачиваний за последние 14 дней</h3>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 12 }} 
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} скачиваний`, 'Количество']}
                    contentStyle={{ 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary)/0.2)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>Статистика обновляется ежедневно в полночь по московскому времени.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="pt-4">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Пользователи, скачавшие артефакт</h3>
            </div>

            {users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead className="text-right">Дата скачивания</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.role === 'admin' ? (
                          <span className="text-blue-500 text-xs">Администратор</span>
                        ) : (
                          <span className="text-green-500 text-xs">Пользователь</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{user.downloadedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">Нет данных о скачиваниях пользователями</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 