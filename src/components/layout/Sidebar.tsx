"use client";

import { 
  Map, 
  UserCircle, 
  FileBox, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  ShieldCheck
} from "lucide-react";
import NavLink from "@/components/layout/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const navItems = [
  {
    title: "Карта уровней",
    href: "/map",
    icon: Map,
  },
  {
    title: "Профиль",
    href: "/profile",
    icon: UserCircle,
  },
  {
    title: "Артефакты",
    href: "/artifacts",
    icon: FileBox,
  },
  {
    title: "Чат",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Настройки",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "FAQ",
    href: "/faq",
    icon: HelpCircle,
  },
];

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is an admin
    const checkAdminStatus = async () => {
      const adminStatus = await isAdmin();
      setIsUserAdmin(adminStatus);
    };

    checkAdminStatus();
  }, [isAdmin]);

  return (
    <div className="flex h-full flex-col p-4">
      {/* Logo/Title */}
      <div className="flex items-center py-4">
        <span className="text-2xl font-bold">BizLevel</span>
      </div>
      
      {/* Navigation */}
      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.title}
          />
        ))}

        {/* Admin link - only visible for admin users */}
        {isUserAdmin && (
          <NavLink
            href="/admin"
            icon={ShieldCheck}
            label="Администрирование"
          />
        )}
      </nav>
      
      {/* Footer */}
      <div className="mt-auto py-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} BizLevel</p>
        <p>Все права защищены</p>
      </div>
    </div>
  );
};

export default Sidebar; 