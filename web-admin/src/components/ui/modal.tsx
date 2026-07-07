"use client";

import { X } from "lucide-react";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  contentClassName?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-2xl", contentClassName }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden",
              maxWidth
            )}
          >
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-xl font-bold">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {!title && (
              <button 
                onClick={onClose} 
                className="absolute right-4 top-4 z-10 p-2 hover:bg-muted rounded-full transition-colors bg-white/50 backdrop-blur-md border border-slate-100 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className={cn("p-6 max-h-[85vh] overflow-y-auto no-scrollbar", contentClassName)}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
