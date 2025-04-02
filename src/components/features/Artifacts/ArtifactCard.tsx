'use client';

import { Artifact } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Download, 
  CheckCircle2,
  Loader2,
  File, 
  FileText, 
  FileSpreadsheet, 
  FileCode 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Функция для определения иконки на основе типа файла
const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return File;
  if (type.includes('doc')) return FileText;
  if (type.includes('xls') || type.includes('sheet')) return FileSpreadsheet;
  return FileCode;
};

interface ArtifactCardProps {
  artifact: Artifact;
  onDownload: () => void;
  isDownloaded: boolean;
  layout?: 'grid' | 'list';
  isDownloading?: boolean;
}

export function ArtifactCard({ 
  artifact, 
  onDownload, 
  isDownloaded,
  layout = 'grid',
  isDownloading = false
}: ArtifactCardProps) {
  const { title, description, fileName, fileType, levelId, downloadCount, uploadedAt } = artifact;
  const FileIcon = getFileIcon(fileType);
  
  const formatLevelName = (levelId: string) => {
    const match = levelId.match(/level-(\d+)/i);
    return match ? `Уровень ${match[1]}` : levelId;
  };
  
  // Определяем классы для разных режимов отображения
  const cardClasses = layout === 'grid' 
    ? 'h-full flex flex-col' 
    : 'flex flex-col md:flex-row md:items-center';
  
  const contentClasses = layout === 'grid' 
    ? 'flex-1' 
    : 'md:flex-1';
  
  const footerClasses = layout === 'grid' 
    ? 'border-t' 
    : 'md:w-40 md:border-l md:border-t-0 md:justify-center';

  return (
    <Card className={cardClasses}>
      <CardHeader className={layout === 'list' ? 'md:w-80' : ''}>
        <div className="flex items-center space-x-2">
          <FileIcon className="h-6 w-6 text-primary" />
          <div>
            <Badge variant="outline" className="text-xs">
              {fileType.toUpperCase()}
            </Badge>
          </div>
        </div>
        <CardTitle className="mt-2 line-clamp-1">{title}</CardTitle>
        <CardDescription>
          {formatLevelName(levelId)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className={contentClasses}>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Имя файла:</span>
            <span className="font-medium truncate ml-2 max-w-[150px]">{fileName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Загружен:</span>
            <span className="font-medium">{formatDate(uploadedAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Скачиваний:</span>
            <span className="font-medium">{downloadCount}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={`justify-end p-4 ${footerClasses}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onDownload}
                variant={isDownloaded ? "outline" : "default"}
                disabled={isDownloaded || isDownloading}
                className="w-full"
              >
                {isDownloaded ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> 
                    Скачано
                  </>
                ) : isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" /> 
                    Скачать
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isDownloaded && (
              <TooltipContent>
                <p>Вы уже скачали этот артефакт</p>
              </TooltipContent>
            )}
            {isDownloading && (
              <TooltipContent>
                <p>Скачивание артефакта...</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
} 