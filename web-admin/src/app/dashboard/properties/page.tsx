"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Loader2, 
  Home, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  MapPin
} from "lucide-react";
import { PropertyCard } from "@/components/ui/property-card";
import { propertyService } from "@/services/api.service";
import { Modal } from "@/components/ui/modal";
import { PropertyForm } from "@/components/forms/property-form";
import { cn } from "@/lib/utils";

// Native debounce implementation
function debounce(fn: Function, ms: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    district: "",
    ward: ""
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 6
  });

  const fetchProperties = async (
    page = 1, 
    search = searchTerm, 
    city = filters.city, 
    district = filters.district,
    ward = filters.ward
  ) => {
    setLoading(true);
    try {
      const response = await propertyService.getAll({
        page,
        limit: pagination.limit,
        search,
        city,
        district,
        ward
      });
      setProperties(response.data.data);
      setPagination({
        ...pagination,
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalItems: response.data.pagination.totalItems
      });
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedFetch = useCallback(
    debounce((term: string) => fetchProperties(1, term), 500),
    [filters] // Re-create if filters change to capture latest
  );

  useEffect(() => {
    fetchProperties(1);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetch(value);
  };

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    fetchProperties(1, searchTerm, newFilters.city, newFilters.district, newFilters.ward);
  };

  const resetFilters = () => {
    const blankFilters = { city: "", district: "", ward: "" };
    setFilters(blankFilters);
    setSearchTerm("");
    fetchProperties(1, "", "", "", "");
  };

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa tòa nhà này và tất cả phòng liên quan?")) {
      try {
        await propertyService.delete(id);
        fetchProperties(pagination.currentPage);
      } catch (error) {
        console.error("Failed to delete property", error);
        alert("Không thể xóa tòa nhà. Vui lòng thử lại.");
      }
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn duyệt tòa nhà này?")) return;
    try {
      await propertyService.approveProperty(id);
      fetchProperties(pagination.currentPage);
    } catch (error) {
      console.error("Failed to approve property", error);
    }
  };

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">Danh sách nhà cho thuê</h1>
          <p className="text-muted-foreground mt-1 text-lg">Quản lý và theo dõi các khu trọ của bạn một cách chuyên nghiệp.</p>
        </div>
        <button 
          onClick={() => { setEditingProperty(null); setIsModalOpen(true); }}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5"
        >
          <Plus className="w-6 h-6" />
          Thêm nhà mới
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên nhà hoặc địa chỉ chính xác..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
          <select 
            value={filters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className="px-4 py-3.5 bg-card border border-border rounded-2xl outline-none focus:border-primary transition-all appearance-none cursor-pointer shadow-sm font-medium"
          >
            <option value="">Tất cả thành phố</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
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
          <div className="p-6 bg-card border border-border rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Quận / Huyện</label>
              <input
                type="text"
                placeholder="Ví dụ: Quận 10"
                value={filters.district}
                onChange={(e) => handleFilterChange("district", e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl outline-none focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Phường / Xã</label>
              <input
                type="text"
                placeholder="Ví dụ: Phường 12"
                value={filters.ward}
                onChange={(e) => handleFilterChange("ward", e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl outline-none focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={resetFilters}
                className="w-full py-3 text-muted-foreground hover:text-foreground font-bold transition-colors flex items-center justify-center gap-2 bg-muted/30 hover:bg-muted/60 rounded-xl"
              >
                Đặt lại tất cả
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Đang tối ưu danh sách hiển thị...</p>
        </div>
      ) : properties.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                name={property.name}
                address={`${property.address_street}, ${property.ward}, ${property.district}, ${property.city}`}
                rooms={property.Rooms?.length || 0}
                status={property.status}
                image={property.image_url || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800"}
                onEdit={() => handleEdit(property)}
                onDelete={() => handleDelete(property.id)}
                onApprove={() => handleApprove(property.id)}
                isAdmin={user?.role === 'ADMIN'}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button 
                onClick={() => fetchProperties(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-3 rounded-xl bg-card border border-border hover:bg-muted disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => fetchProperties(i + 1)}
                    className={cn(
                      "w-12 h-12 rounded-xl font-bold transition-all shadow-sm",
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
                onClick={() => fetchProperties(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-3 rounded-xl bg-card border border-border hover:bg-muted disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card border-2 border-dashed border-border rounded-3xl p-20 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <Home className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Không tìm thấy khu trọ phù hợp</h3>
          <p className="text-muted-foreground max-w-sm mx-auto text-lg">
            Hãy điều chỉnh lại bộ lọc hoặc thêm khu nhà mới để bắt đầu quản lý.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={resetFilters}
              className="px-6 py-3 font-bold text-muted-foreground hover:text-foreground transition-all"
            >
              Xóa bộ lọc
            </button>
            <button 
              onClick={() => { setEditingProperty(null); setIsModalOpen(true); }}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Thêm nhà mới ngay
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProperty(null); }}
        title={editingProperty ? "Chỉnh sửa thông tin nhà" : "Đăng ký khu trọ mới"}
      >
        <PropertyForm 
          initialData={editingProperty}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditingProperty(null);
            fetchProperties(pagination.currentPage);
          }} 
        />
      </Modal>
    </div>
  );
}
