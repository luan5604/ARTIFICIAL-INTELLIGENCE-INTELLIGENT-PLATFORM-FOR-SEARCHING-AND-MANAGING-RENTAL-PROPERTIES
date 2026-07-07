"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Home, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  Plus,
  FileText,
  CreditCard,
  PlusCircle,
  LayoutDashboard
} from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { statsService } from "@/services/api.service";
import dynamic from 'next/dynamic';

const RevenueChart = dynamic(() => import('@/components/ui/revenue-chart').then(mod => mod.RevenueChart), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-muted animate-pulse rounded-xl"></div>
});
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(6);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsService.getDashboard(timeframe);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [timeframe]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CONTRACT': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'INVOICE': return <CreditCard className="w-4 h-4 text-green-400" />;
      case 'POST': return <PlusCircle className="w-4 h-4 text-purple-400" />;
      default: return <Activity className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{user?.role === 'ADMIN' ? 'Hệ thống NĐL LANDLORD' : 'Tổng quan Dashboard'}</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'ADMIN' ? 'Giám sát và quản lý toàn bộ hệ thống bất động sản.' : 'Theo dõi và quản lý Dãy trọ của riêng bạn bạn.'}
          </p>
        </div>
        <Link 
          href="/dashboard/posts"
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Đăng tin mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/billing">
          <StatsCard 
            icon={TrendingUp} 
            label="Doanh thu tháng này" 
            value={formatCurrency(stats?.monthlyRevenue || 0)} 
            trend={stats?.statsTrends?.revenue} 
          />
        </Link>
        <Link href="/dashboard/billing?tab=contracts">
          <StatsCard 
            icon={Users} 
            label="Số khách thuê" 
            value={stats?.occupiedRooms || 0} 
            trend={stats?.statsTrends?.rooms} 
          />
        </Link>
        <StatsCard 
          icon={Activity} 
          label="Tỷ lệ lấp đầy" 
          value={`${stats?.totalRooms ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%`} 
          trend={stats?.statsTrends?.occupancy} 
        />
        <Link href="/dashboard/properties">
          <StatsCard 
            icon={Home} 
            label="Số nhà cho thuê" 
            value={stats?.totalProperties || 0} 
            trend={stats?.statsTrends?.properties} 
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Biểu đồ doanh thu</h3>
              <select 
                className="bg-muted border-0 rounded-lg text-sm font-medium px-3 py-1 outline-none cursor-pointer hover:bg-muted/80 transition-colors"
                value={timeframe}
                onChange={(e) => setTimeframe(Number(e.target.value))}
              >
                <option value={6}>6 tháng gần đây</option>
                <option value={12}>1 năm gần đây</option>
              </select>
            </div>
            <RevenueChart data={stats?.revenueTrend} />
          </div>

            <Link href="/dashboard/rooms?status=AVAILABLE" className="glass p-6 rounded-2xl flex items-center gap-4 hover:border-primary/50 transition-all group">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phòng còn trống</p>
                <h4 className="text-xl font-bold leading-none mt-1">{stats?.totalRoomsEmpty || 0}</h4>
              </div>
            </Link>
            <Link href="/dashboard/posts?status=ACTIVE" className="glass p-6 rounded-2xl flex items-center gap-4 hover:border-primary/50 transition-all group">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tin đăng hoạt động</p>
                <h4 className="text-xl font-bold leading-none mt-1">{stats?.totalPostsActive || 0}</h4>
              </div>
            </Link>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col h-full">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            Hoạt động gần đây
          </h3>
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {stats?.recentActivity?.length > 0 ? (
              stats.recentActivity.map((activity: any, i: number) => (
                <div key={i} className="flex gap-4 group cursor-pointer items-start">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {new Date(activity.time).toLocaleDateString('vi-VN')} {new Date(activity.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Chưa có hoạt động nào</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl bg-muted hover:bg-muted/80 text-sm font-bold transition-all flex items-center justify-center gap-2 group">
            Xem tất cả hoạt động
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
