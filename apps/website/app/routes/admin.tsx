import { Navigate, Outlet, useLocation } from "react-router";
import { AdminLayout } from "~/layouts/admin-layout";

export default function AdminRouteLayout() {
  const location = useLocation();

  if (location.pathname === "/admin" || location.pathname === "/admin/") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
