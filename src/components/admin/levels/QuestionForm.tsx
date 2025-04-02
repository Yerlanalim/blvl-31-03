'use client';

import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Question } from '@/types';

interface QuestionFormProps {
  form: UseFormReturn<any>;
  testIndex: number;
  questionIndex: number;
  onRemove: () => void;
}

const QuestionForm = ({ form, testIndex, questionIndex, onRemove }: QuestionFormProps) => {
  const basePath = `tests.${testIndex}.questions.${questionIndex}`;
  const questionType = form.watch(`${basePath}.type`);

  // Ensure options exist when switching to choice type questions
  useEffect(() => {
    if ((questionType === 'single-choice' || questionType === 'multiple-choice') && 
        (!form.getValues(`${basePath}.options`) || form.getValues(`${basePath}.options`).length < 2)) {
      form.setValue(`${basePath}.options`, ['', '']);
    }
  }, [questionType, form, basePath]);

  return (
    <Card className="relative mb-4">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <h4 className="text-sm font-medium">Вопрос {questionIndex + 1}</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <FormField
          control={form.control}
          name={`${basePath}.text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Текст вопроса</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Введите текст вопроса"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${basePath}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Тип вопроса</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип вопроса" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single-choice">Один ответ</SelectItem>
                  <SelectItem value="multiple-choice">Несколько ответов</SelectItem>
                  <SelectItem value="text">Текстовый ответ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Options for multiple-choice and single-choice questions */}
        {(questionType === 'multiple-choice' || questionType === 'single-choice') && (
          <div className="space-y-2">
            <FormLabel className="text-xs">Варианты ответов</FormLabel>
            
            {form.getValues(`${basePath}.options`)?.map((_, optionIndex) => (
              <div key={optionIndex} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`${basePath}.options.${optionIndex}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Вариант ${optionIndex + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => {
                    const options = form.getValues(`${basePath}.options`);
                    if (options.length > 2) {
                      const newOptions = [...options];
                      newOptions.splice(optionIndex, 1);
                      form.setValue(`${basePath}.options`, newOptions);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const options = form.getValues(`${basePath}.options`) || [];
                form.setValue(`${basePath}.options`, [...options, '']);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Добавить вариант
            </Button>
          </div>
        )}

        {/* Correct answer field */}
        <FormField
          control={form.control}
          name={`${basePath}.correctAnswer`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Правильный ответ</FormLabel>
              <FormControl>
                {questionType === 'text' ? (
                  <Input
                    placeholder="Введите правильный ответ"
                    {...field}
                  />
                ) : questionType === 'multiple-choice' ? (
                  <div className="space-y-2 border rounded-md p-2">
                    {form.getValues(`${basePath}.options`)?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${basePath}-option-${optionIndex}`}
                          checked={
                            Array.isArray(field.value) && 
                            field.value.includes(optionIndex.toString())
                          }
                          onCheckedChange={(checked) => {
                            const currentValue = Array.isArray(field.value) 
                              ? [...field.value] 
                              : [];
                            
                            if (checked) {
                              if (!currentValue.includes(optionIndex.toString())) {
                                currentValue.push(optionIndex.toString());
                              }
                            } else {
                              const index = currentValue.indexOf(optionIndex.toString());
                              if (index !== -1) {
                                currentValue.splice(index, 1);
                              }
                            }
                            
                            field.onChange(currentValue);
                          }}
                        />
                        <Label htmlFor={`${basePath}-option-${optionIndex}`}>
                          {option || `Вариант ${optionIndex + 1}`}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 border rounded-md p-2">
                    {form.getValues(`${basePath}.options`)?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`${basePath}-option-${optionIndex}`}
                          name={`${basePath}-correctAnswer`}
                          checked={field.value === optionIndex.toString()}
                          onChange={() => field.onChange(optionIndex.toString())}
                          className="h-4 w-4"
                        />
                        <Label htmlFor={`${basePath}-option-${optionIndex}`}>
                          {option || `Вариант ${optionIndex + 1}`}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default QuestionForm; 