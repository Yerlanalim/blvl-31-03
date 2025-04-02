'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLevel } from '@/hooks/useLevels';
import { useProgress, useCompleteLevel, useMarkVideoWatched, useMarkTestCompleted, useMarkArtifactDownloaded } from '@/hooks/useProgress';
import { useNextLevel } from '@/hooks/useLevels';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Video, FileText, Download, CheckSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { VideoSection, TestSection, ArtifactSection, CompleteLevelButton, CompletionDialog } from '@/components/features/Level';

export default function LevelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = params.levelId as string;
  
  // Состояние для диалогового окна завершения уровня
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  
  // Получаем данные об уровне и прогрессе
  const { level, isLoading: isLevelLoading, error: levelError } = useLevel(levelId);
  const { 
    progress, 
    isLoading: isProgressLoading, 
    isVideoWatched, 
    isTestCompleted, 
    isArtifactDownloaded,
    canCompleteLevelCheck
  } = useProgress();
  const { nextLevel, isLoading: isNextLevelLoading } = useNextLevel(levelId);
  const { completeCurrentLevel, isPending: isCompletingLevel } = useCompleteLevel();
  const { markAsWatched, isPending: isMarkingVideoWatched } = useMarkVideoWatched();
  const { markAsCompleted, isPending: isMarkingTestCompleted } = useMarkTestCompleted();
  const { markAsDownloaded, isPending: isMarkingArtifactDownloaded } = useMarkArtifactDownloaded();

  const isLoading = isLevelLoading || isProgressLoading;

  // Обработка ошибок
  useEffect(() => {
    if (levelError) {
      toast.error('Ошибка при загрузке уровня', { 
        description: 'Не удалось загрузить данные уровня. Пожалуйста, попробуйте позже.',
        duration: 5000
      });
    }
  }, [levelError]);

  // Функция возврата на карту уровней
  const handleBackToMap = () => {
    router.push('/map');
  };

  // Обработчик завершения уровня
  const handleCompleteLevel = (levelId: string, nextLevelId: string) => {
    completeCurrentLevel(
      { levelId, nextLevelId },
      {
        onSuccess: () => {
          // Открываем диалоговое окно с поздравлением
          setCompletionDialogOpen(true);
        },
        onError: (error) => {
          toast.error('Ошибка при завершении уровня', { 
            description: (error as Error).message,
            duration: 5000
          });
        }
      }
    );
  };

  // Обработчик отметки видео как просмотренного
  const handleMarkVideoWatched = (videoId: string) => {
    if (isMarkingVideoWatched) return;
    
    markAsWatched(videoId, {
      onSuccess: () => {
        toast.success('Видео отмечено как просмотренное');
      },
      onError: (error) => {
        toast.error(`Ошибка при отметке видео: ${(error as Error).message}`);
      }
    });
  };

  // Обработчик отметки теста как пройденного
  const handleMarkTestCompleted = (testId: string) => {
    if (isMarkingTestCompleted) return;
    
    markAsCompleted(testId, {
      onSuccess: () => {
        toast.success('Тест успешно пройден!');
      },
      onError: (error) => {
        toast.error(`Ошибка при прохождении теста: ${(error as Error).message}`);
      }
    });
  };

  // Обработчик отметки артефакта как скачанного
  const handleMarkArtifactDownloaded = (artifactId: string) => {
    if (isMarkingArtifactDownloaded) return;
    
    markAsDownloaded(artifactId, {
      onSuccess: () => {
        // Toast теперь отображается внутри ArtifactSection
      },
      onError: (error) => {
        toast.error(`Ошибка при скачивании артефакта: ${(error as Error).message}`);
      }
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex flex-col gap-6">
        {/* Кнопка возврата на карту уровней */}
        <Button 
          variant="ghost" 
          className="self-start flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          onClick={handleBackToMap}
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться к карте уровней
        </Button>

        {/* Заголовок и описание уровня */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : level ? (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold">{level.title}</h1>
              <Badge variant="outline" className="bg-primary/10">Уровень {level.order}</Badge>
            </div>
            
            <p className="text-muted-foreground mb-3">{level.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {level.skillFocus.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm mb-6">
              <p className="font-medium mb-1">Критерии завершения уровня:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Просмотреть минимум {level.completionCriteria.videosRequired} видео</li>
                <li>Пройти минимум {level.completionCriteria.testsRequired} тестов</li>
              </ul>
            </div>
          </div>
        ) : null}

        {/* Содержимое уровня */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : level ? (
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Видео ({level.videoContent.length})</span>
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Тесты ({level.tests.length})</span>
              </TabsTrigger>
              <TabsTrigger value="artifacts" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Материалы ({level.relatedArtifactIds.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Секция видео */}
            <TabsContent value="videos">
              <VideoSection
                videos={level.videoContent}
                watchedVideoIds={progress?.watchedVideoIds || []}
                onVideoWatch={handleMarkVideoWatched}
                isMarkingWatched={isMarkingVideoWatched}
              />
            </TabsContent>

            {/* Секция тестов */}
            <TabsContent value="tests">
              <TestSection
                tests={level.tests}
                completedTestIds={progress?.completedTestIds || []}
                onTestComplete={handleMarkTestCompleted}
                isMarkingCompleted={isMarkingTestCompleted}
              />
            </TabsContent>

            {/* Секция артефактов */}
            <TabsContent value="artifacts">
              <ArtifactSection
                artifactIds={level.relatedArtifactIds}
                downloadedArtifactIds={progress?.downloadedArtifactIds || []}
                onArtifactDownload={handleMarkArtifactDownloaded}
                isDownloading={isMarkingArtifactDownloaded}
              />
            </TabsContent>
          </Tabs>
        ) : null}

        {/* Кнопка завершения уровня */}
        {level && !isLoading && (
          <CompleteLevelButton
            levelId={levelId}
            level={level}
            userProgress={progress}
            onCompleteLevel={handleCompleteLevel}
            nextLevel={nextLevel}
            isPending={isCompletingLevel}
            canCompleteLevelCheck={canCompleteLevelCheck}
          />
        )}

        {/* Диалоговое окно завершения уровня */}
        {level && nextLevel && (
          <CompletionDialog
            open={completionDialogOpen}
            onOpenChange={setCompletionDialogOpen}
            completedLevel={level}
            nextLevel={nextLevel}
          />
        )}
      </div>
    </div>
  );
} 