import { Outlet } from "react-router";
import { AdminLayout } from "~/layouts/admin-layout";

export default function AdminRouteLayout() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

