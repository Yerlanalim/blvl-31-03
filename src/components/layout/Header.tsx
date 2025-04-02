"use client";

import { usePathname } from "next/navigation";
import UserNav from "@/components/layout/UserNav";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const pathname = usePathname();
  
  // Function to get the page title based on the current path
  const getPageTitle = (): string => {
    // Remove any query parameters and trailing slash
    const path = pathname.split("?")[0].replace(/\/$/, "");
    
    // Define mapping of paths to titles
    const titles: Record<string, string> = {
      "/map": "Карта уровней",
      "/profile": "Профиль",
      "/artifacts": "Артефакты",
      "/chat": "Чат с ассистентом",
      "/settings": "Настройки",
      "/faq": "FAQ",
      "/admin": "Панель администратора",
      "/admin/users": "Управление пользователями",
      "/admin/content": "Управление контентом",
      "/admin/faq": "Управление FAQ",
    };
    
    // Handle level pages
    if (path.startsWith("/level/")) {
      const levelId = path.split("/").pop();
      return `Уровень ${levelId}`;
    }
    
    // Handle other admin pages
    if (path.startsWith("/admin/")) {
      return titles[path] || "Панель администратора";
    }
    
    // Return the mapped title or a default
    return titles[path] || "BizLevel";
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle button - only visible on small screens */}
        <button
          className="rounded-md p-2 hover:bg-muted md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Page title */}
        <h1 className={cn(
          "text-xl font-semibold",
          "md:text-2xl"
        )}>
          {getPageTitle()}
        </h1>
      </div>
      
      {/* Right side with user navigation */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
};

export default Header; 