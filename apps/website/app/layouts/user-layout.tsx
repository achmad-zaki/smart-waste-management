import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Home,
  PlusCircle,
  History,
  User,
  Recycle,
  Menu,
  X,
  LogOut,
  ArrowRightLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/user/dashboard",
      icon: Home,
    },
    {
      name: "Buat Laporan Baru",
      href: "/user/reports/new",
      icon: PlusCircle,
      highlight: true,
    },
    {
      name: "Riwayat Laporan",
      href: "/user/reports",
      icon: History,
    },
    {
      name: "Profil Akun",
      href: "/user/profile",
      icon: User,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f8f6]">
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#2e4a21]/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* User Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#e2ebe6] bg-[#fcfcfc] text-[#2e4a21] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-[#e2ebe6]">
          <Link
            to="/user/dashboard"
            className="flex items-center gap-3 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#259e73] text-white shadow-xs group-hover:bg-[#1f8561] transition-colors">
              <Recycle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[#2e4a21] block">
                Smart Waste
              </span>
              <span className="text-xs font-medium text-[#259e73] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#259e73]" />
                Portal Warga
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-[#5d6f66] hover:bg-[#acebd4]/20 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Report CTA Button in Sidebar */}
        <div className="p-4 pb-2">
          <Link
            to="/user/reports/new"
            onClick={() => setIsMobileOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#259e73] px-4 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#1f8561] transition-all active:scale-[0.98]"
          >
            <PlusCircle className="h-5 w-5" />
            Lapor Sampah AI
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#5d6f66]">
            Navigasi
          </div>
          {navigation.map((item) => {
            const isActive =
              item.href === "/user/reports"
                ? location.pathname === "/user/reports"
                : location.pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#acebd4]/40 text-[#2e4a21] font-semibold border border-[#acebd4]"
                    : "text-[#5d6f66] hover:bg-[#acebd4]/15 hover:text-[#2e4a21]"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-[#259e73]" : "text-[#5d6f66]"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Switch Portal & User Profile */}
        <div className="p-4 border-t border-[#e2ebe6] space-y-3 bg-[#fcfcfc]">
          <Link
            to="/admin/dashboard"
            className="flex items-center justify-between rounded-xl bg-[#2e4a21]/5 p-3 text-xs text-[#2e4a21] hover:bg-[#acebd4]/30 transition-colors border border-[#e2ebe6]"
          >
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-[#259e73]" />
              <div>
                <p className="font-semibold">Panel Admin</p>
                <p className="text-[11px] text-[#5d6f66]">Beralih ke hak akses Admin</p>
              </div>
            </div>
            <Sparkles className="h-4 w-4 text-[#259e73]" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#acebd4] text-[#2e4a21] text-xs font-bold border border-[#259e73]/20">
                AQ
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-[#2e4a21] truncate max-w-[120px]">
                  Ahmad Qomaruddin
                </p>
                <p className="text-[10px] text-[#5d6f66]">Warga Terverifikasi</p>
              </div>
            </div>
            <Link
              to="/login"
              title="Keluar"
              className="rounded-lg p-2 text-[#5d6f66] hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-[#e2ebe6] bg-[#fcfcfc] px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-lg p-2 text-[#2e4a21] hover:bg-[#f5f8f6] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs text-[#5d6f66]">Selamat Datang,</p>
              <h2 className="text-sm font-semibold text-[#2e4a21]">
                Ahmad Qomaruddin
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#e2ebe6] bg-[#fcfcfc] px-3 py-1.5 text-xs font-medium text-[#2e4a21] hover:bg-[#acebd4]/20 transition-colors"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-[#259e73]" />
              Mode Admin
            </Link>
            <Link
              to="/user/reports/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#259e73] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1f8561] transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Lapor
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

