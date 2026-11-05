import React from "react";
import { Link, useLocation } from "react-router";
import {
  Home,
  Search,
  ScanLine,
  Clock,
  User,
  Recycle,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useCurrentUser, useLogout } from "~/features/auth/hooks/use-auth";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const userInitial = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "WR";
  const displayName = user?.name || "Warga";

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
      icon: Clock,
    },
    {
      name: "Profil Akun",
      href: "/user/profile",
      icon: User,
    },
  ];

  // Route active states
  const isDashboardActive =
    location.pathname === "/user/dashboard" || location.pathname === "/user";
  const isSearchActive =
    location.pathname === "/user/reports" &&
    location.search.includes("focus=search");
  const isReportsActive =
    location.pathname === "/user/reports" &&
    !location.search.includes("focus=search") ||
    (location.pathname.startsWith("/user/reports/") &&
      location.pathname !== "/user/reports/new");
  const isNewReportActive = location.pathname === "/user/reports/new";
  const isProfileActive = location.pathname.startsWith("/user/profile");

  return (
    <div className="flex min-h-screen bg-[#f5f8f6]">
      {/* Desktop Sidebar (Only visible on lg screens and up - NEVER a sidebar on mobile) */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-[#e2ebe6] bg-[#fcfcfc] text-[#2e4a21] shrink-0 min-h-screen">
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-[#e2ebe6]">
          <Link to="/user/dashboard" className="flex items-center gap-3 group">
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
        </div>

        {/* Quick Report CTA Button in Sidebar */}
        <div className="p-4 pb-2">
          <Link
            to="/user/reports/new"
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
                ? isReportsActive || isSearchActive
                : item.href === "/user/reports/new"
                ? isNewReportActive
                : item.href === "/user/dashboard"
                ? isDashboardActive
                : location.pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
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

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-[#e2ebe6] bg-[#fcfcfc]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#acebd4] text-[#2e4a21] text-xs font-bold border border-[#259e73]/20">
                {userInitial}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-[#2e4a21] truncate max-w-[130px]">
                  {displayName}
                </p>
                <p className="text-[10px] text-[#5d6f66]">
                  {user?.role === "admin" ? "Administrator" : "Warga Terverifikasi"}
                </p>
              </div>
            </div>
            <button
              onClick={() => logoutMutation.mutate()}
              title="Keluar"
              disabled={logoutMutation.isPending}
              className="rounded-lg p-2 text-[#5d6f66] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 sm:h-18 items-center justify-between border-b border-[#e2ebe6] bg-[#fcfcfc] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Brand Logo */}
            <Link
              to="/user/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#259e73] text-white shadow-xs lg:hidden hover:bg-[#1f8561] transition-colors shrink-0"
              title="Smart Waste Portal Warga"
            >
              <Recycle className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5 lg:hidden">
                <span className="text-xs font-bold text-[#2e4a21]">Smart Waste</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#259e73]" />
                <span className="text-[10px] font-semibold text-[#259e73]">Warga</span>
              </div>
              <p className="hidden lg:block text-xs text-[#5d6f66]">Selamat Datang,</p>
              <h2 className="text-sm font-semibold text-[#2e4a21] truncate max-w-[160px] sm:max-w-none">
                {displayName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/user/reports/new"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#259e73] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1f8561] transition-colors shadow-xs"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Lapor
            </Link>
            <button
              onClick={() => logoutMutation.mutate()}
              title="Keluar dari akun"
              disabled={logoutMutation.isPending}
              className="inline-flex sm:hidden items-center justify-center h-8 w-8 rounded-lg border border-[#e2ebe6] text-[#5d6f66] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Content Body - with bottom padding pb-24 on mobile so bottom navbar never covers content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Full-Width Bottom Navigation Bar (Non-floating, attached to bottom edges) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 inset-x-0 w-full z-40 lg:hidden bg-white border-t border-[#e2ebe6] shadow-[0_-4px_25px_rgba(0,0,0,0.06)] rounded-t-2xl sm:rounded-t-3xl"
        style={{
          paddingBottom: "max(0.6rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="grid grid-cols-5 items-center max-w-lg mx-auto relative px-2 pt-2 pb-1">
          {/* 1. Home */}
          <Link
            to="/user/dashboard"
            className={cn(
              "flex flex-col items-center justify-center py-1 transition-colors text-center",
              isDashboardActive
                ? "text-[#259e73] font-semibold"
                : "text-[#5d6f66] hover:text-[#2e4a21]"
            )}
          >
            <Home
              className={cn(
                "h-5 w-5 transition-transform",
                isDashboardActive && "fill-[#259e73]/15 stroke-[#259e73]"
              )}
            />
            <span className="text-[11px] mt-1 leading-none font-medium">Home</span>
          </Link>

          {/* 2. Search */}
          <Link
            to="/user/reports?focus=search"
            className={cn(
              "flex flex-col items-center justify-center py-1 transition-colors text-center",
              isSearchActive
                ? "text-[#259e73] font-semibold"
                : "text-[#5d6f66] hover:text-[#2e4a21]"
            )}
          >
            <Search
              className={cn(
                "h-5 w-5 transition-transform",
                isSearchActive && "stroke-[2.5]"
              )}
            />
            <span className="text-[11px] mt-1 leading-none font-medium">Search</span>
          </Link>

          {/* 3. Center Elevated Action Button (Scan / Lapor Sampah) */}
          <div className="flex justify-center items-center">
            <Link
              to="/user/reports/new"
              title="Lapor Sampah AI"
              className="relative -top-5 flex flex-col items-center justify-center focus:outline-hidden group"
            >
              <div
                className={cn(
                  "flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#259e73] text-white shadow-lg shadow-[#259e73]/35 border-4 border-white transition-all duration-200 active:scale-95 group-hover:bg-[#1f8561] group-hover:scale-105",
                  isNewReportActive && "ring-2 ring-[#259e73] ring-offset-2"
                )}
              >
                <ScanLine className="h-6 w-6 stroke-[2.2]" />
              </div>
            </Link>
          </div>

          {/* 4. History */}
          <Link
            to="/user/reports"
            className={cn(
              "flex flex-col items-center justify-center py-1 transition-colors text-center",
              isReportsActive
                ? "text-[#259e73] font-semibold"
                : "text-[#5d6f66] hover:text-[#2e4a21]"
            )}
          >
            <Clock
              className={cn(
                "h-5 w-5 transition-transform",
                isReportsActive && "stroke-[2.5]"
              )}
            />
            <span className="text-[11px] mt-1 leading-none font-medium">History</span>
          </Link>

          {/* 5. Profile */}
          <Link
            to="/user/profile"
            className={cn(
              "flex flex-col items-center justify-center py-1 transition-colors text-center",
              isProfileActive
                ? "text-[#259e73] font-semibold"
                : "text-[#5d6f66] hover:text-[#2e4a21]"
            )}
          >
            <User
              className={cn(
                "h-5 w-5 transition-transform",
                isProfileActive && "fill-[#259e73]/15 stroke-[#259e73] stroke-[2.2]"
              )}
            />
            <span className="text-[11px] mt-1 leading-none font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
