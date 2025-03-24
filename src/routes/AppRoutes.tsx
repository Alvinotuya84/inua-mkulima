import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./route";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import useUserStore from "@/stores/user.stores";

const Loading = () => (
  <div className="flex items-center justify-center h-screen">Loading...</div>
);

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useUserStore((state) => state.token);

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routes.map((route) => {
          const Component = route.component;

          // Determine which layout to use
          const Layout = route.path === "/login" ? AuthLayout : MainLayout;

          // For login page, we want AuthLayout, for others MainLayout
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.isProtected ? (
                  <ProtectedRoute>
                    <Layout>
                      <Component />
                    </Layout>
                  </ProtectedRoute>
                ) : (
                  <Layout>
                    <Component />
                  </Layout>
                )
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
