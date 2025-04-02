'use client';

import { useState } from 'react';
import { Level } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowUp, ArrowDown, GripVertical, Save } from 'lucide-react';
import { useReorderLevels } from '@/hooks/useAdminLevels';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LevelOrderManagerProps {
  levels: Level[];
  isLoading: boolean;
}

// Sortable Item component
const SortableItem = ({ level }: { level: Level }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: level.id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: isDragging ? 'relative' : 'static',
    opacity: isDragging ? 0.8 : 1,
  } as React.CSSProperties;
  
  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'bg-accent' : ''}>
      <TableCell className="w-[50px]">
        <div className="flex items-center justify-center">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      </TableCell>
      <TableCell className="font-medium">{level.order}</TableCell>
      <TableCell>{level.title}</TableCell>
      <TableCell className="max-w-xs truncate">{level.description}</TableCell>
      <TableCell>{level.tests?.length || 0}</TableCell>
      <TableCell>{level.videoContent?.length || 0}</TableCell>
    </TableRow>
  );
};

const LevelOrderManager = ({ levels, isLoading }: LevelOrderManagerProps) => {
  const [items, setItems] = useState<Level[]>(levels);
  const [modified, setModified] = useState(false);
  
  const { mutate: reorderLevels, isPending: isReordering } = useReorderLevels();
  
  // Update items when levels prop changes (e.g., after initial load)
  if (levels.length > 0 && items.length === 0) {
    setItems(levels);
  }
  
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index + 1,
        }));
        
        setModified(true);
        return newItems;
      });
    }
  };
  
  // Handle manual move (for accessibility)
  const handleManualMove = (levelId: string, direction: 'up' | 'down') => {
    setItems((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === levelId);
      
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === prevItems.length - 1)
      ) {
        return prevItems;
      }
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const newItems = arrayMove(prevItems, index, newIndex).map((item, index) => ({
        ...item,
        order: index + 1,
      }));
      
      setModified(true);
      return newItems;
    });
  };
  
  // Save reordered levels
  const handleSave = () => {
    const levelIds = items.map((level) => level.id);
    reorderLevels(levelIds, {
      onSuccess: () => {
        setModified(false);
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление порядком уровней</CardTitle>
        <CardDescription>
          Перетаскивайте уровни, чтобы изменить их порядок. Не забудьте сохранить изменения.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Порядок</TableHead>
                <TableHead>Название уровня</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Тесты</TableHead>
                <TableHead>Видео</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext 
                items={items.map(level => level.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((level) => (
                  <SortableItem key={level.id} level={level} />
                ))}
              </SortableContext>
              
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    {isLoading 
                      ? 'Загрузка уровней...' 
                      : 'Нет доступных уровней для упорядочивания'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (confirm('Вы уверены, что хотите сбросить изменения?')) {
                setItems(levels);
                setModified(false);
              }
            }}
            disabled={!modified || isReordering}
          >
            Сбросить
          </Button>
        </div>
        <Button
          onClick={handleSave}
          disabled={!modified || isReordering}
          className="gap-1"
        >
          {isReordering ? (
            <>Сохранение...</>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Сохранить порядок
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LevelOrderManager; 