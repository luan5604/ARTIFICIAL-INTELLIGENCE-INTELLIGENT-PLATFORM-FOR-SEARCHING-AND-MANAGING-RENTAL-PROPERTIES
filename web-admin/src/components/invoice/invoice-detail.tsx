"use client";

import React from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, Printer, Download, MapPin, Mail, Phone, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoiceDetailProps {
  invoice: any;
  onClose?: () => void;
}

const statusConfig: any = {
  PAID: { label: "ĐÃ THANH TOÁN", icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-200" },
  UNPAID: { label: "CHƯA THANH TOÁN", icon: Clock, color: "text-blue-600 bg-blue-50 border-blue-200" },
  OVERDUE: { label: "QUÁ HẠN", icon: AlertCircle, color: "text-red-600 bg-red-50 border-red-200" },
};

export function InvoiceDetail({ invoice, onClose }: InvoiceDetailProps) {
  const status = statusConfig[invoice.payment_status] || statusConfig.UNPAID;
  const tenant = invoice.Contract?.tenant;
  const tenantProfile = tenant?.Profile;
  const room = invoice.Contract?.Room;
  const property = room?.Property;
  const landlord = property?.landlord;
  
  let serviceFees = invoice.service_fees;
  if (typeof serviceFees === 'string') {
    try {
      serviceFees = JSON.parse(serviceFees);
    } catch (e) {
      serviceFees = {};
    }
  }
  serviceFees = serviceFees || {};
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      {/* Action Bar - Hidden in print */}
      <div className="p-4 border-b flex justify-between items-center bg-slate-50 print:hidden">
        <h2 className="font-bold text-slate-700">Chi tiết hóa đơn #{invoice.id}</h2>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-slate-100 transition-all text-sm font-medium"
          >
            <Printer className="w-4 h-4" /> In hóa đơn
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-sm font-medium">
            <Download className="w-4 h-4" /> Tải về PDF
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-8 md:p-12 overflow-y-auto no-scrollbar print:p-0 print:overflow-visible overflow-x-hidden">
        <div className="max-w-3xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between gap-8 border-b pb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Building className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-primary">BOARDHOUSE</h1>
                  <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Hệ thống quản lý phòng trọ</p>
                </div>
              </div>
              <div className="text-sm text-slate-500 space-y-1">
                <p className="font-bold text-slate-700">{property?.name || "Tên nhà trọ"}</p>
                <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {property?.address_street}, {property?.ward}, {property?.district}, {property?.city}</p>
                <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {landlord?.phone || "N/A"}</p>
              </div>
            </div>

            <div className="text-left md:text-right space-y-2">
              <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border", status.color)}>
                <status.icon className="w-4 h-4" />
                {status.label}
              </div>
              <div className="pt-2">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mã hóa đơn</p>
                <p className="text-2xl font-black text-slate-800">HD-{invoice.id.toString().padStart(6, '0')}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ngày lập</p>
                <p className="text-base font-bold text-slate-700">{formatDate(invoice.invoice_date)}</p>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Khách thuê</p>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-800">{tenantProfile?.full_name || "Chưa cập nhật"}</p>
                <p className="text-sm text-slate-500 flex items-center gap-2"><Mail className="w-3 h-4" /> {tenant?.email}</p>
                <p className="text-sm text-slate-500 flex items-center gap-2"><Phone className="w-3 h-4" /> {tenantProfile?.phone || "N/A"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Thông tin phòng</p>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-800">{room?.room_name}</p>
                <p className="text-sm text-slate-500">Phòng diện tích: {room?.area}m²</p>
                <p className="text-sm text-slate-500">Vị trí: Tầng 1</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Chi tiết thanh toán</p>
            <div className="border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="px-6 py-4 font-bold text-left text-slate-600">Hạng mục</th>
                    <th className="px-6 py-4 font-bold text-center text-slate-600">Số lượng / Chỉ số</th>
                    <th className="px-6 py-4 font-bold text-right text-slate-600">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">Tiền phòng</p>
                      <p className="text-xs text-slate-400">Thanh toán theo tháng</p>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">1 tháng</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">{formatCurrency(invoice.Contract?.signed_price)}</td>
                  </tr>
                  {serviceFees.electricity > 0 && (
                    <tr>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">Tiền điện</p>
                        <p className="text-xs text-slate-400">4,000đ/kWh</p>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500">{Math.round(serviceFees.electricity / 4000)} kWh</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">{formatCurrency(serviceFees.electricity)}</td>
                    </tr>
                  )}
                  {serviceFees.water > 0 && (
                    <tr>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">Tiền nước</p>
                        <p className="text-xs text-slate-400">20,000đ/khối</p>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500">{Math.round(serviceFees.water / 20000)} khối</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">{formatCurrency(serviceFees.water)}</td>
                    </tr>
                  )}
                  {serviceFees.internet > 0 && (
                    <tr>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">Internet / Wifi</p>
                        <p className="text-xs text-slate-400">Trọn gói tháng</p>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500">1 tháng</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">{formatCurrency(serviceFees.internet)}</td>
                    </tr>
                  )}
                  {serviceFees.other > 0 && (
                    <tr>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">Chi phí khác</p>
                        <p className="text-xs text-slate-400">Dịch vụ bổ sung</p>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500">-</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">{formatCurrency(serviceFees.other)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-4">
            <div className="w-full md:w-64 space-y-4">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-sm">Tạm tính</span>
                <span className="font-medium">{formatCurrency(invoice.total_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 pb-4 border-b">
                <span className="text-sm">Thuế (0%)</span>
                <span className="font-medium">0đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-black text-slate-800">TỔNG CỘNG</span>
                <span className="text-xl font-black text-primary">{formatCurrency(invoice.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-12 border-t text-center space-y-6">
            <div className="flex justify-center gap-12">
              <div className="text-center space-y-12">
                <p className="text-sm font-bold text-slate-700">Người lập hóa đơn</p>
                <div className="h-1 bg-slate-100 w-32 mx-auto"></div>
                <p className="text-xs text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
              </div>
              <div className="text-center space-y-12">
                <p className="text-sm font-bold text-slate-700">Khách thuê nhận</p>
                <div className="h-1 bg-slate-100 w-32 mx-auto"></div>
                <p className="text-xs text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-8 uppercase tracking-widest leading-relaxed">
              Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.<br/>
              Mọi thắc mắc vui lòng liên hệ hotline: <span className="font-bold">0909-xxx-xxx</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
