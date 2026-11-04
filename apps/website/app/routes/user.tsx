import { Outlet } from "react-router";
import { UserLayout } from "~/layouts/user-layout";

export default function UserRouteLayout() {
  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  );
}

