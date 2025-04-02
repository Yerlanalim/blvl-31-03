"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const NavLink = ({ href, icon: Icon, label }: NavLinkProps) => {
  const pathname = usePathname();
  
  // Check if current path matches this nav item
  const isActive = pathname === href || 
                  (href !== "/" && pathname.startsWith(href));
  
  // For level pages, mark Map as active
  const isLevelPage = pathname.startsWith("/level/");
  const isMapActive = href === "/map" && isLevelPage;
  
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        (isActive || isMapActive) 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

export default NavLink; 