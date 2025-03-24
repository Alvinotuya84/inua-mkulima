// src/routes/AppRouter.tsx
import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import routes from "./route";
import MainLayout from "@/layouts/MainLayout";

// Loading component for Suspense fallback
const Loading = () => <div>Loading...</div>;

const AppRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routes.map((route) => {
          const Component = route.component;
          const Layout = route.layout || MainLayout;

          // Determine the final component based on protection status
          const FinalComponent = () => (
            <Layout>
              <Component />
            </Layout>
          );

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.isProtected ? (
                  <ProtectedRoute>
                    <FinalComponent />
                  </ProtectedRoute>
                ) : (
                  <FinalComponent />
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
