"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Bed, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Megaphone,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

const menuItems = [
  { icon: LayoutDashboard, label: "Tổng quan", href: "/dashboard" },
  { icon: Building2, label: "Nhà cho thuê", href: "/dashboard/properties" },
  { icon: Bed, label: "Phòng trọ", href: "/dashboard/rooms" },
  { icon: Megaphone, label: "Tin đăng", href: "/dashboard/posts" },
  { icon: FileText, label: "Hợp đồng & Hóa đơn", href: "/dashboard/billing" },
  { icon: AlertTriangle, label: "Báo cáo", href: "/dashboard/reports" },
  { icon: MessageSquare, label: "Tin nhắn", href: "/dashboard/messages" },
  { icon: Settings, label: "Cài đặt", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col transition-all duration-300">
      <div className="p-8">
        <h1 className="text-2xl font-bold gradient-text">NĐL LANDLORD</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
