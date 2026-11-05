import {
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { useCurrentUser, useLogout } from "~/features/auth/hooks/use-auth";
import { cn } from "~/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const userInitial = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()
    : "AD";
  const displayName = user?.name || "Admin Dinas";

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Kelola Laporan",
      href: "/admin/reports",
      icon: FileSpreadsheet,
    },
    {
      name: "Kelola Pengguna",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Profil Admin",
      href: "/admin/profile",
      icon: User,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f8f6]">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#2e4a21]/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#2e4a21] text-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-[#3b5d2b]">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#259e73] text-white shadow-xs group-hover:bg-[#1f8561] transition-colors">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                Smart Waste
              </span>
              <span className="text-xs font-medium text-[#acebd4] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#acebd4]" />
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#acebd4]/70">
            Menu Utama
          </div>
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#259e73] text-white shadow-xs"
                    : "text-white/80 hover:bg-[#3b5d2b]/60 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-[#acebd4]"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-[#3b5d2b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#259e73] text-white text-xs font-bold">
                {userInitial}
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-white truncate max-w-[130px]">
                  {displayName}
                </p>
                <p className="text-[10px] text-[#acebd4]">
                  {user?.role === "admin" ? "Super Admin" : "Petugas"}
                </p>
              </div>
            </div>
            <button
              onClick={() => logoutMutation.mutate()}
              title="Keluar"
              disabled={logoutMutation.isPending}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-[#e2ebe6] bg-[#fcfcfc] px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-lg p-2 text-[#2e4a21] hover:bg-[#f5f8f6] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-[#5d6f66]">
              <span className="font-semibold text-[#2e4a21]">Panel Administrator</span>
              <span>/</span>
              <span className="text-[#259e73] font-medium capitalize">
                {location.pathname.split("/")[2] || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#2e4a21] flex items-center justify-center text-white text-xs font-semibold">
              {userInitial}
            </div>
            <span className="text-xs font-medium text-[#2e4a21] hidden md:inline">
              {displayName}
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

