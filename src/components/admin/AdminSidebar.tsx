'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Award, 
  HelpCircle,
  Database
} from 'lucide-react';

interface NavItem {
  href: string;
  title: string;
  icon: React.ReactNode;
  pattern?: RegExp; // Optional pattern to match the path
}

const navItems: NavItem[] = [
  {
    href: '/admin/dashboard',
    title: 'Дашборд',
    icon: <LayoutDashboard className="h-5 w-5" />,
    pattern: /^\/admin(\/dashboard)?$/
  },
  {
    href: '/admin/users',
    title: 'Пользователи',
    icon: <Users className="h-5 w-5" />,
    pattern: /^\/admin\/users/
  },
  {
    href: '/admin/levels',
    title: 'Уровни',
    icon: <Layers className="h-5 w-5" />,
    pattern: /^\/admin\/levels/
  },
  {
    href: '/admin/artifacts',
    title: 'Артефакты',
    icon: <Award className="h-5 w-5" />,
    pattern: /^\/admin\/artifacts/
  },
  {
    href: '/admin/faq',
    title: 'FAQ',
    icon: <HelpCircle className="h-5 w-5" />,
    pattern: /^\/admin\/faq/
  },
  {
    href: '/admin/firebase',
    title: 'Firebase',
    icon: <Database className="h-5 w-5" />,
    pattern: /^\/admin\/firebase/
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  // Function to check if a nav item is active
  const isActive = (item: NavItem) => {
    if (item.pattern) {
      return item.pattern.test(pathname);
    }
    return pathname === item.href;
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r">
      <div className="px-3 py-4">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          BizLevel Админ
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive(item)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}; 