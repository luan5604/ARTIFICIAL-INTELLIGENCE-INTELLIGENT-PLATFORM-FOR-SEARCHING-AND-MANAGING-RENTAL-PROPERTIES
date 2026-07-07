"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Loader2, 
  Bed, 
  Pencil, 
  Trash2, 
  Home, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Eye
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { propertyService } from "@/services/api.service";
import { Modal } from "@/components/ui/modal";
import { RoomForm } from "@/components/forms/room-form";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    property_id: "",
    status: "",
    min_price: "",
    max_price: ""
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const res = await propertyService.getAll({ limit: 100 });
        setProperties(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch properties for filter", err);
      }
    };
    fetchSelectData();
  }, []);

  const fetchRooms = async (
    page = 1, 
    search = searchTerm, 
    propId = filters.property_id, 
    status = filters.status,
    minP = filters.min_price,
    maxP = filters.max_price
  ) => {
    setLoading(true);
    try {
      const res = await propertyService.getMyRooms({
        page,
        limit: pagination.limit,
        search,
        property_id: propId,
        status,
        min_price: minP,
        max_price: maxP
      });
      setRooms(res.data.data);
      setPagination({
        ...pagination,
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        totalItems: res.data.pagination.totalItems
      });
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(1);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Use the native debounce logic if needed, but for simplicity we'll just fetch normally since it's a small app
  };

  // Dedicated fetch for search to be triggered by button or ENTER
  const handleSearchClick = () => {
    fetchRooms(1);
  };

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    fetchRooms(1, searchTerm, newFilters.property_id, newFilters.status, newFilters.min_price, newFilters.max_price);
  };

  const resetFilters = () => {
    const blank = { property_id: "", status: "", min_price: "", max_price: "" };
    setFilters(blank);
    setSearchTerm("");
    fetchRooms(1, "", "", "", "", "");
  };

  const handleEdit = (room: any) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        await propertyService.deleteRoom(id);
        fetchRooms(pagination.currentPage);
      } catch (error) {
        console.error("Failed to delete room", error);
        alert("Không thể xóa phòng. Vui lòng thử lại.");
      }
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn duyệt phòng này?")) return;
    try {
      await propertyService.approveRoom(id);
      fetchRooms(pagination.currentPage);
    } catch (error) {
      console.error("Failed to approve room", error);
    }
  };

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Danh sách phòng trọ</h1>
          <p className="text-muted-foreground mt-1 text-lg">Quản lý chuyên nghiệp từng đơn vị phòng, trạng thái và giá thuê.</p>
        </div>
        <button 
          onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5"
        >
          <Plus className="w-6 h-6" />
          Thêm phòng mới
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo tên phòng (Số phòng)..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
              className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-3.5 bg-card border border-border rounded-2xl outline-none focus:border-primary transition-all shadow-sm font-medium appearance-none cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="AVAILABLE">Trống</option>
            <option value="RENTED">Đã thuê</option>
            <option value="DEPOSITED">Đã cọc</option>
            <option value="MAINTENANCE">Bảo trì</option>
          </select>
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border transition-all font-semibold shadow-sm",
              showAdvancedFilters 
                ? "bg-primary/10 border-primary text-primary" 
                : "bg-card border-border hover:bg-muted text-foreground"
            )}
          >
            <Filter className="w-5 h-5" />
            {showAdvancedFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
          </button>
        </div>

        {showAdvancedFilters && (
          <div className="p-6 bg-card border border-border rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Khu trọ / Nhà</label>
              <select
                value={filters.property_id}
                onChange={(e) => handleFilterChange("property_id", e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl outline-none focus:border-primary transition-all"
              >
                <option value="">Chọn khu trọ</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Giá từ (VNĐ)</label>
              <input
                type="number"
                placeholder="Ví dụ: 2000000"
                value={filters.min_price}
                onChange={(e) => handleFilterChange("min_price", e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl outline-none focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Giá đến (VNĐ)</label>
              <input
                type="number"
                placeholder="Ví dụ: 5000000"
                value={filters.max_price}
                onChange={(e) => handleFilterChange("max_price", e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl outline-none focus:border-primary transition-all"
              />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button 
                onClick={resetFilters}
                className="px-8 py-2.5 text-muted-foreground hover:text-foreground font-bold transition-colors bg-muted/30 hover:bg-muted/60 rounded-xl"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-foreground/5 mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">Tên phòng</th>
                <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">Khu trọ</th>
                <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">Diện tích</th>
                <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">Giá thuê</th>
                <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground text-center">Trạng thái</th>
                <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium text-lg">Đang tổng hợp dữ liệu phòng...</p>
                  </td>
                </tr>
              ) : rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-8 py-5 font-bold text-lg">{room.room_name}</td>
                    <td className="px-8 py-5 text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-primary" />
                        {room.Property?.name || room.property_name}
                      </div>
                    </td>
                    <td className="px-8 py-5 font-medium">{room.area} m²</td>
                    <td className="px-8 py-5 text-primary font-bold text-lg">{formatCurrency(room.base_price)}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={cn(
                        "inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                        room.status === 'AVAILABLE' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        room.status === 'PENDING' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        room.status === 'RENTED' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        room.status === 'DEPOSITED' ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {room.status === 'AVAILABLE' ? 'Trống' : 
                         room.status === 'PENDING' ? 'Chờ duyệt' :
                         room.status === 'RENTED' ? 'Đã thuê' : 
                         room.status === 'DEPOSITED' ? 'Đã cọc' : 'Bảo trì'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        {user?.role === 'ADMIN' && room.status === 'PENDING' && (
                          <button 
                            onClick={() => handleApprove(room.id)}
                            className="p-3 hover:bg-emerald-500/10 text-emerald-500 rounded-xl transition-colors shadow-sm bg-muted/50 border border-border"
                            title="Duyệt"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleEdit(room)}
                          className="p-3 hover:bg-primary/10 text-primary rounded-xl transition-colors shadow-sm bg-muted/50 border border-border"
                          title={user?.role === 'ADMIN' ? "Xem" : "Sửa"}
                        >
                          {user?.role === 'ADMIN' ? <Eye className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => handleDelete(room.id)}
                          className="p-3 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors shadow-sm bg-muted/50 border border-border"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-6 overflow-hidden border border-border">
                      <Bed className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold">Không tìm thấy phòng nào</h3>
                    <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                      Hãy điều chỉnh bộ lọc hoặc thêm phòng mới vào khu trọ.
                    </p>
                    <button 
                      onClick={resetFilters}
                      className="mt-6 text-primary font-bold hover:underline"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination bar */}
        {!loading && pagination.totalPages > 1 && (
          <div className="bg-muted/30 border-t border-border px-8 py-6 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Hiển thị <span className="text-foreground font-bold">{rooms.length}</span> trên <span className="text-foreground font-bold">{pagination.totalItems}</span> phòng
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => fetchRooms(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-3 rounded-2xl bg-card border border-border hover:bg-muted disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => fetchRooms(i + 1)}
                    className={cn(
                      "w-12 h-12 rounded-2xl font-bold transition-all shadow-sm",
                      pagination.currentPage === i + 1 
                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" 
                        : "bg-card border border-border hover:bg-muted"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => fetchRooms(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-3 rounded-2xl bg-card border border-border hover:bg-muted disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingRoom(null); }}
        title={editingRoom ? "Chỉnh sửa thông tin phòng" : "Thêm đơn vị phòng mới"}
      >
        <RoomForm 
          initialData={editingRoom}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditingRoom(null);
            fetchRooms(pagination.currentPage);
          }} 
        />
      </Modal>
    </div>
  );
}
