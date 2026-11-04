import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  FileSpreadsheet,
  MapPin,
  ExternalLink,
} from "lucide-react";
import {
  initialUsers,
  initialReports,
  categoryLabels,
  statusLabels,
} from "~/lib/mock-data";
import { Button } from "~/components/ui/button";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const userId = Number(id) || 2;
  const user = initialUsers.find((u) => u.id === userId) || initialUsers[1];
  const userReports = initialReports.filter((r) => r.user_id === user.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/users">
          <Button variant="ghost" size="sm" className="gap-1.5 text-[#5d6f66] hover:text-[#2e4a21]">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Pengguna
          </Button>
        </Link>
        <span className="text-[#c2d8cd]">|</span>
        <span className="text-xs font-semibold text-[#2e4a21]">
          Detail Pengguna: {user.name}
        </span>
      </div>

      {/* User Info Card */}
      <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#acebd4] text-[#2e4a21] font-bold text-xl border border-[#259e73]/20">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#2e4a21]">{user.name}</h1>
                {user.role === "admin" ? (
                  <span className="rounded-full bg-[#2e4a21] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    Administrator
                  </span>
                ) : (
                  <span className="rounded-full bg-[#acebd4]/40 px-2.5 py-0.5 text-[11px] font-semibold text-[#2e4a21] border border-[#acebd4]">
                    Warga
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5d6f66] mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-[#259e73]" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-[#259e73]" />
                  {user.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#5d6f66]" />
                  Bergabung: {user.created_at}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#f5f8f6] p-3 border border-[#e2ebe6] text-center px-6">
            <span className="text-2xl font-extrabold text-[#2e4a21]">
              {userReports.length}
            </span>
            <p className="text-[11px] text-[#5d6f66]">Total Laporan Diajukan</p>
          </div>
        </div>
      </div>

      {/* Reports submitted by this user */}
      <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
        <h2 className="text-base font-bold text-[#2e4a21] mb-4">
          Laporan yang Diajukan oleh {user.name}
        </h2>

        {userReports.length === 0 ? (
          <p className="text-xs text-[#5d6f66] py-6 text-center">
            Pengguna ini belum pernah mengajukan laporan sampah.
          </p>
        ) : (
          <div className="space-y-3">
            {userReports.map((report) => {
              const cat = categoryLabels[report.waste_category];
              const stat = statusLabels[report.status];
              return (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-[#e2ebe6] p-4 hover:border-[#259e73] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={report.image_url}
                      alt={report.title}
                      className="h-12 w-12 rounded-lg object-cover border border-[#e2ebe6]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2e4a21]">
                          #{report.id}
                        </span>
                        <h4 className="text-sm font-semibold text-[#2e4a21]">
                          {report.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#5d6f66] flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-[#259e73]" />
                        {report.address} • {report.created_at}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cat.badgeClass}`}
                    >
                      {cat.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${stat.bg} ${stat.text} ${stat.border}`}
                    >
                      {stat.label}
                    </span>
                    <Link to={`/admin/reports/${report.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-[#259e73]">
                        Lihat
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

