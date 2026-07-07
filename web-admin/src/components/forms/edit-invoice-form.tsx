"use client";
 
import React, { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { billingService } from "@/services/api.service";
 
interface EditInvoiceFormProps {
  invoice: any;
  onSuccess: () => void;
}
 
export function EditInvoiceForm({ invoice, onSuccess }: EditInvoiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    payment_status: "",
    invoice_date: "",
    service_fees: {
      electricity: 0,
      water: 0,
      internet: 0,
      other: 0
    }
  });
 
  useEffect(() => {
    if (invoice) {
      let parsedFees = invoice.service_fees;
      if (typeof parsedFees === 'string') {
        try {
          parsedFees = JSON.parse(parsedFees);
        } catch (e) {
          parsedFees = {};
        }
      }
      parsedFees = parsedFees || {};

      setFormData({
        payment_status: invoice.payment_status || "UNPAID",
        invoice_date: invoice.invoice_date || "",
        service_fees: {
          electricity: parsedFees.electricity || 0,
          water: parsedFees.water || 0,
          internet: parsedFees.internet || 0,
          other: parsedFees.other || 0
        }
      });
    }
  }, [invoice]);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await billingService.updateInvoice(invoice.id, {
        payment_status: formData.payment_status,
        invoice_date: formData.invoice_date
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Cập nhật hóa đơn thất bại.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
 
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Trạng thái thanh toán</label>
          <select
            value={formData.payment_status}
            onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all capitalize"
            required
          >
            <option value="UNPAID">Chưa thanh toán</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="OVERDUE">Quá hạn</option>
          </select>
        </div>
 
        <div className="space-y-2">
          <label className="text-sm font-medium">Ngày lập hóa đơn</label>
          <input
            type="date"
            value={formData.invoice_date}
            onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl outline-none focus:border-primary transition-all"
            required
          />
        </div>
      </div>
 
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold premium-shadow disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Cập nhật
        </button>
      </div>
    </form>
  );
}
