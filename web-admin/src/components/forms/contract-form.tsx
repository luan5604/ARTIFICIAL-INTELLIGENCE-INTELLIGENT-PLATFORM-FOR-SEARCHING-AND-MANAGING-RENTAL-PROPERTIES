"use client";

import React, { useState, useEffect } from "react";
import { propertyService, billingService } from "@/services/api.service";
import { FileText, User, Calendar, DollarSign, ChevronDown } from "lucide-react";

interface ContractFormProps {
  onSuccess: () => void;
}

export function ContractForm({ onSuccess }: ContractFormProps) {
  const [formData, setFormData] = useState({
    room_id: "",
    tenant_email: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    signed_price: "",
    signed_deposit: "",
    billing_cycle: "MONTHLY",
  });
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await propertyService.getAll();
        const availableRooms = (res.data.data || []).flatMap((p: any) => 
          p.Rooms.filter((r: any) => r.status === 'AVAILABLE')
            .map((r: any) => ({ ...r, property_name: p.name }))
        );
        setRooms(availableRooms);
        if (availableRooms.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            room_id: availableRooms[0].id,
            signed_price: availableRooms[0].base_price,
            signed_deposit: availableRooms[0].deposit_amount
          }));
        }
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };
    fetchRooms();
  }, []);

  const handleRoomChange = (roomId: string) => {
    const room = rooms.find(r => r.id === parseInt(roomId));
    if (room) {
      setFormData({
        ...formData,
        room_id: roomId,
        signed_price: room.base_price,
        signed_deposit: room.deposit_amount
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await billingService.createContract(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng kiểm tra email người thuê.");
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
          <label className="text-sm font-medium">Chọn phòng trống</label>
          <div className="relative">
            <select
              value={formData.room_id}
              onChange={(e) => handleRoomChange(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all appearance-none"
              required
            >
              {rooms.length > 0 ? (
                rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.property_name} - {r.room_name}</option>
                ))
              ) : (
                <option value="">Không có phòng trống</option>
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email khách thuê (Phải đã có tài khoản)</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={formData.tenant_email}
              onChange={(e) => setFormData({ ...formData, tenant_email: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
              placeholder="tenant@example.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ngày bắt đầu</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all text-sm"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ngày kết thúc</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Giá ký kết (VNĐ)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={formData.signed_price}
                onChange={(e) => setFormData({ ...formData, signed_price: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
                placeholder="Ví dụ: 3,500,000"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tiền cọc (VNĐ)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={formData.signed_deposit}
                onChange={(e) => setFormData({ ...formData, signed_deposit: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
                placeholder="Ví dụ: 3,500,000"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading || rooms.length === 0}
          className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Ký hợp đồng"}
        </button>
      </div>
    </form>
  );
}
