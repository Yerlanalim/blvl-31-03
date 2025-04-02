import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CheckSquare, FileText, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface ArtifactSectionProps {
  artifactIds: string[];
  downloadedArtifactIds: string[];
  onArtifactDownload: (artifactId: string) => void;
  isDownloading?: boolean;
}

export const ArtifactSection: React.FC<ArtifactSectionProps> = ({
  artifactIds,
  downloadedArtifactIds,
  onArtifactDownload,
  isDownloading = false
}) => {
  // State to track which artifact has download dialog open
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  
  // Helper function to check if artifact is downloaded
  const isArtifactDownloaded = (artifactId: string) => downloadedArtifactIds.includes(artifactId);
  
  // Handle artifact view/download dialog
  const handleViewArtifact = (artifactId: string) => {
    setSelectedArtifactId(artifactId);
  };
  
  // Handle artifact download
  const handleDownloadArtifact = (artifactId: string) => {
    // Simulate download
    toast.promise(
      new Promise(resolve => {
        // Simulate download delay
        setTimeout(() => {
          onArtifactDownload(artifactId);
          resolve(true);
        }, 1500);
      }),
      {
        loading: 'Загрузка артефакта...',
        success: 'Артефакт успешно загружен!',
        error: 'Ошибка при загрузке артефакта'
      }
    );
    
    // Close dialog after download starts
    setSelectedArtifactId(null);
  };
  
  // Get artifact file icon based on "file type"
  const getArtifactIcon = (artifactId: string) => {
    // For now just return different icons based on artifact ID to simulate different file types
    const fileTypes = {
      pdf: <File className="h-8 w-8 text-red-500" />,
      doc: <File className="h-8 w-8 text-blue-500" />,
      xls: <File className="h-8 w-8 text-green-500" />,
      default: <FileText className="h-8 w-8 text-slate-500" />
    };
    
    if (artifactId.includes('pdf')) return fileTypes.pdf;
    if (artifactId.includes('doc')) return fileTypes.doc;
    if (artifactId.includes('xls')) return fileTypes.xls;
    return fileTypes.default;
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Материалы для скачивания</h2>
      {artifactIds.length > 0 ? (
        artifactIds.map((artifactId) => {
          const downloaded = isArtifactDownloaded(artifactId);
          const artifactIcon = getArtifactIcon(artifactId);
          
          return (
            <Card 
              key={artifactId} 
              className={cn(
                "transition-all duration-300 hover:shadow-md",
                downloaded && "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  {downloaded && <CheckSquare className="h-4 w-4 text-green-600 mr-2" />}
                  {`Артефакт ${artifactId.split('-').pop()}`}
                </CardTitle>
                <CardDescription>
                  Полезный материал для практики
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="bg-slate-100 dark:bg-slate-800 rounded-md p-4 mb-3 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => handleViewArtifact(artifactId)}
                >
                  {artifactIcon}
                  <p className="text-center text-muted-foreground text-sm mt-2">
                    Нажмите, чтобы просмотреть информацию об артефакте
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant={downloaded ? "outline" : "default"} 
                    size="sm" 
                    disabled={downloaded || isDownloading}
                    onClick={() => handleViewArtifact(artifactId)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {downloaded ? "Скачано" : "Скачать"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-6 flex flex-col items-center justify-center">
              <Download className="h-12 w-12 text-slate-400 mb-2" />
              <p className="text-muted-foreground">Для этого уровня нет доступных материалов</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Artifact Download Dialog */}
      <Dialog open={selectedArtifactId !== null} onOpenChange={(open) => !open && setSelectedArtifactId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Информация об артефакте</DialogTitle>
            <DialogDescription>
              Материал для практического применения знаний
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              {selectedArtifactId && getArtifactIcon(selectedArtifactId)}
              <div className="text-center">
                <h3 className="font-medium text-lg">
                  {selectedArtifactId ? `Артефакт ${selectedArtifactId.split('-').pop()}` : ''}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Этот материал поможет вам применить полученные знания на практике.
                  После скачивания вы сможете использовать его в своей работе.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            {selectedArtifactId && !isArtifactDownloaded(selectedArtifactId) && (
              <Button 
                onClick={() => selectedArtifactId && handleDownloadArtifact(selectedArtifactId)}
                disabled={isDownloading}
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Скачать
              </Button>
            )}
            
            {selectedArtifactId && isArtifactDownloaded(selectedArtifactId) && (
              <Button 
                variant="outline"
                className="w-full sm:w-auto"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Уже скачано
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 