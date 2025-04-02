'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LogOut, 
  User 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminHeaderProps {
  title?: string;
}

// Map of paths to custom titles
const pathTitles: Record<string, string> = {
  '/admin': 'Панель администратора',
  '/admin/dashboard': 'Дашборд',
  '/admin/users': 'Управление пользователями',
  '/admin/levels': 'Управление уровнями',
  '/admin/artifacts': 'Управление артефактами',
  '/admin/faq': 'Управление FAQ',
};

export const AdminHeader = ({ title }: AdminHeaderProps) => {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Function to get the best matching title for the current path
  const getPageTitle = () => {
    // First check for exact match
    if (title) return title;
    if (pathTitles[pathname]) return pathTitles[pathname];
    
    // Check for partial match
    for (const [path, pathTitle] of Object.entries(pathTitles)) {
      if (pathname.startsWith(path) && path !== '/admin') {
        return pathTitle;
      }
    }
    
    // Default fallback
    return 'Админ-панель';
  };
  
  // Extract user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.displayName) return 'U';
    const nameParts = user.displayName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0] || 'U';
  };

  return (
    <header className="border-b bg-white px-6 py-3">
      <div className="flex h-12 items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="hidden text-sm md:block">
              <p className="font-medium">{user?.displayName || 'Администратор'}</p>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">На главную</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}; 