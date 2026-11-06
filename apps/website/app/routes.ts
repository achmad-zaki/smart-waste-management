import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  // Admin Portal Routes
  ...prefix("admin", [
    layout("routes/admin.tsx", [
      route("dashboard", "routes/admin.dashboard.tsx"),
      route("reports", "routes/admin.reports.tsx"),
      route("reports/:id", "routes/admin.reports.$id.tsx"),
      route("users", "routes/admin.users.tsx"),
      route("users/:id", "routes/admin.users.$id.tsx"),
      route("profile", "routes/admin.profile.tsx"),
    ]),
  ]),

  // User Portal Routes
  ...prefix("user", [
    layout("routes/user.tsx", [
      route("dashboard", "routes/user.dashboard.tsx"),
      route("reports", "routes/user.reports.tsx"),
      route("reports/new", "routes/user.reports.new.tsx"),
      route("reports/:id", "routes/user.reports.$id.tsx"),
      route("profile", "routes/user.profile.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
