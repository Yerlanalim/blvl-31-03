'use client';

import { useState } from 'react';
import { useArtifacts } from '@/hooks/useArtifacts';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, FileText, FileCode, FileSpreadsheet, File } from 'lucide-react';
import { ArtifactsList } from '@/components/features/Artifacts';

const fileTypes = [
  { id: 'pdf', label: 'PDF', icon: File },
  { id: 'docx', label: 'DOCX', icon: FileText },
  { id: 'xlsx', label: 'XLSX', icon: FileSpreadsheet },
  { id: 'other', label: 'Другие', icon: FileCode },
];

export default function ArtifactsPage() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  
  // Fetch artifacts data
  const { artifacts, isLoading, error } = useArtifacts();
  
  // Handle file type toggle
  const toggleFileType = (fileType: string) => {
    setSelectedFileTypes(prev => {
      if (prev.includes(fileType)) {
        return prev.filter(type => type !== fileType);
      } else {
        return [...prev, fileType];
      }
    });
  };
  
  // Filter artifacts based on search query and filters
  const filteredArtifacts = artifacts?.filter(artifact => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      artifact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artifact.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by level
    const matchesLevel = 
      selectedLevel === 'all' || 
      artifact.levelId === selectedLevel;
    
    // Filter by file type
    const matchesFileType = 
      selectedFileTypes.length === 0 || 
      selectedFileTypes.some(type => {
        if (type === 'other') {
          // Match any file type that is not in the explicit list
          const knownTypes = ['pdf', 'docx', 'xlsx'];
          return !knownTypes.includes(artifact.fileType.toLowerCase());
        }
        return artifact.fileType.toLowerCase().includes(type);
      });
    
    return matchesSearch && matchesLevel && matchesFileType;
  });
  
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Артефакты</h1>
        <p className="text-muted-foreground mt-2">
          Полезные материалы, шаблоны и документы для применения в вашем бизнесе
        </p>
      </div>
      
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Найдите нужные вам артефакты</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Level filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Уровень</label>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите уровень" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все уровни</SelectItem>
                <SelectItem value="level-1">Уровень 1</SelectItem>
                <SelectItem value="level-2">Уровень 2</SelectItem>
                <SelectItem value="level-3">Уровень 3</SelectItem>
                <SelectItem value="level-4">Уровень 4</SelectItem>
                <SelectItem value="level-5">Уровень 5</SelectItem>
                <SelectItem value="level-6">Уровень 6</SelectItem>
                <SelectItem value="level-7">Уровень 7</SelectItem>
                <SelectItem value="level-8">Уровень 8</SelectItem>
                <SelectItem value="level-9">Уровень 9</SelectItem>
                <SelectItem value="level-10">Уровень 10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* File types filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Тип файла</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fileTypes.map((type) => (
                <div 
                  key={type.id} 
                  className="flex items-center space-x-2"
                >
                  <Checkbox 
                    id={`file-type-${type.id}`}
                    checked={selectedFileTypes.includes(type.id)}
                    onCheckedChange={() => toggleFileType(type.id)}
                  />
                  <label 
                    htmlFor={`file-type-${type.id}`}
                    className="text-sm flex items-center cursor-pointer"
                  >
                    <type.icon className="h-4 w-4 mr-1" />
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Reset Filters */}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedLevel('all');
                setSelectedFileTypes([]);
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Artifacts List */}
      <Card>
        <CardHeader>
          <CardTitle>Список артефактов</CardTitle>
          <CardDescription>
            {isLoading 
              ? 'Загрузка артефактов...' 
              : filteredArtifacts?.length 
                ? `Найдено артефактов: ${filteredArtifacts.length}` 
                : 'Артефакты не найдены'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArtifactsList 
            artifacts={filteredArtifacts} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
} 