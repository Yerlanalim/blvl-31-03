'use client';

import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Artifact } from '@/types';
import { getArtifactsAdmin } from '@/lib/services/admin-service';

interface ArtifactSelectorProps {
  form: UseFormReturn<any>;
}

const ArtifactSelector = ({ form }: ArtifactSelectorProps) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState<Artifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load artifacts
  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        setIsLoading(true);
        const data = await getArtifactsAdmin();
        setArtifacts(data);
        setFilteredArtifacts(data);
      } catch (error) {
        console.error('Error loading artifacts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtifacts();
  }, []);
  
  // Filter artifacts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArtifacts(artifacts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = artifacts.filter(
        (artifact) => 
          artifact.title.toLowerCase().includes(query) ||
          artifact.description.toLowerCase().includes(query) ||
          artifact.fileName.toLowerCase().includes(query)
      );
      setFilteredArtifacts(filtered);
    }
  }, [searchQuery, artifacts]);
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск артефактов..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Card className="p-1">
        <ScrollArea className="h-[300px] px-3 py-2">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : filteredArtifacts.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-sm text-muted-foreground">
                {artifacts.length === 0 
                  ? 'Нет доступных артефактов' 
                  : 'Не найдено артефактов по запросу'}
              </p>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="relatedArtifactIds"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    {filteredArtifacts.map((artifact) => (
                      <div key={artifact.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`artifact-${artifact.id}`}
                          checked={field.value?.includes(artifact.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = Array.isArray(field.value) ? [...field.value] : [];
                            
                            if (checked) {
                              if (!currentValue.includes(artifact.id)) {
                                field.onChange([...currentValue, artifact.id]);
                              }
                            } else {
                              field.onChange(currentValue.filter(id => id !== artifact.id));
                            }
                          }}
                        />
                        <div className="space-y-1">
                          <Label 
                            htmlFor={`artifact-${artifact.id}`}
                            className="font-medium text-sm"
                          >
                            {artifact.title}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {artifact.description.length > 50
                              ? `${artifact.description.substring(0, 50)}...`
                              : artifact.description}
                          </p>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-muted-foreground">
                              {artifact.fileType.toUpperCase()}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {artifact.downloadCount} скачиваний
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ArtifactSelector; 