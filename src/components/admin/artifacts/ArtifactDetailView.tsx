'use client';

import React, { useState } from 'react';
import { Artifact } from '@/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Badge,
  Button,
  Separator,
} from '@/components/ui/';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  FileText,
  Download,
  RotateCcw,
  Edit,
  Trash2,
  Calendar,
  Tag,
  School,
  ArrowUpRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { ArtifactFormDialog } from './ArtifactFormDialog';
import { DeleteArtifactDialog } from './DeleteArtifactDialog';
import { useAdminLevels } from '@/hooks/useAdminLevels';
import { DownloadStatsView } from './DownloadStatsView';

interface ArtifactDetailViewProps {
  artifact: Artifact;
  onEdit: (artifact: Artifact) => void;
  onDelete: (artifact: Artifact) => void;
  onResetDownloadCount: (artifactId: string) => void;
  onBack: () => void;
}

export function ArtifactDetailView({
  artifact,
  onEdit,
  onDelete,
  onResetDownloadCount,
  onBack,
}: ArtifactDetailViewProps) {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: levels } = useAdminLevels();

  // Find the level by ID
  const level = levels?.find(l => l.id === artifact.levelId);

  // Format the date
  const formattedDate = format(
    new Date(artifact.uploadedAt),
    'dd MMMM yyyy, HH:mm',
    { locale: ru }
  );

  // Get file type display information
  const getFileTypeInfo = (fileType: string) => {
    if (fileType.includes('pdf')) return { label: 'PDF документ', color: 'red' };
    if (fileType.includes('word') || fileType.includes('doc')) return { label: 'Word документ', color: 'blue' };
    if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('xls')) 
      return { label: 'Excel таблица', color: 'green' };
    if (fileType.includes('presentation') || fileType.includes('powerpoint') || fileType.includes('ppt')) 
      return { label: 'PowerPoint презентация', color: 'orange' };
    if (fileType.includes('image')) return { label: 'Изображение', color: 'purple' };
    if (fileType.includes('zip') || fileType.includes('archive')) return { label: 'Архив', color: 'yellow' };
    
    return { label: fileType.split('/')[1] || 'Файл', color: 'gray' };
  };

  const fileTypeInfo = getFileTypeInfo(artifact.fileType);

  // Handle edit
  const handleEdit = () => {
    setIsFormDialogOpen(true);
  };

  // Handle delete
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          ← Назад к списку
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{artifact.title}</CardTitle>
                  <CardDescription>
                    Детальная информация об артефакте
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Редактировать</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Удалить</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Описание</h3>
                <p>{artifact.description}</p>
              </div>

              <div className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Загружен: {formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Имя файла: {artifact.fileName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`border-${fileTypeInfo.color}-500/50`}
                      >
                        {fileTypeInfo.label}
                      </Badge>
                    </div>

                    {artifact.tags && artifact.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {artifact.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Уровень: {level ? level.title : 'Не указан'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Скачиваний: <strong>{artifact.downloadCount}</strong>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onResetDownloadCount(artifact.id)}
                        title="Сбросить счетчик скачиваний"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {artifact.isPublic ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {artifact.isPublic ? 'Публичный доступ' : 'Приватный доступ'}
                      </span>
                    </div>

                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => window.open(artifact.downloadUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                        Скачать файл
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {artifact.tags && artifact.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Теги</h3>
                  <div className="flex flex-wrap gap-2">
                    {artifact.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview card for PDF files */}
          {artifact.fileType.includes('pdf') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Предпросмотр файла</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md h-[500px] bg-muted">
                  <object
                    data={artifact.downloadUrl}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className="rounded-md"
                  >
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">
                        Просмотр PDF недоступен. Скачайте файл.
                      </p>
                    </div>
                  </object>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview for image files */}
          {artifact.fileType.includes('image') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Предпросмотр изображения</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden bg-muted flex items-center justify-center max-h-[500px]">
                  <img
                    src={artifact.downloadUrl}
                    alt={artifact.title}
                    className="max-w-full max-h-[500px] object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <DownloadStatsView artifact={artifact} />
        </div>
      </div>

      {/* Dialogs */}
      <ArtifactFormDialog
        artifact={artifact}
        isOpen={isFormDialogOpen}
        isProcessing={false}
        onSubmit={(data, file) => {
          onEdit(artifact);
          setIsFormDialogOpen(false);
        }}
        onCancel={() => setIsFormDialogOpen(false)}
      />

      <DeleteArtifactDialog
        artifactName={artifact.title}
        isOpen={isDeleteDialogOpen}
        isDeleting={false}
        onDelete={() => {
          onDelete(artifact);
          setIsDeleteDialogOpen(false);
        }}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
} 