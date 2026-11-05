import {
  ChevronDown,
  Clock,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  Menu,
  Recycle,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
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
import { useCurrentUser, useLogout } from "~/features/auth/hooks/use-auth";
import { useAdminDashboard } from "~/features/dashboard/hooks/use-dashboard";
import { cn } from "~/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: user } = useCurrentUser();
  const { data: dashboard } = useAdminDashboard();
  const logoutMutation = useLogout();

  const userInitial = user?.name
    ? user.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
    : "AD";
  const displayName = user?.name || "Admin Dinas";

  const totalReportsCount = dashboard?.total_reports ? String(dashboard.total_reports) : undefined;
  const pendingReportsCount = dashboard?.pending_reports ? String(dashboard.pending_reports) : undefined;

  // Handle Search Input in Sidebar (Maps to GET /waste-reports?search=...)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/reports?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileOpen(false);
    }
  };

  /**
   * Menu items based directly on API Documentation:
   * 1. GET /admin/dashboard -> Dashboard
   * 2. GET /waste-reports -> Kelola Laporan
   * 3. PATCH /admin/waste-reports/{id}/status -> Validasi Status Laporan (Filter pending)
   * 4. GET /admin/users -> Kelola Pengguna
   * 5. POST /waste-reports/classify -> Klasifikasi AI (Uji Model Vision)
   * 6. GET/PUT /profile & PUT /profile/password -> Profil & Keamanan
   * 7. POST /auth/logout -> Logout
   */
  const mainMenuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      active:
        location.pathname === "/admin/dashboard" ||
        location.pathname === "/admin",
    },
    {
      name: "Kelola Laporan",
      href: "/admin/reports",
      icon: FileSpreadsheet,
      badge: totalReportsCount,
      active:
        location.pathname.startsWith("/admin/reports") &&
        !location.search.includes("status=pending"),
    },
    {
      name: "Validasi Laporan",
      href: "/admin/reports?status=pending",
      icon: Clock,
      badge: pendingReportsCount,
      badgeVariant: "warning",
      active:
        location.pathname.startsWith("/admin/reports") &&
        location.search.includes("status=pending"),
    },
  ];

  const managementItems = [
    {
      name: "Kelola Pengguna",
      href: "/admin/users",
      icon: Users,
      active: location.pathname.startsWith("/admin/users"),
    },
    {
      name: "Uji Klasifikasi AI",
      href: "/user/reports/new",
      icon: Sparkles,
      active: location.pathname === "/user/reports/new",
    },
  ];

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/reports")) {
      const isDetail = path !== "/admin/reports" && path !== "/admin/reports/";
      return [
        { label: "Smart Waste", href: "/admin/dashboard" },
        { label: "Kelola Laporan", href: isDetail ? "/admin/reports" : undefined },
        ...(isDetail ? [{ label: "Detail Laporan" }] : []),
      ];
    }
    if (path.startsWith("/admin/users")) {
      const isDetail = path !== "/admin/users" && path !== "/admin/users/";
      return [
        { label: "Smart Waste", href: "/admin/dashboard" },
        { label: "Kelola Pengguna", href: isDetail ? "/admin/users" : undefined },
        ...(isDetail ? [{ label: "Detail Pengguna" }] : []),
      ];
    }
    if (path.startsWith("/admin/profile")) {
      return [
        { label: "Smart Waste", href: "/admin/dashboard" },
        { label: "Profil Admin" },
      ];
    }
    return [
      { label: "Smart Waste", href: "/admin/dashboard" },
      { label: "Dashboard" },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] text-[#181d1a]">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile (Fixed on viewport) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-68 flex-col border-r border-[#e5e9e7] bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 shrink-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-[#f0f3f1] shrink-0">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 group"
            onClick={() => setIsMobileOpen(false)}
          >
            {/* Smart Waste Logo Badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#107549] to-[#0b5434] text-white shadow-xs group-hover:bg-[#0c5c36] transition-colors">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[#181d1a] block leading-tight">
                Smart Waste
              </span>
              <span className="text-[10px] font-semibold text-[#107549] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#107549]" />
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Menu Sections */}
        <nav className="flex-1 space-y-5 px-3 py-3 overflow-y-auto text-xs">
          {/* 1. MENU UTAMA */}
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
                    onClick={() => setIsMobileOpen(false)}
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
                            : item.badgeVariant === "warning"
                              ? "bg-amber-100 text-amber-700"
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

          {/* 2. MANAJEMEN SISTEM */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Manajemen Sistem
            </div>
            <div className="space-y-1">
              {managementItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileOpen(false)}
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
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area - padded on left for fixed sidebar on desktop */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-68">
        {/* Top Header Bar - Fixed / Sticky at top */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-[#e5e9e7] bg-white/95 backdrop-blur-md px-4 sm:px-8 shrink-0">
          {/* Left: Navigation Arrows & Shadcn Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb dari shadcn */}
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <React.Fragment key={`${item.label}-${index}`}>
                      <BreadcrumbItem>
                        {item.href && !isLast ? (
                          <BreadcrumbLink asChild>
                            <Link
                              to={item.href}
                              className="font-medium text-gray-500 hover:text-[#107549] transition-colors"
                            >
                              {item.label}
                            </Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="font-semibold text-[#181d1a]">
                            {item.label}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right: Actions, Notifications, Avatar Dropdown, Quick Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Avatar Dropdown dari Base UI (berisi Pengaturan dan Logout) */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-auto py-1 pl-1.5 pr-2.5 rounded-xl hover:bg-[#f7f9f8] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#107549] text-foreground font-normal"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-[#107549]/20 transition-all hover:ring-[#107549]/40">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt={displayName}
                      />
                      <AvatarFallback
                        suppressHydrationWarning
                        className="bg-gradient-to-tr from-[#107549] to-[#acebd4] text-white font-bold text-xs"
                      >
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      suppressHydrationWarning
                      className="text-xs font-semibold text-[#181d1a] hidden sm:block max-w-[120px] truncate"
                    >
                      {displayName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
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
                      {user?.email || "admin@smartwaste.id"}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-[#107549] bg-[#107549]/10 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#107549]" />
                      {user?.role === "admin" ? "Administrator Dinas" : "Petugas Kebersihan"}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 bg-[#f0f3f1]" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate("/admin/profile")}
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
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
