'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileUp, RefreshCw } from 'lucide-react';
import { 
  ArtifactsList, 
  ArtifactFormDialog, 
  DeleteArtifactDialog,
  ArtifactDetailView
} from '@/components/admin/artifacts';
import { 
  useAdminArtifacts, 
  useCreateArtifact, 
  useUpdateArtifact, 
  useDeleteArtifact, 
  useResetDownloadCount 
} from '@/hooks/useAdminArtifacts';
import { Artifact } from '@/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function AdminArtifactsPage() {
  // State for dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

  // Queries and mutations
  const { data: artifacts, isLoading, refetch, isRefetching } = useAdminArtifacts();
  const createArtifactMutation = useCreateArtifact();
  const updateArtifactMutation = useUpdateArtifact();
  const deleteArtifactMutation = useDeleteArtifact();
  const resetDownloadCountMutation = useResetDownloadCount();

  // Handler for opening the create artifact form
  const handleOpenCreateForm = () => {
    setSelectedArtifact(null);
    setIsFormOpen(true);
  };

  // Handler for opening the edit artifact form
  const handleOpenEditForm = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setIsFormOpen(true);
  };

  // Handler for closing the artifact form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setUploadProgress(0);
    refetch();
  };

  // Handler for opening the delete dialog
  const handleOpenDeleteDialog = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setIsDeleteDialogOpen(true);
  };

  // Handler for closing the delete dialog
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    refetch();
  };

  // Handler for submitting the artifact form
  const handleSubmitForm = (data: any, file: File) => {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    if (selectedArtifact) {
      // Update existing artifact
      updateArtifactMutation.mutate(
        {
          artifactId: selectedArtifact.id,
          artifactData: data,
          file: file.size > 0 ? file : undefined
        },
        {
          onSettled: () => {
            clearInterval(progressInterval);
            handleCloseForm();
          }
        }
      );
    } else {
      // Create new artifact
      createArtifactMutation.mutate(
        {
          artifact: data,
          file
        },
        {
          onSettled: () => {
            clearInterval(progressInterval);
            handleCloseForm();
          }
        }
      );
    }
  };

  // Handler for deleting an artifact
  const handleDeleteArtifact = () => {
    if (selectedArtifact) {
      deleteArtifactMutation.mutate(selectedArtifact.id, {
        onSuccess: () => {
          handleCloseDeleteDialog();
          if (viewMode === 'details') {
            setViewMode('list');
          }
        }
      });
    }
  };

  // Handler for resetting download count
  const handleResetDownloadCount = (artifactId: string) => {
    resetDownloadCountMutation.mutate(artifactId);
  };

  // Handler for viewing artifact details
  const handleViewDetails = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setViewMode('details');
  };

  // Handler for returning to list view
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedArtifact(null);
  };

  // Handler for refreshing data
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Управление артефактами</h2>
          <p className="text-muted-foreground">
            Загрузка, просмотр и удаление учебных материалов и артефактов
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1" 
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Обновить</span>
          </Button>
          <Button className="gap-1" onClick={handleOpenCreateForm}>
            <FileUp className="h-4 w-4" />
            <span>Загрузить артефакт</span>
          </Button>
        </div>
      </div>
      
      {viewMode === 'details' && selectedArtifact ? (
        <ArtifactDetailView 
          artifact={selectedArtifact} 
          onEdit={handleOpenEditForm}
          onDelete={handleOpenDeleteDialog}
          onResetDownloadCount={handleResetDownloadCount}
          onBack={handleBackToList}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Список артефактов</CardTitle>
            <CardDescription>
              Управление артефактами и учебными материалами
              {artifacts && artifacts.length > 0 ? ` • Всего артефактов: ${artifacts.length}` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ArtifactsList
              artifacts={artifacts || []}
              isLoading={isLoading}
              onEdit={handleOpenEditForm}
              onDelete={handleOpenDeleteDialog}
              onResetDownloadCount={handleResetDownloadCount}
              onViewDetails={handleViewDetails}
            />
          </CardContent>
        </Card>
      )}

      {/* Artifact Form Dialog */}
      <ArtifactFormDialog
        artifact={selectedArtifact || undefined}
        isOpen={isFormOpen}
        isProcessing={createArtifactMutation.isPending || updateArtifactMutation.isPending}
        uploadProgress={uploadProgress}
        onSubmit={handleSubmitForm}
        onCancel={handleCloseForm}
      />

      {/* Delete Artifact Dialog */}
      {selectedArtifact && (
        <DeleteArtifactDialog
          artifactName={selectedArtifact.title}
          isOpen={isDeleteDialogOpen}
          isDeleting={deleteArtifactMutation.isPending}
          onDelete={handleDeleteArtifact}
          onCancel={handleCloseDeleteDialog}
        />
      )}
    </div>
  );
} 