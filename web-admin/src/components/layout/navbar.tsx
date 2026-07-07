"use client";

import { Bell, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-20 glass border-0 border-b border-border flex items-center justify-between px-8 z-10 bg-background/50 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-semibold">Chào mừng trở lại, {user?.email?.split('@')[0] || 'User'}!</h2>
        <p className="text-sm text-muted-foreground">Phân tích tình hình kinh doanh hôm nay.</p>
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggle />
        <button className="p-2 rounded-full hover:bg-muted relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white premium-shadow">
            <User className="w-6 h-6" />
          </div>
          <div className="text-sm hidden md:block">
            <p className="font-semibold">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'ADMIN' ? 'Admin hệ thống' : 'Chủ trọ'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
