"use client";

import React, { useState } from "react";
import { User, Bell, Shield, LogOut, Save, Camera, Loader2, Key, Lock, Phone, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { authService } from "@/services/api.service";

type SettingsTab = "profile" | "notifications" | "security";

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cccd: "",
    notifications: true,
    darkMode: true,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await authService.getMe();
      const profileData = res.data;
      setFormData({
        name: profileData.Profile?.full_name || "",
        email: profileData.email || "",
        phone: profileData.phone_number || "",
        cccd: profileData.Profile?.id_card_number || "",
        notifications: true,
        darkMode: true,
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await authService.updateProfile({
        full_name: formData.name,
        phone_number: formData.phone,
        id_card_number: formData.cccd
      });
      
      if (user) {
        updateUser({ 
          ...user, 
          name: formData.name,
          phone_number: formData.phone
        } as any);
      }
      setMessage("Cập nhật hồ sơ thành công!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error("Failed to update profile", error);
      setMessage(`Lỗi: ${error.response?.data?.message || "Không thể cập nhật hồ sơ."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Lỗi: Mật khẩu xác nhận không khớp.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage("Đổi mật khẩu thành công!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessage(`Lỗi: ${error.response?.data?.message || "Không thể đổi mật khẩu."}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Đang tải hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground mt-1">Quản lý hồ sơ cá nhân và cấu hình ứng dụng.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("profile")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                activeTab === "profile" 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="w-5 h-5" />
              Hồ sơ
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                activeTab === "notifications" 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Bell className="w-5 h-5" />
              Thông báo
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                activeTab === "security" 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Shield className="w-5 h-5" />
              Bảo mật
            </button>
          </nav>

          <div className="pt-4 mt-4 border-t border-border">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/5 rounded-xl font-medium transition-all"
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          {message && (
            <div className={cn(
              "p-4 rounded-xl text-sm font-medium animate-in fade-in zoom-in duration-300",
              message.startsWith("Lỗi") ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"
            )}>
              {message}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="glass p-8 rounded-3xl space-y-8 premium-shadow">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-primary premium-shadow overflow-hidden text-2xl font-black rotate-3 hover:rotate-0 transition-all duration-300">
                    {formData.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-3 bg-white text-primary rounded-2xl shadow-xl hover:scale-110 transition-all border border-slate-100">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">{formData.name || "Chưa cập nhật"}</h3>
                  <p className="text-slate-500 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {user?.role === 'ADMIN' ? 'Quản trị viên hệ thống' : 'Chủ trọ / Quản lý'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Số CCCD / ID Card</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.cccd}
                      onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                      placeholder="12 chữ số"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Email (Không thể thay đổi)</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3.5 bg-slate-100 border-2 border-transparent rounded-2xl outline-none opacity-60 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-primary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 active:scale-95"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Cập nhật hồ sơ
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="glass p-8 rounded-3xl space-y-8 premium-shadow">
              <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-primary" />
                  Thay đổi mật khẩu
                </h3>
                <p className="text-slate-500 text-sm mt-1">Sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn.</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Mật khẩu mới</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        placeholder="Mật khẩu mới (6+ ký tự)"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        placeholder="Nhập lại mật khẩu mới"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 active:scale-95"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="glass p-8 rounded-3xl space-y-4 premium-shadow">
              <h3 className="text-xl font-black text-slate-800">Cấu hình thông báo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-800">Thông báo đẩy</p>
                    <p className="text-sm text-slate-500">Nhận thông báo khi có hợp đồng mới hoặc hóa đơn đến hạn.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.notifications} onChange={() => setFormData({...formData, notifications: !formData.notifications})} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
