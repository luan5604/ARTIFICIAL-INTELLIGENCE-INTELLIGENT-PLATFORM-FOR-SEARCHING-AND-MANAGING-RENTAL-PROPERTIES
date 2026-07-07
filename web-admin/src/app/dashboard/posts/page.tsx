"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Megaphone, Eye, Edit, Trash2, Loader2, Filter, ChevronLeft, ChevronRight, MapPin, Building2, Calendar, Check } from "lucide-react";
import { postService } from "@/services/api.service";
import { Modal } from "@/components/ui/modal";
import { PostForm } from "@/components/forms/post-form";
import { cn, formatDate, stripHtmlAndTruncate } from "@/lib/utils";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  const fetchPosts = async (page = 1, search = searchTerm, status = statusFilter) => {
    setLoading(true);
    try {
      const res = await postService.getMyPosts({
        page,
        limit: pagination.limit,
        search,
        status
      });
      setPosts(res.data.data);
      setPagination({
        ...pagination,
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        totalItems: res.data.pagination.totalItems
      });
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleSearchClick = () => {
    fetchPosts(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    fetchPosts(1, searchTerm, status);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin đăng này?")) return;
    try {
      await postService.delete(id);
      fetchPosts(pagination.currentPage);
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn duyệt tin đăng này?")) return;
    try {
      await postService.approve(id);
      fetchPosts(pagination.currentPage);
    } catch (error) {
      console.error("Failed to approve post", error);
    }
  };

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Quản lý tin đăng</h1>
          <p className="text-muted-foreground mt-1 text-lg">Đăng tin quảng bá phòng trọ và thu hút khách thuê tiềm năng.</p>
        </div>
        <button 
          onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5"
        >
          <Plus className="w-6 h-6" />
          Đăng tin mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề hoặc nội dung tin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
            className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-4 py-3.5 bg-card border border-border rounded-2xl outline-none focus:border-primary transition-all shadow-sm font-medium appearance-none cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hiển thị</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="HIDDEN">Đã ẩn</option>
        </select>
        <button 
          onClick={() => fetchPosts(1)}
          className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3.5 rounded-2xl font-bold transition-all shadow-sm border border-border"
        >
          Tìm kiếm
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-card border border-border rounded-3xl">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium text-lg">Đang tổng hợp danh sách tin đăng...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="group bg-card border border-border p-6 rounded-3xl flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary/50">
              <div 
                className="w-full md:w-56 h-40 bg-muted rounded-2xl bg-cover bg-center shrink-0 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500" 
                style={{ backgroundImage: `url(${post.PostImages?.[0]?.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400'})` }}
              >
                {!post.PostImages?.[0] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                    <Megaphone className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest",
                    post.status === 'ACTIVE' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    post.status === 'PENDING' ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {post.status === 'ACTIVE' ? "Đang hiển thị" : 
                     post.status === 'PENDING' ? "Chờ duyệt" : "Đã ẩn"}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-1">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-primary/60" />
                      <span className="font-semibold text-foreground">{post.Room?.Property?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 underline decoration-primary/20 underline-offset-4">
                      <MapPin className="w-4 h-4 text-primary/60" />
                      <span>{post.Room?.room_name}</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground line-clamp-2 leading-relaxed">{stripHtmlAndTruncate(post.content, 20)}</p>
                
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-xl text-xs font-bold text-muted-foreground">
                    <Eye className="w-4 h-4" /> 
                    <span>{post.view_count || 0} lượt xem</span>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                {user?.role === 'ADMIN' && post.status === 'PENDING' && (
                  <button 
                    onClick={() => handleApprove(post.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all text-sm font-bold border border-emerald-500/20"
                  >
                    <Check className="w-4 h-4" /> Duyệt tin
                  </button>
                )}
                <button 
                  onClick={() => handleEdit(post)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-muted/50 hover:bg-primary/10 text-primary rounded-xl transition-all text-sm font-bold border border-border hover:border-primary/20"
                >
                  <Edit className="w-4 h-4" /> {user?.role === 'ADMIN' ? 'Xem/Sửa' : 'Sửa tin'}
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-muted/50 hover:bg-red-500/10 text-red-500 rounded-xl transition-all text-sm font-bold border border-border hover:border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" /> Xóa tin
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-3xl p-20 text-center">
          <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 scale-110 shadow-inner">
            <Megaphone className="w-12 h-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-2xl font-bold">Chưa có tin đăng nào</h3>
          <p className="text-muted-foreground mt-3 max-w-sm mx-auto text-lg">
            Quảng bá phòng trọ của bạn với khách thuê bằng cách tạo tin đăng đầu tiên ngay bây giờ.
          </p>
          <button 
            onClick={() => {
              setEditingPost(null);
              setIsModalOpen(true);
            }}
            className="mt-10 bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            Đăng tin đầu tiên ngay
          </button>
        </div>
      )}

      {/* Pagination bar */}
      {!loading && pagination.totalPages > 1 && (
        <div className="bg-card border border-border rounded-3xl px-8 py-6 flex items-center justify-between shadow-lg shadow-foreground/5">
          <p className="text-sm font-medium text-muted-foreground font-heading">
            Hiển thị <span className="text-foreground font-bold">{posts.length}</span> trên <span className="text-foreground font-bold">{pagination.totalItems}</span> tin đăng
          </p>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchPosts(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-3 rounded-2xl bg-muted/50 border border-border hover:bg-muted disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + i}
                  onClick={() => fetchPosts(i + 1)}
                  className={cn(
                    "w-12 h-12 rounded-2xl font-bold transition-all shadow-sm",
                    pagination.currentPage === i + 1 
                      ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" 
                      : "bg-muted/50 border border-border hover:bg-muted"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => fetchPosts(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-3 rounded-2xl bg-muted/50 border border-border hover:bg-muted disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
        }}
        title={editingPost ? "Chỉnh sửa tin đăng" : "Đăng tin mới"}
        maxWidth="max-w-4xl"
      >
        <PostForm 
          initialData={editingPost}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditingPost(null);
            fetchPosts(pagination.currentPage);
          }} 
        />
      </Modal>
    </div>
  );
}
