import React, { useState } from "react";
import { Link } from "react-router";
import {
  Wallet,
  Clock,
  CheckCircle2,
  ArrowRight,
  MoreVertical,
  PlusCircle,
  RotateCcw,
  Search,
  Filter,
  Sparkles,
  MapPin,
  ChevronDown,
  Layers,
  HelpCircle,
} from "lucide-react";
import type { Route } from "./+types/user.dashboard";
import { ClientDate } from "~/components/common/client-date";
import { CategoryBadge } from "~/components/common/category-badge";
import { StatusBadge } from "~/components/common/status-badge";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useUserDashboard } from "~/features/dashboard/hooks/use-dashboard";
import { cn } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Warga - Smart Waste Management" },
    {
      name: "description",
      content:
        "Ringkasan kontribusi pelaporan sampah, status penanganan dinas, dan analitik AI.",
    },
  ];
}

interface CitizenMonthlyData {
  month: string;
  value: number;
  date: string;
  reports: string;
  resolved: string;
}

export default function UserDashboardPage() {
  const { data: dashboard, isLoading, refetch } = useUserDashboard();
  const [activePeriod, setActivePeriod] = useState<"monthly" | "yearly">("yearly");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(2); // Default March
  const [searchQuery, setSearchQuery] = useState("");

  const monthlyChartData: CitizenMonthlyData[] = [
    { month: "Jan", value: 3, date: "Januari 2026", reports: "3 Laporan", resolved: "3 Tuntas" },
    { month: "Feb", value: 5, date: "Februari 2026", reports: "5 Laporan", resolved: "4 Tuntas" },
    { month: "Mar", value: 9, date: "Maret 2026", reports: "9 Laporan", resolved: "8 Tuntas" },
    { month: "Apr", value: 4, date: "April 2026", reports: "4 Laporan", resolved: "4 Tuntas" },
    { month: "May", value: 7, date: "Mei 2026", reports: "7 Laporan", resolved: "6 Tuntas" },
    { month: "Jun", value: 2, date: "Juni 2026", reports: "2 Laporan", resolved: "2 Tuntas" },
    { month: "Jul", value: 6, date: "Juli 2026", reports: "6 Laporan", resolved: "5 Tuntas" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Spinner className="size-8 text-[#107549] mb-3" />
        <p className="text-sm font-medium">Memuat ringkasan laporan Anda...</p>
      </div>
    );
  }

  const totalReports = dashboard?.total_reports ?? 12;
  const pendingReports = dashboard?.pending_reports ?? 2;
  const inProgressReports = dashboard?.in_progress_reports ?? 1;
  const completedReports = dashboard?.completed_reports ?? 9;
  const recentReports = dashboard?.recent_reports ?? [];

  const filteredReports = recentReports.filter(
    (rep) =>
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rep.address && rep.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header: Overview title, date filter & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#181d1a]">
              Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#107549]/10 px-3 py-0.5 text-xs font-semibold text-[#107549]">
              <Sparkles className="h-3 w-3" />
              <span>Portal Warga Peduli Lingkungan</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Here is the summary of overall data & kontribusi kebersihan kota Anda
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button className="flex items-center gap-2 rounded-xl border border-[#e5e9e7] bg-white px-3.5 py-2 text-xs font-semibold text-[#181d1a] shadow-xs hover:bg-[#f7f9f8] transition-colors cursor-pointer">
              <span>This Month</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </div>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 rounded-xl border border-[#e5e9e7] bg-white px-3.5 py-2 text-xs font-semibold text-[#181d1a] shadow-xs hover:bg-[#f7f9f8] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-gray-500" />
            <span>Reset Data</span>
          </button>

          <Link to="/user/reports/new">
            <Button
              size="sm"
              className="bg-[#107549] hover:bg-[#0c5c36] text-white rounded-xl gap-1.5 shadow-xs font-semibold text-xs h-9"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Lapor Sampah</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Hero Green Gradient Card (Total Laporan) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b5c36] via-[#107549] to-[#08482a] p-6 text-white shadow-sm flex flex-col justify-between min-h-[190px]">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#107549] shadow-2xs">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white leading-tight">
                    My balance
                  </h3>
                  <p className="text-[11px] text-emerald-100/90 mt-0.5">
                    Total Laporan Sampah Anda
                  </p>
                </div>
              </div>
              <button className="text-white/70 hover:text-white transition-colors cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {totalReports} Laporan
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white border border-white/25">
                +1.5% ↑
              </span>
            </div>
          </div>

          <Link
            to="/user/reports"
            className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-medium text-white/90 hover:text-white group"
          >
            <span>See details</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Card 2: Savings Account (Menunggu Validasi) */}
        <div className="rounded-3xl border border-[#e5e9e7] bg-white p-6 shadow-xs flex flex-col justify-between min-h-[190px]">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4f7f5] text-[#181d1a]">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#181d1a] leading-tight">
                    Savings account
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Menunggu Validasi Dinas
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-[#181d1a]">
                {pendingReports} Laporan
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/80">
                +3.2% ↑
              </span>
            </div>
          </div>

          <Link
            to="/user/reports?status=pending"
            className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-600 hover:text-[#181d1a] group"
          >
            <span>View summary</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Card 3: Investment Portfolio (Selesai Ditangani) */}
        <div className="rounded-3xl border border-[#e5e9e7] bg-white p-6 shadow-xs flex flex-col justify-between min-h-[190px]">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#181d1a] text-white">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#181d1a] leading-tight">
                    Investment portfolio
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Selesai & Bersih Kembali
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-[#181d1a]">
                {completedReports} Lokasi
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/80">
                +4.7% ↑
              </span>
            </div>
          </div>

          <Link
            to="/user/reports?status=completed"
            className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-600 hover:text-[#181d1a] group"
          >
            <span>Analyze performance</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Row 2: Middle Section (My Wallet & Cash Flow Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols): Kategori Sampah AI (My Wallet Style) */}
        <div className="lg:col-span-5 rounded-3xl border border-[#e5e9e7] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#181d1a]">
                  My Wallet
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Today 1 USD = 122.20 BDT • AI Deteksi Sampah
                </p>
              </div>

              <Link to="/user/reports/new">
                <button className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                  <span>+ Add New</span>
                </button>
              </Link>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
              {/* Plastik */}
              <div className="rounded-2xl border border-[#edf1ee] bg-[#fafbfb] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 32 32" className="h-full w-full">
                          <rect width="32" height="32" fill="#B22234" />
                          <path d="M0,5h32M0,10h32M0,15h32M0,20h32M0,25h32M0,30h32" stroke="#fff" strokeWidth="2.5" />
                          <rect width="14" height="15" fill="#3C3B6E" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-[#181d1a]">USD</span>
                    </div>
                    <button className="text-gray-400">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-3 text-base font-extrabold text-[#181d1a] tracking-tight">
                    $22,678.00
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Limit is $10k a month
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-emerald-600">Active</span>
                </div>
              </div>

              {/* Organik */}
              <div className="rounded-2xl border border-[#edf1ee] bg-[#fafbfb] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-[#003399] shrink-0">
                        <svg viewBox="0 0 32 32" className="h-4 w-4">
                          <circle cx="16" cy="16" r="10" stroke="#FFCC00" strokeWidth="1.5" strokeDasharray="2,3" fill="none" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-[#181d1a]">EUR</span>
                    </div>
                    <button className="text-gray-400">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-3 text-base font-extrabold text-[#181d1a] tracking-tight">
                    €18,345.00
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Limit is €8k a month
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-emerald-600">Active</span>
                </div>
              </div>

              {/* Kertas */}
              <div className="rounded-2xl border border-[#edf1ee] bg-[#fafbfb] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-[#006a4e] shrink-0">
                        <div className="h-3 w-3 rounded-full bg-[#f42a41]" />
                      </div>
                      <span className="text-xs font-bold text-[#181d1a]">BDT</span>
                    </div>
                    <button className="text-gray-400">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-3 text-base font-extrabold text-[#181d1a] tracking-tight">
                    ৳1,22,678.00
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Limit is ৳10k a month
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-emerald-600">Active</span>
                </div>
              </div>

              {/* Logam B3 */}
              <div className="rounded-2xl border border-[#edf1ee] bg-[#fafbfb] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-[#012169] shrink-0">
                        <svg viewBox="0 0 32 32" className="h-full w-full">
                          <path d="M0 0 L32 32 M32 0 L0 32" stroke="#fff" strokeWidth="4" />
                          <path d="M0 0 L32 32 M32 0 L0 32" stroke="#C8102E" strokeWidth="2" />
                          <path d="M16 0 V32 M0 16 H32" stroke="#fff" strokeWidth="6" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-[#181d1a]">GBP</span>
                    </div>
                    <button className="text-gray-400">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-3 text-base font-extrabold text-[#181d1a] tracking-tight">
                    £15,000.00
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Limit is £7.5k a month
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-rose-500">Inactive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Cash Flow Bar Chart */}
        <div className="lg:col-span-7 rounded-3xl border border-[#e5e9e7] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400">Cash Flow</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#181d1a] mt-0.5">
                $342,323.44
              </h2>
            </div>

            <div className="flex items-center rounded-full bg-gray-100 p-1 text-xs">
              <button
                onClick={() => setActivePeriod("monthly")}
                className={cn(
                  "px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer",
                  activePeriod === "monthly"
                    ? "bg-[#107549] text-white shadow-xs font-semibold"
                    : "text-gray-600 hover:text-[#181d1a]"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setActivePeriod("yearly")}
                className={cn(
                  "px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5",
                  activePeriod === "yearly"
                    ? "bg-[#107549] text-white shadow-xs font-semibold"
                    : "text-gray-600 hover:text-[#181d1a]"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Yearly
              </button>
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="mt-6 relative">
            <div className="h-56 flex flex-col justify-between text-[11px] font-medium text-gray-400 pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="w-7 text-right">50k</span>
                <div className="flex-1 border-b border-gray-100" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 text-right">40k</span>
                <div className="flex-1 border-b border-gray-100" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 text-right">30k</span>
                <div className="flex-1 border-b border-gray-100" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 text-right">20k</span>
                <div className="flex-1 border-b border-gray-100" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 text-right">10k</span>
                <div className="flex-1 border-b border-gray-100" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 text-right">0k</span>
                <div className="flex-1 border-b border-gray-200" />
              </div>
            </div>

            <div className="absolute inset-0 pl-10 pr-2 pb-0 flex items-end justify-between gap-2 sm:gap-4">
              {monthlyChartData.map((item, idx) => {
                const isSelected = selectedMonthIndex === idx;
                const heightPercentage = Math.round((item.value / 10) * 100);

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group relative"
                    onClick={() => setSelectedMonthIndex(idx)}
                  >
                    {isSelected && (
                      <div
                        className="absolute z-20 transition-all duration-200 pointer-events-none"
                        style={{
                          bottom: `calc(${heightPercentage}% + 12px)`,
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <div className="relative rounded-2xl bg-[#171a18] text-white p-3.5 shadow-xl text-left min-w-[170px] whitespace-nowrap">
                          <p className="text-[10px] text-gray-400 font-medium">
                            July 23, 2026
                          </p>
                          <div className="mt-1.5 flex items-center justify-between text-xs font-semibold gap-3">
                            <span className="text-gray-300">Cashflow</span>
                            <span className="text-white">$33,847.00</span>
                          </div>
                          <div className="mt-0.5 flex items-center justify-between text-xs font-semibold gap-3">
                            <span className="text-gray-300">Inflow</span>
                            <span className="text-rose-400">-$7,456.00</span>
                          </div>
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#171a18] rotate-45" />
                        </div>
                      </div>
                    )}

                    <div className="w-full max-w-[42px] flex flex-col items-center relative">
                      {isSelected && (
                        <div className="absolute -top-3 z-10 h-3 w-3 rounded-full bg-white border-2 border-[#107549] shadow-xs" />
                      )}
                      <div
                        className={cn(
                          "w-full rounded-t-2xl transition-all duration-300",
                          isSelected
                            ? "bg-gradient-to-t from-[#0b5434] via-[#107549] to-[#128a57] shadow-md shadow-[#107549]/20"
                            : "bg-[#e2ece6] group-hover:bg-[#d0dfd6]"
                        )}
                        style={{ height: `${heightPercentage * 1.8}px` }}
                      />
                    </div>

                    <span
                      className={cn(
                        "mt-2.5 text-xs font-medium transition-colors",
                        isSelected ? "text-[#107549] font-bold" : "text-gray-400"
                      )}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Activities Table */}
      <div className="rounded-3xl border border-[#e5e9e7] bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#181d1a]">
            Recent Activities
          </h2>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-60 rounded-xl border border-[#e5e9e7] bg-white pl-9 pr-3 py-1.5 text-xs text-[#181d1a] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#107549] transition-all"
              />
            </div>

            <button className="flex items-center gap-1.5 rounded-xl border border-[#e5e9e7] bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              <Filter className="h-3.5 w-3.5 text-gray-400" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Activities Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-[11px] font-medium">
                <th className="py-3.5 px-3 w-8">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#107549] focus:ring-[#107549]"
                  />
                </th>
                <th className="py-3.5 px-4 font-medium">Activity</th>
                <th className="py-3.5 px-4 font-medium">Order ID</th>
                <th className="py-3.5 px-4 font-medium">Date</th>
                <th className="py-3.5 px-4 font-medium">Time</th>
                <th className="py-3.5 px-4 font-medium">Price</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[#181d1a]">
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-[#f9faf9] transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#107549] focus:ring-[#107549]"
                      />
                    </td>
                    <td className="py-4 px-4 font-semibold flex items-center gap-3">
                      <img
                        src={report.image_url}
                        alt={report.title}
                        className="h-9 w-9 rounded-xl object-cover border border-[#e2ebe6] shrink-0"
                      />
                      <div>
                        <span className="text-gray-900 font-semibold block line-clamp-1">
                          {report.title}
                        </span>
                        <span className="text-[11px] text-gray-400 font-normal flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-[#107549]" />
                          <span className="line-clamp-1">{report.address || "Area Pelaporan"}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-500">
                      INV_0000{report.id}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <ClientDate date={report.created_at} format="date" fallback="17 Apr, 2026" />
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      <ClientDate date={report.created_at} format="time" fallback="03:45 PM" />
                    </td>
                    <td className="py-4 px-4 font-bold text-[#181d1a]">
                      $25,500
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={report.status} variant="elegant" />
                    </td>
                    <td className="py-4 px-3 text-right">
                      <Link to={`/user/reports/${report.id}`}>
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-[#f9faf9] transition-colors group cursor-pointer">
                    <td className="py-4 px-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#107549] focus:ring-[#107549]"
                      />
                    </td>
                    <td className="py-4 px-4 font-semibold flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                        <span className="font-serif">A</span>
                      </div>
                      <span className="text-gray-900 font-semibold">Software License</span>
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-500">
                      INV_000076
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      17 Apr, 2026
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      03:45 PM
                    </td>
                    <td className="py-4 px-4 font-bold text-[#181d1a]">
                      $25,500
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[11px] text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Completed
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f9faf9] transition-colors group cursor-pointer">
                    <td className="py-4 px-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#107549] focus:ring-[#107549]"
                      />
                    </td>
                    <td className="py-4 px-4 font-semibold flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                        <span className="text-xs">✈️</span>
                      </div>
                      <span className="text-gray-900 font-semibold">Flight Ticket</span>
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-500">
                      INV_000075
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      15 Apr, 2026
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      11:20 AM
                    </td>
                    <td className="py-4 px-4 font-bold text-[#181d1a]">
                      $32,750
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[11px] text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Pending
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
