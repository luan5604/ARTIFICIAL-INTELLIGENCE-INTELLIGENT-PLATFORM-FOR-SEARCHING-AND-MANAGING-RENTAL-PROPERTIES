"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { propertyService, postService, uploadService } from "@/services/api.service";
import { Megaphone, Bed, FileText, Image as ImageIcon, ChevronDown, Loader2, X, Check, Star } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface PostFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function PostForm({ onSuccess, initialData }: PostFormProps) {
  const [formData, setFormData] = useState({
    room_id: initialData?.room_id || "",
    title: initialData?.title || "",
    content: initialData?.content || "",
    is_active: initialData?.status === 'ACTIVE' || initialData?.is_active !== false,
    images: initialData?.PostImages?.map((img: any) => img.image_url) || [],
  });
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await propertyService.getMyRooms({ limit: 100 });
        const allRooms = res.data.data.map((r: any) => ({
          ...r,
          property_name: r.Property?.name
        }));
        setRooms(allRooms);
        if (allRooms.length > 0 && !formData.room_id) {
          setFormData((prev: any) => ({ ...prev, room_id: allRooms[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };
    fetchRooms();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const res = await uploadService.uploadImage(file);
      setFormData((prev: any) => ({
        ...prev,
        images: [...prev.images, res.data.url]
      }));
    } catch (err: any) {
      setError("Không thể upload ảnh. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.filter((_val: any, i: number) => i !== index)
    }));
  };

  const setMainImage = (index: number) => {
    const newImages = [...formData.images];
    const [main] = newImages.splice(index, 1);
    newImages.unshift(main);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (initialData?.id) {
        await postService.update(initialData.id, formData);
      } else {
        await postService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'color'],
      ['clean']
    ],
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-1">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Chọn phòng muốn đăng tin</label>
          <div className="relative">
            <select
              value={formData.room_id}
              onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
              className="w-full pl-4 pr-10 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-primary transition-all appearance-none font-medium"
              required
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((r: any) => (
                <option key={r.id} value={r.id}>{r.property_name} - {r.room_name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tiêu đề tin đăng</label>
          <div className="relative">
            <Megaphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-primary transition-all font-semibold text-lg"
              placeholder="Ví dụ: Phòng Studio cao cấp, đầy đủ nội thất, Quận 1"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Nội dung chi tiết (Word Style)</label>
          <div className="rounded-2xl border border-border overflow-hidden bg-card box-content">
            <ReactQuill 
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              modules={quillModules}
              placeholder="Mô tả chi tiết về phòng, tiện ích, vị trí, giờ giấc..."
              className="h-64 mb-12"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Hình ảnh tin đăng</label>
            <span className="text-xs text-muted-foreground">{formData.images.length}/5 ảnh</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.images.map((url: string, index: number) => (
              <div key={index} className="relative aspect-video rounded-2xl overflow-hidden group border border-border shadow-sm">
                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {index !== 0 && (
                    <button 
                      type="button"
                      onClick={() => setMainImage(index)}
                      className="p-2 bg-white text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-lg"
                      title="Đặt làm ảnh chính"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    title="Xóa ảnh"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow-lg">
                    <Check className="w-3 h-3" /> ẢNH CHÍNH
                  </div>
                )}
              </div>
            ))}
            
            {formData.images.length < 5 && (
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-video border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer group disabled:opacity-50"
              >
                {uploading ? (
                   <div className="flex flex-col items-center">
                     <Loader2 className="w-8 h-8 text-primary animate-spin" />
                     <span className="text-[10px] font-bold text-primary mt-2 uppercase">Đang tải...</span>
                   </div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-primary mt-2">Thêm ảnh mới</span>
                  </>
                )}
              </button>
            )}
            <input 
              ref={fileInputRef} 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 sticky bottom-0 bg-background/80 backdrop-blur-md py-4 border-t border-border mt-auto">
        <button
          type="submit"
          disabled={loading || rooms.length === 0 || uploading}
          className="flex-1 py-4 bg-primary text-white rounded-2xl font-extrabold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 hover:-translate-y-0.5 uppercase tracking-wide"
        >
          {loading ? "Đang xử lý..." : rooms.length === 0 ? "Vui lòng thêm phòng trước" : initialData ? "Cập nhật tin đăng" : "Đăng tin ngay"}
        </button>
      </div>
    </form>
  );
}
