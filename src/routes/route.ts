import { lazy } from "react";

// Define route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PRODUCT_DETAILS: "/product-details",
  SUMMARY: "/summary",
  TRANSACTIONS: "/transactions",
  REPORTS: "/reports",
  RECEIPT: "/receipt/:id",
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
    component: lazy(() => import("@/pages/Dashboard")),
    isProtected: true,
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
    path: ROUTES.PRODUCT_DETAILS,
    component: lazy(() => import("@/pages/ProductDetails")),
    isProtected: true,
  },
  {
    path: ROUTES.SUMMARY,
    component: lazy(() => import("@/pages/Summary")),
    isProtected: true,
  },
  {
    path: ROUTES.TRANSACTIONS,
    component: lazy(() => import("@/pages/Transactions")),
    isProtected: true,
  },
  {
    path: ROUTES.REPORTS,
    component: lazy(() => import("@/pages/Reports")),
    isProtected: true,
  },
  {
    path: ROUTES.RECEIPT,
    component: lazy(() => import("@/pages/Receipt")),
    isProtected: true,
  },
  {
    path: ROUTES.NOT_FOUND,
    component: lazy(() => import("@/pages/NotFound")),
    isProtected: false,
  },
];

export default routes;
