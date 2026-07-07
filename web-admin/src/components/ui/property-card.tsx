"use client";

import { MapPin, Home, Bed, TrendingUp, Pencil, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PropertyCardProps {
  id: number;
  name: string;
  address: string;
  rooms: number;
  status: string;
  image?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  isAdmin?: boolean;
}

export function PropertyCard({ id, name, address, rooms, status, image, onEdit, onDelete, onApprove, isAdmin }: PropertyCardProps) {
  const statusConfig: any = {
    'PENDING': { label: 'Chờ duyệt', color: 'bg-amber-500' },
    'ACTIVE': { label: 'Hoạt động', color: 'bg-emerald-500' },
    'HIDDEN': { label: 'Đã ẩn', color: 'bg-slate-500' },
    'REJECTED': { label: 'Bị từ chối', color: 'bg-rose-500' }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass overflow-hidden rounded-2xl premium-shadow group border border-border transition-all duration-300 bg-card hover:bg-card/80"
    >
      <div className="h-48 bg-muted relative overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Home className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          {isAdmin && status === 'PENDING' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onApprove?.(); }}
              className="p-2 bg-emerald-500/20 backdrop-blur-md hover:bg-emerald-500/40 text-emerald-400 rounded-lg transition-all"
              title="Duyệt"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
            className="p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-lg transition-all"
            title="Sửa"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="p-2 bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 text-red-400 rounded-lg transition-all"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className={cn("absolute bottom-4 left-4 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg", statusConfig[status]?.color || 'bg-primary')}>
          {statusConfig[status]?.label || status}
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{rooms} phòng</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">Đang hoạt động</span>
          </div>
        </div>

        <button className="w-full py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-all">
          Quản lý chi tiết
        </button>
      </div>
    </motion.div>
  );
}
