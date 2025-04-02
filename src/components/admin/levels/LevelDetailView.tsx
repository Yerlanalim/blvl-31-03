'use client';

import { useState } from 'react';
import { Level, SkillType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import LevelFormDialog from './LevelFormDialog';
import DeleteLevelDialog from './DeleteLevelDialog';

interface LevelDetailViewProps {
  level: Level;
  onEdit?: () => void;
  onDelete?: () => void;
}

const LevelDetailView = ({ level, onEdit, onDelete }: LevelDetailViewProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>{level.title}</CardTitle>
            <CardDescription>
              Уровень {level.order}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={() => setIsFormDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
              <span>Редактировать</span>
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              className="gap-1"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span>Удалить</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="general">Основная информация</TabsTrigger>
              <TabsTrigger value="videos">Видео ({level.videoContent?.length || 0})</TabsTrigger>
              <TabsTrigger value="tests">Тесты ({level.tests?.length || 0})</TabsTrigger>
              <TabsTrigger value="artifacts">Артефакты ({level.relatedArtifactIds?.length || 0})</TabsTrigger>
            </TabsList>
            
            {/* General Info */}
            <TabsContent value="general" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Описание</h3>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Навыки</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {level.skillFocus.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skillTranslations[skill] || skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Критерии завершения</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                  <li>Видео: {level.completionCriteria.videosRequired} из {level.videoContent.length}</li>
                  <li>Тесты: {level.completionCriteria.testsRequired} из {level.tests.length}</li>
                </ul>
              </div>
            </TabsContent>
            
            {/* Videos */}
            <TabsContent value="videos">
              {level.videoContent.length === 0 ? (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-muted-foreground">Для этого уровня не добавлено ни одного видео</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {level.videoContent.map((video, index) => (
                    <Card key={video.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">{video.title}</CardTitle>
                        <CardDescription>
                          Длительность: {video.duration} мин.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center text-sm">
                          {/* If we want to show an actual video preview, use an iframe */}
                          <p className="text-muted-foreground">
                            Предпросмотр видео: <a href={video.url} target="_blank" rel="noopener noreferrer" className="underline text-primary">{video.url}</a>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Tests */}
            <TabsContent value="tests">
              {level.tests.length === 0 ? (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-muted-foreground">Для этого уровня не добавлено ни одного теста</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {level.tests.map((test, index) => (
                    <AccordionItem key={test.id} value={test.id}>
                      <AccordionTrigger className="text-base font-medium">
                        {test.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 py-2">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Вопросы ({test.questions.length})</h4>
                            {test.questions.map((question, qIndex) => (
                              <div key={question.id} className="mb-4 last:mb-0">
                                <div className="bg-muted/50 p-3 rounded-md">
                                  <p className="font-medium text-sm">Вопрос {qIndex + 1}: {question.text}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Тип: {
                                      question.type === 'single-choice' ? 'Один вариант' :
                                      question.type === 'multiple-choice' ? 'Несколько вариантов' :
                                      'Текстовый ответ'
                                    }
                                  </p>
                                  
                                  {question.options && question.options.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-muted-foreground">Варианты ответов:</p>
                                      <ul className="list-disc list-inside text-xs ml-2 mt-1">
                                        {question.options.map((option, oIndex) => (
                                          <li key={oIndex} className="mb-1">
                                            <span className={
                                              question.type === 'multiple-choice' 
                                                ? Array.isArray(question.correctAnswer) && question.correctAnswer.includes(oIndex.toString())
                                                  ? 'text-green-600 font-medium'
                                                  : ''
                                                : question.correctAnswer === oIndex.toString()
                                                  ? 'text-green-600 font-medium'
                                                  : ''
                                            }>
                                              {option}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {question.type === 'text' && (
                                    <div className="mt-2">
                                      <p className="text-xs text-muted-foreground">Правильный ответ:</p>
                                      <p className="text-xs ml-2 mt-1 text-green-600">{question.correctAnswer}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>
            
            {/* Artifacts */}
            <TabsContent value="artifacts">
              {level.relatedArtifactIds?.length === 0 ? (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-muted-foreground">К этому уровню не привязано ни одного артефакта</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Связанные артефакты (IDs):
                  </p>
                  <ul className="list-disc list-inside ml-2">
                    {level.relatedArtifactIds?.map((artifactId) => (
                      <li key={artifactId} className="text-sm">
                        {artifactId}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4">
                    Для просмотра полной информации об артефактах перейдите в раздел управления артефактами.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <p className="text-xs text-muted-foreground">
            ID: {level.id}
          </p>
        </CardFooter>
      </Card>
      
      {/* Dialogs */}
      <LevelFormDialog 
        level={level}
        open={isFormDialogOpen}
        onOpenChange={(open) => {
          setIsFormDialogOpen(open);
          if (!open && onEdit) onEdit();
        }}
      />
      
      <DeleteLevelDialog
        level={level}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open && onDelete) onDelete();
        }}
      />
    </>
  );
};

export default LevelDetailView; 