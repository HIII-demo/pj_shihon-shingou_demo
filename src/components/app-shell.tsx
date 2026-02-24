"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FolderOpen,
  Settings,
  FileSearch,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { href: "/", label: "案件一覧", icon: LayoutDashboard },
  { href: "/settings", label: "設定", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 border-b bg-card flex items-center px-6 shrink-0">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <FileSearch className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm tracking-tight">
            図面解析・仕様書生成システム
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/" || pathname.startsWith("/projects")
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderOpen className="h-4 w-4" />
            <span>デモ環境</span>
          </div>
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
            田中
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
