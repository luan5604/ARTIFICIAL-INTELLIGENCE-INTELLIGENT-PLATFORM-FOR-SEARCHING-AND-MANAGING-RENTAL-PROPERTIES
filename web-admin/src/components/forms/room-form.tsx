"use client";

import React, { useState, useEffect, useRef } from "react";
import { propertyService, uploadService } from "@/services/api.service";
import { Bed, Maximize, Users, DollarSign, ShieldCheck, ChevronDown, Image as ImageIcon, Loader2, X, Plus } from "lucide-react";

interface RoomFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function RoomForm({ onSuccess, initialData }: RoomFormProps) {
  const [formData, setFormData] = useState({
    property_id: initialData?.property_id || "",
    room_name: initialData?.room_name || "",
    area: initialData?.area || "",
    max_occupants: initialData?.max_occupants || 2,
    base_price: initialData?.base_price || "",
    deposit_amount: initialData?.deposit_amount || "",
    has_mezzanine: initialData?.has_mezzanine || false,
    images: initialData?.images || [],
  });
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await propertyService.getAll({ limit: 100 });
        const props = response.data.data || [];
        setProperties(props);
        if (props.length > 0 && !formData.property_id) {
          setFormData(prev => ({ ...prev, property_id: props[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
      }
    };
    fetchProperties();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), res.data.url]
      }));
    } catch (err) {
      setError("Không thể upload ảnh.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_val: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (initialData?.id) {
        await propertyService.updateRoom(initialData.id, formData);
      } else {
        await propertyService.createRoom(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Chọn nhà/khu trọ</label>
          <div className="relative">
            <select
              value={formData.property_id}
              onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
              className="w-full pl-4 pr-10 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-primary transition-all appearance-none font-medium"
              required
            >
              <option value="">-- Chọn nhà/khu trọ --</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tên/Số phòng</label>
            <div className="relative">
              <Bed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                value={formData.room_name}
                onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-primary transition-all font-semibold"
                placeholder="Phòng 101"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Diện tích (m²)</label>
            <div className="relative">
              <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-primary transition-all font-semibold"
                placeholder="25"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Giá thuê (VNĐ/tháng)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-primary transition-all font-bold text-primary"
                placeholder="5000000"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Số tiền cọc (VNĐ)</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={formData.deposit_amount}
                onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-primary transition-all font-bold"
                placeholder="5000000"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Số người tối đa</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={formData.max_occupants}
                onChange={(e) => setFormData({ ...formData, max_occupants: parseInt(e.target.value) })}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-primary transition-all font-semibold"
                placeholder="Ví dụ: 2"
                required
              />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer pt-6 select-none group">
            <input
              type="checkbox"
              checked={formData.has_mezzanine}
              onChange={(e) => setFormData({ ...formData, has_mezzanine: e.target.checked })}
              className="w-6 h-6 rounded-lg border-border text-primary focus:ring-primary transition-all"
            />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Có gác lửng?</span>
          </label>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Hình ảnh phòng</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formData.images?.map((url: string, index: number) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                <img src={url} alt={`Room ${index}`} className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {(!formData.images || formData.images.length < 8) && (
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer group disabled:opacity-50"
              >
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    <span className="text-[10px] font-bold text-primary mt-1 uppercase">Tải...</span>
                  </div>
                ) : (
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
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

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading || properties.length === 0 || uploading}
          className="flex-1 py-4 bg-primary text-white rounded-2xl font-extrabold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 uppercase tracking-widest"
        >
          {loading ? "Đang xử lý..." : properties.length === 0 ? "Vui lòng tạo nhà trước" : initialData ? "Cập nhật thông tin" : "Thêm phòng mới"}
        </button>
      </div>
    </form>
  );
}
