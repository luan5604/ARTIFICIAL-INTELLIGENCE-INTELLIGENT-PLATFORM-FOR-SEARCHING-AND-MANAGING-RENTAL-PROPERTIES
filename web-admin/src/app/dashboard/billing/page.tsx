"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Trash2
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { billingService } from "@/services/api.service";
import { Modal } from "@/components/ui/modal";
import { ContractForm } from "@/components/forms/contract-form";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { EditInvoiceForm } from "@/components/forms/edit-invoice-form";
import { InvoiceDetail } from "@/components/invoice/invoice-detail";

const statusConfig: any = {
  PAID: { label: "Đã thanh toán", icon: CheckCircle2, color: "text-green-400 bg-green-500/10" },
  UNPAID: { label: "Chưa thanh toán", icon: Clock, color: "text-blue-400 bg-blue-500/10" },
  OVERDUE: { label: "Quá hạn", icon: AlertCircle, color: "text-red-400 bg-red-500/10" },
};

export default function BillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await billingService.getInvoices({
        page,
        limit: 10,
        search,
        status: status || undefined
      });
      setInvoices(res.data.data || []);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchInvoices();
  };
 
  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này không?")) return;
    try {
      await billingService.deleteInvoice(id);
      fetchInvoices();
    } catch (err: any) {
      alert(err.response?.data?.message || "Xóa hóa đơn thất bại.");
    }
  };
 
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hợp đồng & Hóa đơn</h1>
          <p className="text-muted-foreground mt-1">Theo dõi thanh toán và quản lý hợp đồng thuê nhà.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsContractModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl hover:bg-white/10 transition-all font-medium"
          >
            Tạo hợp đồng mới
          </button>
          <button 
            onClick={() => setIsInvoiceModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl premium-shadow hover:bg-primary/90 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Tạo hóa đơn tháng</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-green-500/10 text-green-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Đã thu tháng này</p>
            <h3 className="text-2xl font-bold">32,500k</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Chờ thanh toán</p>
            <h3 className="text-2xl font-bold">12,700k</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-red-500/10 text-red-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tổng nợ quá hạn</p>
            <h3 className="text-2xl font-bold">5,000k</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên khách, email hoặc phòng..." 
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary transition-all text-sm"
          />
        </form>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
            <button 
              onClick={() => setStatus("")}
              className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", !status ? "bg-primary text-white" : "hover:bg-white/5 text-muted-foreground")}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setStatus("UNPAID")}
              className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", status === "UNPAID" ? "bg-blue-500 text-white" : "hover:bg-white/5 text-muted-foreground")}
            >
              Chưa trả
            </button>
            <button 
              onClick={() => setStatus("PAID")}
              className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", status === "PAID" ? "bg-green-500 text-white" : "hover:bg-white/5 text-muted-foreground")}
            >
              Đã thu
            </button>
          </div>
          <button className="p-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-muted-foreground">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass rounded-2xl overflow-hidden premium-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-4 font-bold text-sm">Khách thuê</th>
                <th className="px-6 py-4 font-bold text-sm">Phòng</th>
                <th className="px-6 py-4 font-bold text-sm text-center">Ngày lập</th>
                <th className="px-6 py-4 font-bold text-sm text-right">Tổng tiền</th>
                <th className="px-6 py-4 font-bold text-sm text-center">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-sm text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">Đang tải dữ liệu...</td></tr>
              ) : invoices.length > 0 ? (
                invoices.map((invoice) => {
                  const statusInfo = statusConfig[invoice.payment_status] || statusConfig.UNPAID;
                  return (
                    <tr key={invoice.id} className="hover:bg-white/5 group transition-all">
                      <td className="px-6 py-4">
                        <div className="font-black text-primary">
                          {invoice.Contract?.tenant?.Profile?.full_name || "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">{invoice.Contract?.tenant?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-primary">
                            {invoice.Contract?.Room?.Property?.name}
                          </div>
                          <span className="text-sm font-medium">{invoice.Contract?.Room?.room_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-center font-medium text-muted-foreground">
                        {formatDate(invoice.invoice_date)}
                      </td>
                      <td className="px-6 py-4 font-black text-right text-primary">
                        {formatCurrency(invoice.total_amount)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full w-fit mx-auto text-[10px] font-black tracking-wider", statusInfo.color)}>
                          <statusInfo.icon className="w-3 h-3" />
                          {statusInfo.label.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => setSelectedInvoice(invoice)}
                            className="p-2 hover:bg-primary/20 hover:text-primary text-muted-foreground rounded-lg transition-all" 
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingInvoice(invoice);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all" 
                            title="Cập nhật trạng thái"
                          >
                            <RefreshCw className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button 
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all" 
                            title="Xóa hóa đơn"
                          >
                            <Trash2 className="w-4 h-4 text-destructive/70" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Không tìm thấy hóa đơn nào phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-white/2">
          <p className="text-xs text-muted-foreground italic">
            Hiển thị <span className="text-primary font-black">{invoices.length}</span> trên <span className="text-primary font-black">{pagination.totalItems}</span> hóa đơn
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    page === p ? "bg-primary text-white" : "hover:bg-white/5 text-muted-foreground"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <button 
              disabled={page === pagination.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        title="Tạo hợp đồng mới"
        maxWidth="max-w-4xl"
      >
        <ContractForm 
          onSuccess={() => {
            setIsContractModalOpen(false);
            fetchInvoices();
          }} 
        />
      </Modal>

      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Xuất hóa đơn mới"
        maxWidth="max-w-4xl"
      >
        <InvoiceForm 
          onSuccess={() => {
            setIsInvoiceModalOpen(false);
            fetchInvoices();
          }} 
        />
      </Modal>

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title=""
        maxWidth="max-w-4xl"
        contentClassName="p-0 overflow-visible"
      >
        {selectedInvoice && (
          <InvoiceDetail 
            invoice={selectedInvoice} 
            onClose={() => setSelectedInvoice(null)} 
          />
        )}
      </Modal>
 
      {/* Edit Invoice Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Cập nhật trạng thái hóa đơn"
      >
        {editingInvoice && (
          <EditInvoiceForm 
            invoice={editingInvoice}
            onSuccess={() => {
              setIsEditModalOpen(false);
              fetchInvoices();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
