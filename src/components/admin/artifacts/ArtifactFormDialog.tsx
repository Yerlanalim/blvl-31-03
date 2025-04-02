import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, School, Info } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { useAdminLevels } from '@/hooks/useAdminLevels';
import { Artifact } from '@/types';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Schema for artifact form validation
const artifactFormSchema = z.object({
  title: z.string().min(3, 'Название должно содержать минимум 3 символа').max(100, 'Название слишком длинное'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов').max(500, 'Описание слишком длинное'),
  levelId: z.string().min(1, 'Необходимо выбрать уровень'),
  tags: z.string().optional(),
});

type ArtifactFormValues = z.infer<typeof artifactFormSchema>;

interface ArtifactFormDialogProps {
  artifact?: Artifact;
  isOpen: boolean;
  isProcessing: boolean;
  uploadProgress?: number;
  onSubmit: (data: ArtifactFormValues, file: File) => void;
  onCancel: () => void;
}

export function ArtifactFormDialog({
  artifact,
  isOpen,
  isProcessing,
  uploadProgress = 0,
  onSubmit,
  onCancel,
}: ArtifactFormDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>("basic-info");
  const { data: levels, isLoading: isLoadingLevels } = useAdminLevels();
  
  const isEditMode = !!artifact;
  
  const form = useForm<ArtifactFormValues>({
    resolver: zodResolver(artifactFormSchema),
    defaultValues: {
      title: artifact?.title || '',
      description: artifact?.description || '',
      levelId: artifact?.levelId || '',
      tags: artifact?.tags?.join(', ') || '',
    },
  });
  
  // Reset form when artifact changes
  useEffect(() => {
    if (artifact) {
      form.reset({
        title: artifact.title,
        description: artifact.description,
        levelId: artifact.levelId,
        tags: artifact.tags?.join(', ') || '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        levelId: '',
        tags: '',
      });
    }
    setSelectedFile(null);
  }, [artifact, form]);
  
  const handleSubmit = (data: ArtifactFormValues) => {
    if (!selectedFile && !isEditMode) {
      form.setError('root', { 
        type: 'manual',
        message: 'Необходимо выбрать файл' 
      });
      setActiveTab("file"); // Switch to file tab to show the error
      return;
    }
    
    // Process the tags before submitting
    const formData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };
    
    if (!selectedFile && isEditMode) {
      // Updating without changing the file
      onSubmit(formData, new File([], ""));
      return;
    }
    
    onSubmit(formData, selectedFile!);
  };
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    form.clearErrors('root');
  };
  
  const handleClearFile = () => {
    setSelectedFile(null);
  };
  
  // Find the level name by ID
  const getLevelName = (levelId: string) => {
    const level = levels?.find(level => level.id === levelId);
    return level ? level.title : '';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onCancel()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{isEditMode ? 'Редактировать артефакт' : 'Создать новый артефакт'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Измените детали артефакта. Загрузка нового файла опциональна.' 
              : 'Заполните форму и загрузите файл для создания нового артефакта.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="overflow-hidden">
            <Tabs 
              defaultValue="basic-info" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic-info" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>Основная информация</span>
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Файл</span>
                  </TabsTrigger>
                  <TabsTrigger value="level" className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    <span>Уровень</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-6">
                <TabsContent value="basic-info" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Основная информация</CardTitle>
                      <CardDescription>
                        Укажите название и описание артефакта
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Название</FormLabel>
                            <FormControl>
                              <Input placeholder="Введите название артефакта" {...field} />
                            </FormControl>
                            <FormDescription>
                              Понятное и информативное название документа
                            </FormDescription>
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
                                placeholder="Введите описание артефакта" 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Подробное описание содержимого документа
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Теги</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="бизнес-план, маркетинг, финансы" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Укажите теги через запятую для облегчения поиска
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="file" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Файл артефакта</CardTitle>
                      <CardDescription>
                        {isEditMode
                          ? 'Загрузите новый файл или оставьте текущий'
                          : 'Загрузите файл артефакта'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileUpload
                        onFileSelect={handleFileSelect}
                        selectedFile={selectedFile}
                        onClear={handleClearFile}
                        isUploading={isProcessing}
                        progress={uploadProgress}
                        maxSizeMB={25}
                      />
                      {form.formState.errors.root && (
                        <p className="text-sm text-destructive mt-2">{form.formState.errors.root.message}</p>
                      )}
                      {isEditMode && !selectedFile && artifact?.fileName && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium">Текущий файл:</p>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4 mr-2" />
                            <span>{artifact.fileName}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Если вы не выберете новый файл, текущий файл останется без изменений.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="level" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Связанный уровень</CardTitle>
                      <CardDescription>
                        Выберите уровень, к которому относится артефакт
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="levelId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Уровень</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={isLoadingLevels}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите уровень" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isLoadingLevels ? (
                                  <div className="p-2 text-center">
                                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                    <p className="text-sm text-muted-foreground mt-2">
                                      Загрузка уровней...
                                    </p>
                                  </div>
                                ) : (
                                  levels?.map((level) => (
                                    <SelectItem key={level.id} value={level.id}>
                                      {level.title}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {field.value && !isLoadingLevels ? (
                                <span className="text-muted-foreground">
                                  Выбран уровень: <strong>{getLevelName(field.value)}</strong>
                                </span>
                              ) : (
                                "Выберите уровень обучения, к которому относится данный артефакт"
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
            
            <DialogFooter className="px-6 py-4 border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab(activeTab === "basic-info" ? "file" : activeTab === "file" ? "level" : "basic-info")}
                    size="sm"
                    className="text-xs"
                  >
                    {activeTab === "level" ? "В начало" : "Далее"}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel} 
                    disabled={isProcessing}
                    size="sm"
                  >
                    Отмена
                  </Button>
                  <Button type="submit" disabled={isProcessing} className="gap-2 min-w-[120px]">
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isEditMode ? 'Сохранение...' : 'Создание...'}
                      </>
                    ) : (
                      isEditMode ? 'Сохранить' : 'Создать'
                    )}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 