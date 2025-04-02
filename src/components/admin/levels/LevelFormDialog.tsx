'use client';

import { useState, useEffect } from 'react';
import { Level, VideoContent, Test, Question, CompletionCriteria, SkillType } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus } from 'lucide-react';
import { useCreateLevel, useUpdateLevel } from '@/hooks/useAdminLevels';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import VideoForm from './VideoForm';
import TestForm from './TestForm';
import ArtifactSelector from './ArtifactSelector';
import CompletionCriteriaForm from './CompletionCriteriaForm';

// Validation schema for level form
const levelFormSchema = z.object({
  title: z.string().min(3, { message: 'Название должно содержать не менее 3 символов' }),
  description: z.string().min(10, { message: 'Описание должно содержать не менее 10 символов' }),
  order: z.number().min(1, { message: 'Порядок должен быть положительным числом' }),
  videoContent: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(3, { message: 'Название видео должно содержать не менее 3 символов' }),
    url: z.string().url({ message: 'Введите корректный URL видео' }),
    duration: z.number().min(0.1, { message: 'Длительность должна быть положительным числом' }),
  })),
  tests: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(3, { message: 'Название теста должно содержать не менее 3 символов' }),
    questions: z.array(z.object({
      id: z.string().optional(),
      text: z.string().min(5, { message: 'Текст вопроса должен содержать не менее 5 символов' }),
      type: z.enum(['multiple-choice', 'single-choice', 'text']),
      options: z.array(z.string()).optional(),
      correctAnswer: z.union([z.string(), z.array(z.string())]),
    })),
  })),
  relatedArtifactIds: z.array(z.string()).default([]),
  skillFocus: z.array(z.nativeEnum(SkillType)).min(1, { message: 'Выберите хотя бы один навык' }),
  completionCriteria: z.object({
    videosRequired: z.number().min(0, { message: 'Число должно быть положительным' }),
    testsRequired: z.number().min(0, { message: 'Число должно быть положительным' }),
  }),
});

type LevelFormValues = z.infer<typeof levelFormSchema>;

interface LevelFormDialogProps {
  level?: Level; // Optional for create mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LevelFormDialog = ({ level, open, onOpenChange }: LevelFormDialogProps) => {
  const [activeTab, setActiveTab] = useState('general');
  
  const isEditMode = !!level;
  
  // Hooks for create/update
  const { mutate: createLevel, isPending: isCreating } = useCreateLevel();
  const { mutate: updateLevel, isPending: isUpdating } = useUpdateLevel();
  
  const isPending = isCreating || isUpdating;
  
  // Initialize form with default values or existing level data
  const form = useForm<LevelFormValues>({
    resolver: zodResolver(levelFormSchema),
    defaultValues: {
      title: level?.title || '',
      description: level?.description || '',
      order: level?.order || 1,
      videoContent: level?.videoContent || [],
      tests: level?.tests || [],
      relatedArtifactIds: level?.relatedArtifactIds || [],
      skillFocus: level?.skillFocus || [],
      completionCriteria: level?.completionCriteria || {
        videosRequired: 0,
        testsRequired: 0,
      },
    },
  });
  
  // Field arrays for videos and tests
  const { fields: videoFields, append: appendVideo, remove: removeVideo } = 
    useFieldArray({
      control: form.control,
      name: 'videoContent',
    });
  
  const { fields: testFields, append: appendTest, remove: removeTest } = 
    useFieldArray({
      control: form.control,
      name: 'tests',
    });
  
