import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Artifact } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  Download, 
  Edit, 
  FileType, 
  RotateCcw, 
  Trash2, 
  FileText,
  Package,
  ImageIcon,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Eye,
  Search,
  Filter,
  ChevronDown,
  Check,
  SortAsc,
  SortDesc,
  ChevronsUpDown,
  Group
} from 'lucide-react';
import { useAdminLevels } from '@/hooks/useAdminLevels';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from '@/components/ui/separator';

interface ArtifactsListProps {
  artifacts: Artifact[];
  isLoading: boolean;
  onEdit: (artifact: Artifact) => void;
  onDelete: (artifact: Artifact) => void;
  onResetDownloadCount: (artifactId: string) => void;
  onViewDetails?: (artifact: Artifact) => void;
}

export function ArtifactsList({
  artifacts,
  isLoading,
  onEdit,
  onDelete,
  onResetDownloadCount,
  onViewDetails,
}: ArtifactsListProps) {
  const { data: levels } = useAdminLevels();
  const [sortBy, setSortBy] = useState<'title' | 'uploadedAt' | 'level' | 'downloads' | 'fileType'>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupByLevel, setGroupByLevel] = useState<boolean>(false);
  
  // Get level name by ID
  const getLevelName = (levelId: string) => {
    const level = levels?.find(l => l.id === levelId);
    return level ? level.title : 'Неизвестный уровень';
  };
  
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('xls')) return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    if (fileType.includes('presentation') || fileType.includes('powerpoint') || fileType.includes('ppt')) return <FileCode className="h-5 w-5 text-orange-500" />;
    if (fileType.includes('image')) return <ImageIcon className="h-5 w-5 text-purple-500" />;
    if (fileType.includes('zip') || fileType.includes('archive')) return <FileArchive className="h-5 w-5 text-yellow-500" />;
    return <Package className="h-5 w-5" />;
  };
  
  // Get file type label
  const getFileTypeLabel = (fileType: string) => {
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('word') || fileType.includes('doc')) return 'Word';
    if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('xls')) return 'Excel';
    if (fileType.includes('presentation') || fileType.includes('powerpoint') || fileType.includes('ppt')) return 'PowerPoint';
    if (fileType.includes('image')) return 'Изображение';
    if (fileType.includes('zip') || fileType.includes('archive')) return 'Архив';
    return fileType.split('/')[1] || 'Файл';
  };
  
  // Get available file types from artifacts
  const getFileTypes = () => {
    const types = new Set<string>();
    artifacts.forEach(artifact => {
      const typeLabel = getFileTypeLabel(artifact.fileType);
      types.add(typeLabel);
    });
    return Array.from(types);
  };
  
  // Filter and sort artifacts
  const filteredAndSortedArtifacts = useMemo(() => {
    let filtered = [...artifacts];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.description.toLowerCase().includes(query) ||
        a.fileName.toLowerCase().includes(query) ||
        (a.tags && a.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply level filter
    if (filterLevel !== 'all') {
      filtered = filtered.filter(a => a.levelId === filterLevel);
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(a => getFileTypeLabel(a.fileType) === filterType);
    }
    
    // Sort artifacts
    return filtered.sort((a, b) => {
      let compareResult = 0;
      
      switch (sortBy) {
        case 'title':
          compareResult = a.title.localeCompare(b.title);
          break;
        case 'uploadedAt':
          compareResult = new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
          break;
        case 'level':
          compareResult = getLevelName(a.levelId).localeCompare(getLevelName(b.levelId));
          break;
        case 'downloads':
          compareResult = b.downloadCount - a.downloadCount;
          break;
        case 'fileType':
          compareResult = getFileTypeLabel(a.fileType).localeCompare(getFileTypeLabel(b.fileType));
          break;
      }
      
      return sortOrder === 'asc' ? compareResult * -1 : compareResult;
    });
  }, [artifacts, searchQuery, filterLevel, filterType, sortBy, sortOrder]);
  
  // Group artifacts by level if groupByLevel is true
  const groupedArtifacts = useMemo(() => {
    if (!groupByLevel) return null;
    
    const groups = new Map<string, Artifact[]>();
    
    // Add all levels as keys first (to include empty levels)
    if (levels) {
      levels.forEach(level => {
        groups.set(level.id, []);
      });
    }
    
    // Add artifacts to their respective groups
    filteredAndSortedArtifacts.forEach(artifact => {
      const levelId = artifact.levelId;
      if (!groups.has(levelId)) {
        groups.set(levelId, []);
      }
      groups.get(levelId)!.push(artifact);
    });
    
    // Convert map to array and sort by level order
    return Array.from(groups.entries()).map(([levelId, artifacts]) => ({
      levelId,
      levelName: getLevelName(levelId),
      artifacts,
      order: levels?.find(l => l.id === levelId)?.order || 999
    })).sort((a, b) => a.order - b.order);
  }, [filteredAndSortedArtifacts, groupByLevel, levels]);
  
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  const fileTypes = getFileTypes();
  
  // Render a single artifact card
  const renderArtifactCard = (artifact: Artifact) => (
    <Card 
      key={artifact.id} 
      className="overflow-hidden border hover:border-primary/50 transition-colors cursor-pointer"
      onClick={() => onViewDetails && onViewDetails(artifact)}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="mr-3">
            {getFileIcon(artifact.fileType)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{artifact.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{artifact.description}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
              <div className="flex items-center">
                <FileType className="h-3.5 w-3.5 mr-1" />
                {getFileTypeLabel(artifact.fileType)}
              </div>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {format(new Date(artifact.uploadedAt), 'dd MMM yyyy', { locale: ru })}
              </div>
              <div className="flex items-center">
                <Download className="h-3.5 w-3.5 mr-1" />
                {artifact.downloadCount} скач.
              </div>
            </div>
            
            {artifact.tags && artifact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {artifact.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
                {artifact.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{artifact.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-t">
          <div className="text-xs">
            {getLevelName(artifact.levelId)}
          </div>
          <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
            {onViewDetails && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(artifact);
                }}
                title="Просмотреть детали"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onResetDownloadCount(artifact.id);
              }}
              title="Сбросить счетчик скачиваний"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(artifact);
              }}
              title="Редактировать артефакт"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(artifact);
              }}
              title="Удалить артефакт"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        {/* Search and filter bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск по названию, описанию или тегам..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {/* Sorting dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <SortAsc className="h-4 w-4" />
                  Сортировка
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Сортировать по</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                  <DropdownMenuRadioItem value="title" className="gap-2">
                    Название
                    {sortBy === 'title' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        {sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
                      </Button>
                    )}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="uploadedAt" className="gap-2">
                    Дата загрузки
                    {sortBy === 'uploadedAt' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        {sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
                      </Button>
                    )}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="level" className="gap-2">
                    Уровень
                    {sortBy === 'level' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        {sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
                      </Button>
                    )}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="downloads" className="gap-2">
                    Скачивания
                    {sortBy === 'downloads' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        {sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
                      </Button>
                    )}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="fileType" className="gap-2">
                    Тип файла
                    {sortBy === 'fileType' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        {sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
                      </Button>
                    )}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Фильтры
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Фильтры</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Уровень</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem 
                        onClick={() => setFilterLevel('all')}
                      >
                        <span>Все уровни</span>
                        {filterLevel === 'all' && (
                          <Check className="h-4 w-4 ml-auto" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {levels?.map(level => (
                        <DropdownMenuItem 
                          key={level.id}
                          onClick={() => setFilterLevel(level.id)}
                        >
                          <span>
                            {level.title}
                          </span>
                          {filterLevel === level.id && (
                            <Check className="h-4 w-4 ml-auto" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Тип файла</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem 
                        onClick={() => setFilterType('all')}
                      >
                        <span>Все типы</span>
                        {filterType === 'all' && (
                          <Check className="h-4 w-4 ml-auto" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {fileTypes.map(type => (
                        <DropdownMenuItem 
                          key={type}
                          onClick={() => setFilterType(type)}
                        >
                          <span>{type}</span>
                          {filterType === type && (
                            <Check className="h-4 w-4 ml-auto" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuCheckboxItem
                  checked={groupByLevel}
                  onCheckedChange={setGroupByLevel}
                >
                  <Group className="h-4 w-4 mr-2" />
                  Группировать по уровням
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => {
                    setFilterLevel('all');
                    setFilterType('all');
                    setSearchQuery('');
                    setSortBy('uploadedAt');
                    setSortOrder('desc');
                    setGroupByLevel(false);
                  }}
                >
                  Сбросить все фильтры
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Active filters display */}
        {(filterLevel !== 'all' || filterType !== 'all' || searchQuery.trim() !== '') && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Активные фильтры:</span>
            
            {filterLevel !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                <span>Уровень: {getLevelName(filterLevel)}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setFilterLevel('all')}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filterType !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                <span>Тип: {filterType}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setFilterType('all')}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {searchQuery.trim() !== '' && (
              <Badge variant="secondary" className="gap-1">
                <span>Поиск: {searchQuery}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setSearchQuery('')}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <ArtifactsListSkeleton />
      ) : filteredAndSortedArtifacts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Package className="mx-auto h-10 w-10 mb-3 opacity-50" />
          <p>Нет артефактов {(filterLevel !== 'all' || filterType !== 'all' || searchQuery.trim() !== '') ? 'соответствующих фильтрам' : ''}</p>
        </div>
      ) : groupByLevel ? (
        // Grouped view
        <div className="space-y-6">
          {groupedArtifacts!.map(group => (
            <div key={group.levelId}>
              {group.artifacts.length > 0 && (
                <Collapsible defaultOpen={true}>
                  <div className="flex items-center mb-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <h3 className="text-lg font-semibold ml-1">{group.levelName}</h3>
                    <Badge variant="outline" className="ml-2">
                      {group.artifacts.length}
                    </Badge>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {group.artifacts.map(artifact => renderArtifactCard(artifact))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Flat view
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedArtifacts.map(artifact => renderArtifactCard(artifact))}
        </div>
      )}
    </div>
  );
}

function ArtifactsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-md overflow-hidden">
          <div className="p-4">
            <div className="flex">
              <Skeleton className="h-10 w-10 rounded mr-3" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t p-3 bg-muted/40">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 