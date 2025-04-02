'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';

interface CompletionCriteriaFormProps {
  form: UseFormReturn<any>;
  videoCount: number;
  testCount: number;
}

const CompletionCriteriaForm = ({ form, videoCount, testCount }: CompletionCriteriaFormProps) => {
  // Ensure completion criteria doesn't exceed available content
  useEffect(() => {
    const currentVideosRequired = form.getValues('completionCriteria.videosRequired');
    const currentTestsRequired = form.getValues('completionCriteria.testsRequired');
    
    if (currentVideosRequired > videoCount) {
      form.setValue('completionCriteria.videosRequired', videoCount);
    }
    
    if (currentTestsRequired > testCount) {
      form.setValue('completionCriteria.testsRequired', testCount);
    }
  }, [form, videoCount, testCount]);
  
  return (
    <Card className="bg-background">
      <CardContent className="p-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">Критерии завершения уровня</h3>
            <p className="text-sm text-muted-foreground">
              Укажите, сколько видео и тестов необходимо пройти для завершения уровня
            </p>
          </div>
          
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="completionCriteria.videosRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Необходимо просмотреть видео</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={videoCount}
                      placeholder="Количество видео"
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value)) {
                          field.onChange(0);
                        } else if (value > videoCount) {
                          field.onChange(videoCount);
                        } else {
                          field.onChange(value);
                        }
                      }}
                      value={field.value === undefined ? 0 : field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Максимум: {videoCount} {videoCount === 1 ? 'видео' : 'видео'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="completionCriteria.testsRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Необходимо пройти тестов</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={testCount}
                      placeholder="Количество тестов"
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value)) {
                          field.onChange(0);
                        } else if (value > testCount) {
                          field.onChange(testCount);
                        } else {
                          field.onChange(value);
                        }
                      }}
                      value={field.value === undefined ? 0 : field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Максимум: {testCount} {testCount === 1 ? 'тест' : testCount > 1 && testCount < 5 ? 'теста' : 'тестов'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Текущие критерии:</p>
            <ul className="list-disc list-inside mt-1">
              <li>
                Видео: {form.watch('completionCriteria.videosRequired') || 0} из {videoCount}
              </li>
              <li>
                Тесты: {form.watch('completionCriteria.testsRequired') || 0} из {testCount}
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionCriteriaForm; 