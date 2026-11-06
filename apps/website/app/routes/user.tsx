import { Navigate, Outlet, useLocation } from "react-router";
import { UserLayout } from "~/layouts/user-layout";

export default function UserRouteLayout() {
  const location = useLocation();

  if (location.pathname === "/user" || location.pathname === "/user/") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  );
}

