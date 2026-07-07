"use client";

import React, { useState, useEffect } from "react";
import { billingService } from "@/services/api.service";
import { Receipt, Calendar, DollarSign, ChevronDown } from "lucide-react";

interface InvoiceFormProps {
  onSuccess: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    contract_id: "",
    invoice_date: new Date().toISOString().split('T')[0],
    service_fees: {
      electricity: "",
      water: "",
      internet: "100000",
      other: "0"
    },
  });
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await billingService.getContracts();
        setContracts(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, contract_id: res.data[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch contracts", err);
      }
    };
    fetchContracts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await billingService.createInvoice(formData);
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
          <label className="text-sm font-medium">Chọn hợp đồng khách thuê</label>
          <div className="relative">
            <select
              value={formData.contract_id}
              onChange={(e) => setFormData({ ...formData, contract_id: e.target.value })}
              className="w-full pl-4 pr-10 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all appearance-none"
              required
            >
              {contracts.length > 0 ? (
                contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.Room?.room_name} - {c.tenant?.Profiles?.[0]?.full_name || c.tenant?.email}
                  </option>
                ))
              ) : (
                <option value="">Không có hợp đồng hoạt động</option>
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ngày lập hóa đơn</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="date"
              value={formData.invoice_date}
              onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tiền điện (VNĐ)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={formData.service_fees.electricity}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  service_fees: { ...formData.service_fees, electricity: e.target.value } 
                })}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
                placeholder="4000/kWh"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tiền nước (VNĐ)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={formData.service_fees.water}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  service_fees: { ...formData.service_fees, water: e.target.value } 
                })}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
                placeholder="20000/khối"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Internet (VNĐ)</label>
            <input
              type="number"
              value={formData.service_fees.internet}
              onChange={(e) => setFormData({ 
                ...formData, 
                service_fees: { ...formData.service_fees, internet: e.target.value } 
              })}
              placeholder="Ví dụ: 100,000"
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Khác (VNĐ)</label>
            <input
              type="number"
              value={formData.service_fees.other}
              onChange={(e) => setFormData({ 
                ...formData, 
                service_fees: { ...formData.service_fees, other: e.target.value } 
              })}
              placeholder="Phí vệ sinh, rác..."
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading || contracts.length === 0}
          className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Xuất hóa đơn"}
        </button>
      </div>
    </form>
  );
}
