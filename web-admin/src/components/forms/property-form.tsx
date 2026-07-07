"use client";

import React, { useState } from "react";
import { propertyService } from "@/services/api.service";
import { Home, MapPin, AlignLeft, Info } from "lucide-react";

interface PropertyFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function PropertyForm({ onSuccess, initialData }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    address_street: initialData?.address_street || "",
    ward: initialData?.ward || "",
    district: initialData?.district || "",
    city: initialData?.city || "Hồ Chí Minh",
    description: initialData?.description || "",
    general_rules: initialData?.general_rules || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (initialData?.id) {
        await propertyService.update(initialData.id, formData);
      } else {
        await propertyService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tên nhà/khu trọ</label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
              placeholder="Ví dụ: Blue House Apartment"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Địa chỉ chi tiết</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={formData.address_street}
              onChange={(e) => setFormData({ ...formData, address_street: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
              placeholder="Số nhà, tên đường..."
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Phường/Xã</label>
            <input
              value={formData.ward}
              onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
              placeholder="Ví dụ: Phường 10"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quận/Huyện</label>
            <input
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
              placeholder="Ví dụ: Quận 10"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Thành phố</label>
            <input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
              placeholder="Ví dụ: Hồ Chí Minh"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mô tả tổng quát</label>
          <div className="relative">
            <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all min-h-[100px]"
              placeholder="Mô tả về khu nhà, tiện ích chung..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quy định chung</label>
          <div className="relative">
            <Info className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <textarea
              value={formData.general_rules}
              onChange={(e) => setFormData({ ...formData, general_rules: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all min-h-[80px]"
              placeholder="Luật nhà, giờ giấc, rác thải..."
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
}
