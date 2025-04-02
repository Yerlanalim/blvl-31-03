import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUp, File, X, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  maxSizeMB?: number;
  accept?: Record<string, string[]>;
  isUploading?: boolean;
  progress?: number;
}

// File type definitions for better UX messaging
const FILE_TYPES = {
  'application/pdf': {
    label: 'PDF документ',
    icon: '📄',
    extensions: ['.pdf'],
    previewable: true
  },
  'application/msword': {
    label: 'Microsoft Word документ',
    icon: '📝',
    extensions: ['.doc'],
    previewable: false
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    label: 'Microsoft Word документ',
    icon: '📝',
    extensions: ['.docx'],
    previewable: false
  },
  'application/vnd.ms-excel': {
    label: 'Microsoft Excel таблица',
    icon: '📊',
    extensions: ['.xls'],
    previewable: false
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    label: 'Microsoft Excel таблица',
    icon: '📊',
    extensions: ['.xlsx'],
    previewable: false
  },
  'application/vnd.ms-powerpoint': {
    label: 'Microsoft PowerPoint презентация',
    icon: '📑',
    extensions: ['.ppt'],
    previewable: false
  },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
    label: 'Microsoft PowerPoint презентация',
    icon: '📑',
    extensions: ['.pptx'],
    previewable: false
  },
  'image/jpeg': {
    label: 'JPEG изображение',
    icon: '🖼️',
    extensions: ['.jpg', '.jpeg'],
    previewable: true
  },
  'image/png': {
    label: 'PNG изображение',
    icon: '🖼️',
    extensions: ['.png'],
    previewable: true
  },
  'application/zip': {
    label: 'ZIP архив',
    icon: '📦',
    extensions: ['.zip'],
    previewable: false
  },
};

export function FileUpload({
  onFileSelect,
  selectedFile,
  onClear,
  maxSizeMB = 10, // Default max size 10MB
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/zip': ['.zip'],
  },
  isUploading = false,
  progress = 0,
}: FileUploadProps) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validationType, setValidationType] = useState<'success' | 'error' | null>(null);

  // Create preview URL for image and PDF files
  useEffect(() => {
    if (selectedFile) {
      const fileType = selectedFile.type;
      
      // Find supported preview types
      const isPreviewable = FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.previewable || false;
      
      if (isPreviewable) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        setShowPreview(true);
        
        return () => {
          URL.revokeObjectURL(url);
        };
      } else {
        setPreviewUrl(null);
        setShowPreview(false);
      }
    } else {
      setPreviewUrl(null);
      setShowPreview(false);
    }
  }, [selectedFile]);
  
  // Validate file type more thoroughly
  const validateFileType = (file: File): boolean => {
    // Check if the file's MIME type is in our accept list
    if (!Object.keys(accept).some(mimeType => file.type === mimeType)) {
      const allowedExtensions = Object.values(accept).flat().join(', ');
      setFileError(`Неподдерживаемый тип файла. Разрешены следующие типы: ${allowedExtensions}`);
      setValidationType('error');
      return false;
    }
    
    setValidationType('success');
    return true;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          setFileError(`Файл слишком большой. Максимальный размер: ${maxSizeMB}MB`);
          setValidationType('error');
          return;
        }
        
        // Validate file type
        if (validateFileType(file)) {
          setFileError(null);
          onFileSelect(file);
        }
      }
    },
    [maxSizeMB, onFileSelect, accept]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept,
  });

  const getFileIcon = (fileName: string) => {
    if (!fileName) return '📄';
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    for (const [mimeType, details] of Object.entries(FILE_TYPES)) {
      const fileTypeDetails = details as typeof FILE_TYPES[keyof typeof FILE_TYPES];
      if (fileTypeDetails.extensions.some(ext => ext.endsWith(extension || ''))) {
        return fileTypeDetails.icon;
      }
    }
    return '📄';
  };

  const getFileTypeLabel = (fileName: string) => {
    if (!fileName) return 'Файл';
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    for (const [mimeType, details] of Object.entries(FILE_TYPES)) {
      const fileTypeDetails = details as typeof FILE_TYPES[keyof typeof FILE_TYPES];
      if (fileTypeDetails.extensions.some(ext => ext.endsWith(extension || ''))) {
        return fileTypeDetails.label;
      }
    }
    return 'Файл';
  };

  const getFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border'
          } ${fileError ? 'border-destructive bg-destructive/5' : ''}`}
        >
          <input {...getInputProps()} />
          <CloudUp className={`h-10 w-10 mx-auto mb-2 ${fileError ? 'text-destructive' : 'text-muted-foreground'}`} />
          <p className="text-sm">
            {isDragActive
              ? 'Перетащите файл сюда...'
              : 'Перетащите файл сюда или нажмите для выбора'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Поддерживаемые форматы: PDF, Word, Excel, PowerPoint, изображения, ZIP
          </p>
          <p className="text-xs text-muted-foreground">
            Максимальный размер: {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getFileIcon(selectedFile.name)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    {validationType === 'success' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <span>{getFileTypeLabel(selectedFile.name)}</span>
                    <span>•</span>
                    <span>{getFileSize(selectedFile.size)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {previewUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="h-8 px-2 gap-1"
                  >
                    {showPreview ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:text-xs">Скрыть</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:text-xs">Просмотр</span>
                      </>
                    )}
                  </Button>
                )}
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    disabled={isUploading}
                    className="h-8 px-2 text-destructive"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:text-xs">Удалить</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Preview section for images and PDFs */}
          {showPreview && previewUrl && (
            <div className="border-t">
              {selectedFile.type.startsWith('image/') ? (
                <div className="aspect-video flex items-center justify-center bg-muted overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt={selectedFile.name} 
                    className="max-w-full max-h-[300px] object-contain" 
                  />
                </div>
              ) : selectedFile.type === 'application/pdf' && (
                <div className="h-[300px] bg-muted">
                  <object
                    data={previewUrl}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className="border-0"
                  >
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-sm">
                        Просмотр PDF недоступен. <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">Открыть в новой вкладке</a>
                      </p>
                    </div>
                  </object>
                </div>
              )}
            </div>
          )}
          
          {isUploading && (
            <div className="p-4 pt-0 border-t">
              <Progress value={progress} className="h-2 mt-4" />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Загрузка файла...
                </p>
                <p className="text-xs font-medium">
                  {progress}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {fileError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
      
      {/* Show supported file types as a hover card */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" size="sm" className="p-0 h-auto text-xs text-muted-foreground">
            Поддерживаемые типы файлов
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Поддерживаемые форматы файлов:</h4>
            <ul className="text-xs space-y-1">
              {Object.entries(FILE_TYPES).map(([mimeType, details], index) => {
                const fileTypeDetails = details as typeof FILE_TYPES[keyof typeof FILE_TYPES];
                return (
                  <li key={index} className="flex items-center gap-2">
                    <span>{fileTypeDetails.icon}</span>
                    <span>{fileTypeDetails.label}</span>
                    <span className="text-muted-foreground">
                      ({fileTypeDetails.extensions.join(', ')})
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Максимальный размер файла: {maxSizeMB}MB
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
} 