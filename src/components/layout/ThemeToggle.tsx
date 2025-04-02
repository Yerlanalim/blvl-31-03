'use client';

import { useSettingsContext } from '@/hooks/useSettingsContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { settings, updateTheme } = useSettingsContext();
  
  const toggleTheme = () => {
    if (settings?.theme === 'light') {
      updateTheme('dark');
    } else if (settings?.theme === 'dark') {
      updateTheme('system');
    } else {
      updateTheme('light');
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={`Текущая тема: ${
        settings?.theme === 'light' 
          ? 'Светлая' 
          : settings?.theme === 'dark' 
          ? 'Темная' 
          : 'Системная'
      }`}
    >
      {settings?.theme === 'light' ? (
        <Sun size={20} />
      ) : settings?.theme === 'dark' ? (
        <Moon size={20} />
      ) : (
        <Monitor size={20} />
      )}
      <span className="sr-only">Переключить тему</span>
    </Button>
  );
} 