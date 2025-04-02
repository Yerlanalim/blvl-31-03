'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import QuestionForm from './QuestionForm';

interface TestFormProps {
  form: UseFormReturn<any>;
  index: number;
  onRemove: () => void;
}

const TestForm = ({ form, index, onRemove }: TestFormProps) => {
  const [expanded, setExpanded] = useState(false);

  // Field array for questions within this test
  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } =
    useFieldArray({
      control: form.control,
      name: `tests.${index}.questions`,
    });

  const handleAddQuestion = () => {
    appendQuestion({
      text: '',
      type: 'single-choice',
      options: ['', ''],
      correctAnswer: '',
    });
  };

  return (
    <Card className="relative mb-6">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <h4 className="text-sm font-medium">Тест {index + 1}</h4>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <FormField
          control={form.control}
          name={`tests.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Название теста</FormLabel>
              <FormControl>
                <Input placeholder="Введите название теста" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {expanded && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-sm font-medium">Вопросы</h5>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddQuestion}
                className="gap-1"
              >
                <Plus className="h-3 w-3" />
                Добавить вопрос
              </Button>
            </div>

            {questionFields.length === 0 ? (
              <div className="text-center p-3 border rounded-md">
                <p className="text-xs text-muted-foreground">
                  Нет вопросов. Нажмите кнопку выше, чтобы добавить.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {questionFields.map((field, qIndex) => (
                  <QuestionForm
                    key={field.id}
                    form={form}
                    testIndex={index}
                    questionIndex={qIndex}
                    onRemove={() => removeQuestion(qIndex)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-2">
        <div className="w-full flex justify-between text-xs text-muted-foreground">
          <span>
            {questionFields.length} {questionFields.length === 1 ? 'вопрос' : 
                                  questionFields.length > 1 && questionFields.length < 5 ? 'вопроса' : 'вопросов'}
          </span>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Свернуть' : 'Развернуть'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestForm; 