'use client';

import { useState } from 'react';
import { Level } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { 
  ArrowDown,
  ArrowUp,
  MoreHorizontal, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';
import DeleteLevelDialog from './DeleteLevelDialog';
import LevelFormDialog from './LevelFormDialog';
import { useReorderLevels } from '@/hooks/useAdminLevels';
import { SkillType } from '@/types';

interface LevelsListProps {
  levels: Level[];
  isLoading: boolean;
  error: Error | null;
  onSelectLevel?: (level: Level) => void;
}

const LevelsList = ({ levels, isLoading, error, onSelectLevel }: LevelsListProps) => {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { mutate: reorderLevels, isPending: isReordering } = useReorderLevels();
  
  // Handle level movement (up/down)
  const handleMoveLevel = (levelId: string, direction: 'up' | 'down') => {
    const currentIndex = levels.findIndex(l => l.id === levelId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= levels.length) return;
    
    const reorderedLevels = [...levels];
    const temp = reorderedLevels[currentIndex];
    reorderedLevels[currentIndex] = reorderedLevels[newIndex];
    reorderedLevels[newIndex] = temp;
    
    // Update order properties
    const updatedLevels = reorderedLevels.map((level, index) => ({
      ...level,
      order: index + 1
    }));
    
    // Send the new order to the server
    reorderLevels(updatedLevels.map(level => level.id));
  };
  
  // Translate skill types
  const skillTranslations: Record<SkillType, string> = {
    [SkillType.Marketing]: 'Маркетинг',
    [SkillType.Finance]: 'Финансы',
    [SkillType.Management]: 'Управление',
    [SkillType.Leadership]: 'Лидерство',
    [SkillType.Communication]: 'Коммуникация',
    [SkillType.Sales]: 'Продажи'
  };
  
  // Handle view details
  const handleViewDetails = (level: Level) => {
    if (onSelectLevel) {
      onSelectLevel(level);
    }
  };
  
  // Handle edit
  const handleEdit = (level: Level) => {
    setSelectedLevel(level);
    setIsFormDialogOpen(true);
  };
  
  // Handle delete
  const handleDelete = (level: Level) => {
    setSelectedLevel(level);
    setIsDeleteDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-center">
          <p>Загрузка уровней...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        <p>Ошибка при загрузке уровней:</p>
        <p>{error.message}</p>
      </div>
    );
  }
  
  if (levels.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Уровней пока нет. Создайте первый уровень!</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Порядок</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="hidden md:table-cell">Описание</TableHead>
              <TableHead className="w-[80px] text-center">Тесты</TableHead>
              <TableHead className="w-[80px] text-center">Видео</TableHead>
              <TableHead className="hidden md:table-cell w-[120px]">Навыки</TableHead>
              <TableHead className="w-[100px] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levels.map((level) => (
              <TableRow 
                key={level.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSelectLevel ? handleViewDetails(level) : null}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <span className="mr-2">{level.order}</span>
                    <div className="flex flex-col">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLevel(level.id, 'up');
                        }}
                        disabled={level.order === 1 || isReordering}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLevel(level.id, 'down');
                        }}
                        disabled={level.order === levels.length || isReordering}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{level.title}</TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate">{level.description}</TableCell>
                <TableCell className="text-center">{level.tests?.length || 0}</TableCell>
                <TableCell className="text-center">{level.videoContent?.length || 0}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {level.skillFocus.slice(0, 2).map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="text-xs"
                      >
                        {skillTranslations[skill]}
                      </Badge>
                    ))}
                    {level.skillFocus.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{level.skillFocus.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Открыть меню</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      {onSelectLevel && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(level);
                          }}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Детали</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(level);
                        }}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Редактировать</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(level);
                        }}
                        className="text-destructive gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Удалить</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedLevel && (
        <>
          <LevelFormDialog
            level={selectedLevel}
            open={isFormDialogOpen}
            onOpenChange={(open) => {
              setIsFormDialogOpen(open);
              if (!open) setSelectedLevel(null);
            }}
          />
          <DeleteLevelDialog
            level={selectedLevel}
            open={isDeleteDialogOpen}
            onOpenChange={(open) => {
              setIsDeleteDialogOpen(open);
              if (!open) setSelectedLevel(null);
            }}
          />
        </>
      )}
    </>
  );
};

export default LevelsList; 