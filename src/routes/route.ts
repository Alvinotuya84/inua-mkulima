// src/routes/routes.ts
import { lazy } from "react";

// Define route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  NOT_FOUND: "*",
};

// Define route types
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  layout?: React.ComponentType<any>;
  isProtected?: boolean;
}

// Define the routes
const routes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    component: lazy(() => import("@/pages/Home")),
    isProtected: false,
  },
  {
    path: ROUTES.LOGIN,
    component: lazy(() => import("@/pages/Login")),
    isProtected: false,
  },
  {
    path: ROUTES.DASHBOARD,
    component: lazy(() => import("@/pages/Dashboard")),
    isProtected: true,
  },
  {
    path: ROUTES.NOT_FOUND,
    component: lazy(() => import("@/pages/NotFound")),
    isProtected: false,
  },
];

export default routes;
