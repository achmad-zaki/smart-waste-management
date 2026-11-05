import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Search,
  ScanLine,
  Clock,
  User,
  Recycle,
  PlusCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Mail,
  Bell,
  ChevronDown,
  Sparkles,
  Settings,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useCurrentUser, useLogout } from "~/features/auth/hooks/use-auth";
import { useUserDashboard } from "~/features/dashboard/hooks/use-dashboard";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: user } = useCurrentUser();
  const { data: dashboard } = useUserDashboard();
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

  const totalReportsCount = dashboard?.total_reports ? String(dashboard.total_reports) : undefined;
  const pendingReportsCount = dashboard?.pending_reports ? String(dashboard.pending_reports) : undefined;

  // Handle Search Input in Sidebar (Maps to GET /waste-reports?search=...)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/user/reports?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  /**
   * Menu items based directly on API Documentation:
   * 1. GET /user/dashboard -> Dashboard Warga
   * 2. POST /waste-reports/classify & POST /waste-reports -> Buat Laporan AI
   * 3. GET /waste-reports (User only) -> Riwayat Laporan Saya
   * 4. GET/PUT /profile -> Profil Akun
   * 5. POST /auth/logout -> Logout
   */
  const mainMenuItems = [
    {
      name: "Dashboard",
      href: "/user/dashboard",
      icon: LayoutDashboard,
      active:
        location.pathname === "/user/dashboard" ||
        location.pathname === "/user",
    },
    {
      name: "Riwayat Laporan",
      href: "/user/reports",
      icon: Clock,
      badge: totalReportsCount,
      active:
        location.pathname.startsWith("/user/reports") &&
        location.pathname !== "/user/reports/new",
    },
    {
      name: "Lapor Sampah AI",
      href: "/user/reports/new",
      icon: PlusCircle,
      active: location.pathname === "/user/reports/new",
    },
  ];

  // Mobile navigation active states
  const isDashboardActive =
    location.pathname === "/user/dashboard" || location.pathname === "/user";
  const isSearchActive =
    location.pathname === "/user/reports" &&
    location.search.includes("focus=search");
  const isReportsActive =
    (location.pathname === "/user/reports" &&
      !location.search.includes("focus=search")) ||
    (location.pathname.startsWith("/user/reports/") &&
      location.pathname !== "/user/reports/new");
  const isNewReportActive = location.pathname === "/user/reports/new";
  const isProfileActive = location.pathname.startsWith("/user/profile");

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] text-[#181d1a]">
      {/* Desktop Sidebar (Fixed on viewport for lg screens) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-68 flex-col border-r border-[#e5e9e7] bg-white text-[#181d1a] shrink-0">
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-[#f0f3f1]">
          <Link to="/user/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#107549] to-[#0b5434] text-white shadow-xs group-hover:bg-[#0c5c36] transition-colors">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[#181d1a] block leading-tight">
                Smart Waste
              </span>
              <span className="text-[10px] font-semibold text-[#107549] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#107549]" />
                Portal Warga
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar (Maps to GET /waste-reports?search=...) */}
        <div className="px-4 pt-4 pb-1">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari laporan saya..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#e5e9e7] bg-[#f9faf9] pl-9 pr-11 py-2 text-xs text-[#181d1a] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#107549] transition-all"
            />
            <span className="absolute right-2.5 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 shadow-2xs">
              ↵
            </span>
          </form>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 space-y-5 px-3 py-3 overflow-y-auto text-xs">
          {/* Menu Utama */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Menu Utama
            </div>
            <div className="space-y-1">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3.5 py-2.5 font-medium transition-all duration-150",
                      item.active
                        ? "bg-[#181d1a] text-white shadow-xs"
                        : "text-gray-600 hover:bg-[#f3f6f4] hover:text-[#181d1a]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          item.active ? "text-white" : "text-gray-500"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          item.active
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* AI Camera Assistant Banner Card */}
        <div className="p-3 border-t border-[#f0f3f1]">
          <div className="rounded-2xl border border-[#e5ebe7] bg-gradient-to-b from-[#f9faf9] to-[#f4f7f5] p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#181d1a]">
              <Sparkles className="h-3.5 w-3.5 text-[#107549]" />
              <span>AI Computer Vision</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
              Ambil foto sampah di sekitar Anda, AI akan mendeteksi jenisnya.
            </p>
            <div className="mt-3">
              <Link
                to="/user/reports/new"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#107549] hover:bg-[#0c5c36] px-3 py-2 text-[11px] font-semibold text-white shadow-xs transition-colors w-full"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Lapor Sekarang</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area - padded on left for fixed sidebar on desktop */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-68">
        {/* Top Header Navbar - Fixed / Sticky at top */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-[#e5e9e7] bg-white/95 backdrop-blur-md px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Brand Logo */}
            <Link
              to="/user/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#107549] to-[#0b5434] text-white shadow-xs lg:hidden hover:bg-[#0c5c36] transition-colors shrink-0"
              title="Smart Waste Portal Warga"
            >
              <Recycle className="h-5 w-5" />
            </Link>

            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => window.history.back()}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#e5e9e7] bg-white text-gray-600 hover:bg-[#f7f9f8] transition-colors cursor-pointer"
                title="Kembali"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => window.history.forward()}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#e5e9e7] bg-white text-gray-400 hover:bg-[#f7f9f8] transition-colors cursor-pointer"
                title="Maju"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
              <span className="hover:text-[#181d1a] transition-colors">
                Smart Waste
              </span>
              <span>&gt;</span>
              <span className="text-[#181d1a] font-semibold">
                {location.pathname.includes("/user/reports/new")
                  ? "Buat Laporan AI"
                  : location.pathname.includes("/user/reports")
                  ? "Riwayat Laporan"
                  : location.pathname.includes("/user/profile")
                  ? "Profil Akun"
                  : "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/user/reports"
              title="Riwayat Laporan Saya"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5e9e7] bg-white text-gray-600 hover:bg-[#f7f9f8] hover:text-[#181d1a] transition-colors cursor-pointer relative"
            >
              <Clock className="h-4 w-4" />
              {dashboard?.pending_reports ? (
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
              ) : null}
            </Link>

            {/* User Profile Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-auto py-1 pl-1 pr-2 rounded-xl hover:bg-[#f7f9f8] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#107549] text-foreground font-normal"
                  >
                    <div
                      suppressHydrationWarning
                      className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#107549] to-[#acebd4] flex items-center justify-center text-white text-xs font-bold shadow-2xs"
                    >
                      {userInitial}
                    </div>
                    <span
                      suppressHydrationWarning
                      className="text-xs font-semibold text-[#181d1a] hidden sm:block max-w-[120px] truncate"
                    >
                      {displayName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block shrink-0" />
                  </Button>
                }
              />
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 p-1.5 shadow-xl rounded-2xl border border-[#e5e9e7] bg-white"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-2 text-xs">
                    <p suppressHydrationWarning className="font-bold text-[#181d1a] truncate">
                      {displayName}
                    </p>
                    <p suppressHydrationWarning className="text-[11px] text-gray-500 font-normal truncate">
                      {user?.email || "warga@smartwaste.id"}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-[#107549] bg-[#107549]/10 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#107549]" />
                      Warga Pelapor
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 bg-[#f0f3f1]" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate("/user/profile")}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:text-[#181d1a] hover:bg-[#f4f7f5] rounded-xl cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>Pengaturan Akun</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 bg-[#f0f3f1]" />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl cursor-pointer focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Keluar Akun</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/user/reports/new">
              <button className="flex items-center gap-1.5 rounded-xl bg-[#107549] hover:bg-[#0c5c36] text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Lapor AI</span>
              </button>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Full-Width Bottom Navigation Bar */}
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
                ? "text-[#107549] font-semibold"
                : "text-gray-500 hover:text-[#181d1a]"
            )}
          >
            <LayoutDashboard
              className={cn(
                "h-5 w-5 transition-transform",
                isDashboardActive && "stroke-[#107549]"
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
                ? "text-[#107549] font-semibold"
                : "text-gray-500 hover:text-[#181d1a]"
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
                  "flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#107549] text-white shadow-lg shadow-[#107549]/35 border-4 border-white transition-all duration-200 active:scale-95 group-hover:bg-[#0c5c36] group-hover:scale-105",
                  isNewReportActive && "ring-2 ring-[#107549] ring-offset-2"
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
                ? "text-[#107549] font-semibold"
                : "text-gray-500 hover:text-[#181d1a]"
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
                ? "text-[#107549] font-semibold"
                : "text-gray-500 hover:text-[#181d1a]"
            )}
          >
            <User
              className={cn(
                "h-5 w-5 transition-transform",
                isProfileActive && "stroke-[#107549] stroke-[2.2]"
              )}
            />
            <span className="text-[11px] mt-1 leading-none font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
