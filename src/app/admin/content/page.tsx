'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function AdminContentPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2 mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Вернуться
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Управление контентом</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Функциональность управления образовательным контентом будет реализована в следующих этапах проекта.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}