  // Handle form submission
  const onSubmit = (data: LevelFormValues) => {
    if (isEditMode && level) {
      updateLevel(
        { 
          levelId: level.id, 
          levelData: data 
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        }
      );
    } else {
      createLevel(
        data,
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        }
      );
    }
  };
  
  // Add a new empty video
  const handleAddVideo = () => {
    appendVideo({
      title: '',
      url: '',
      duration: 0,
    });
  };
  
  // Add a new empty test
  const handleAddTest = () => {
    appendTest({
      title: '',
      questions: [],
    });
  };
  
  // Get current video and test counts for completion criteria
  const videoCount = form.watch('videoContent').length;
  const testCount = form.watch('tests').length;
  
  // Translate skill types
  const skillTranslations: Record<SkillType, string> = {
    [SkillType.Marketing]: 'Маркетинг',
    [SkillType.Finance]: 'Финансы',
    [SkillType.Management]: 'Управление',
    [SkillType.Leadership]: 'Лидерство',
    [SkillType.Communication]: 'Коммуникация',
    [SkillType.Sales]: 'Продажи'
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!isPending) {
        onOpenChange(open);
        if (!open) {
          form.reset();
          setActiveTab('general');
        }
      }
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>
            {isEditMode ? 'Редактировать уровень' : 'Создать новый уровень'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Редактирование уровня "${level.title}"`
              : 'Заполните форму для создания нового уровня'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="general">Основные данные</TabsTrigger>
                <TabsTrigger value="videos">Видео {videoFields.length > 0 && `(${videoFields.length})`}</TabsTrigger>
                <TabsTrigger value="tests">Тесты {testFields.length > 0 && `(${testFields.length})`}</TabsTrigger>
                <TabsTrigger value="criteria">Критерии</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <ScrollArea className="px-6 pb-6 max-h-[60vh]">
              {/* General Tab */}
              <TabsContent value="general" className="space-y-4 mt-0">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название уровня</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите название уровня" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Введите описание уровня" 
                          {...field} 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Порядок</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          placeholder="Порядковый номер уровня" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Порядковый номер определяет положение уровня в списке
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="skillFocus"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>Навыки</FormLabel>
                        <FormDescription>
                          Выберите навыки, на которые направлен этот уровень
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.values(SkillType).map((skill) => (
                          <FormField
                            key={skill}
                            control={form.control}
                            name="skillFocus"
                            render={({ field }) => {
                              return (
                                <FormItem key={skill} className="flex items-start space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(skill)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, skill])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== skill
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <Label className="text-sm leading-none pt-0.5">
                                    {skillTranslations[skill] || skill}
                                  </Label>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* Videos Tab */}
              <TabsContent value="videos" className="space-y-6 mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Видео-контент уровня</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddVideo}
                    size="sm"
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Добавить видео
                  </Button>
                </div>
                
                {videoFields.length === 0 ? (
                  <div className="text-center p-6 border rounded-md">
                    <p className="text-muted-foreground">Нет добавленных видео</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddVideo}
                      size="sm"
                      className="mt-2"
                    >
                      Добавить первое видео
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videoFields.map((field, index) => (
                      <VideoForm 
                        key={field.id}
                        form={form}
                        index={index}
                        onRemove={() => removeVideo(index)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Tests Tab */}
              <TabsContent value="tests" className="space-y-6 mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Тесты уровня</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddTest}
                    size="sm"
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Добавить тест
                  </Button>
                </div>
                
                {testFields.length === 0 ? (
                  <div className="text-center p-6 border rounded-md">
                    <p className="text-muted-foreground">Нет добавленных тестов</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddTest}
                      size="sm"
                      className="mt-2"
                    >
                      Добавить первый тест
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {testFields.map((field, index) => (
                      <TestForm 
                        key={field.id}
                        form={form}
                        index={index}
                        onRemove={() => removeTest(index)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Criteria Tab */}
              <TabsContent value="criteria" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Связанные артефакты</h3>
                    <ArtifactSelector form={form} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Критерии завершения</h3>
                    <CompletionCriteriaForm
                      form={form}
                      videoCount={videoCount}
                      testCount={testCount}
                    />
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
            
            <DialogFooter className="px-6 py-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? 'Сохранение...' : 'Создание...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Сохранить изменения' : 'Создать уровень'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LevelFormDialog; 