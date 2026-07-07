"use client";

import React, { useEffect, useState } from "react";
import { reportService, postService } from "@/services/api.service";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ExternalLink,
  User,
  MessageSquare,
  Clock,
  MoreVertical,
  Flag
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.Role?.role_name === 'ADMIN';

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportService.getAll();
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await reportService.updateStatus(id, status);
      toast.success("Đã cập nhật trạng thái báo cáo");
      fetchReports();
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDeletePost = async (postId: number, reportId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.")) return;
    
    try {
      await postService.delete(postId);
      await reportService.updateStatus(reportId, 'RESOLVED');
      toast.success("Đã xóa bài đăng và giải quyết báo cáo");
      fetchReports();
    } catch (error) {
      toast.error("Lỗi khi xóa bài đăng");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">Chờ xử lý</span>;
      case 'RESOLVED':
        return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Đã xử lý</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">Đã bác bỏ</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý báo cáo</h1>
          <p className="text-muted-foreground">Xem và xử lý các báo cáo vi phạm từ người dùng.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <div className="bg-card p-12 rounded-3xl border border-border flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Flag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Chưa có báo cáo nào</h3>
            <p className="text-muted-foreground">Hiện tại không có báo cáo vi phạm nào cần xử lý.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">Báo cáo #{report.id}</span>
                        {getStatusBadge(report.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {format(new Date(report.created_at), "HH:mm, dd/MM/yyyy", { locale: vi })}
                      </div>
                    </div>
                  </div>
                  
                  {isAdmin && report.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                        className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        title="Đánh dấu đã xử lý"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(report.id, 'REJECTED')}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Bác bỏ báo cáo"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <User className="w-4 h-4 text-blue-500" />
                      Người báo cáo: <span className="text-foreground font-bold">{report.reporter?.Profile?.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <User className="w-4 h-4 text-red-500" />
                      Bị báo cáo: <span className="text-foreground font-bold">{report.reportedUser?.Profile?.full_name || report.Post?.Room?.Property?.landlord?.Profile?.full_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <Flag className="w-4 h-4 text-amber-500" />
                      Lý do: <span className="text-foreground font-bold">{report.reason}</span>
                    </div>
                    {report.description && (
                      <div className="mt-2 p-3 bg-white/50 rounded-xl text-xs text-muted-foreground italic border border-border/30">
                        "{report.description}"
                      </div>
                    )}
                  </div>

                  {report.Post && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-muted-foreground">Bài đăng vi phạm:</div>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeletePost(report.Post.id, report.id)}
                            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Gỡ bài đăng
                          </button>
                        )}
                      </div>
                      <div className="p-3 bg-card rounded-xl border border-border flex items-center gap-3 group/item cursor-pointer hover:border-primary/50 transition-colors">
                        {report.Post.PostImages?.[0] && (
                          <img 
                            src={report.Post.PostImages[0].image_url} 
                            className="w-12 h-12 rounded-lg object-cover"
                            alt=""
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate group-hover/item:text-primary transition-colors">{report.Post.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{report.Post.Room?.Property?.name} - {report.Post.Room?.room_name}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
