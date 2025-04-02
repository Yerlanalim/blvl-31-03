'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface UserFiltersProps {
  onFilterChange: (filters: { search: string; role: string }) => void;
}

const UserFilters = ({ onFilterChange }: UserFiltersProps) => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  
  // Debounced search to avoid too many requests while typing
  const debouncedSearch = useDebounce(search, 300);
  
  // Update filters when search or role changes
  useEffect(() => {
    onFilterChange({ search: debouncedSearch, role });
  }, [debouncedSearch, role, onFilterChange]);
  
  const handleClearSearch = () => {
    setSearch('');
  };
  
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Поиск по имени или email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Очистить поиск</span>
          </Button>
        )}
      </div>
      
      <Select
        value={role}
        onValueChange={setRole}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Фильтр по роли" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все пользователи</SelectItem>
          <SelectItem value="user">Пользователи</SelectItem>
          <SelectItem value="admin">Администраторы</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserFilters; 