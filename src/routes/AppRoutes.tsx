import { Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import useUserStore from "@/stores/user.stores";
import TopLoadingBar from "@/components/common/suspense/TopLoadingBar";
import routes from "./route";

// Improved loading component
const LoadingFallback = () => {
  return (
    <>
      <TopLoadingBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          className="loading-spinner"
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid rgba(0, 0, 0, 0.1)",
            borderLeft: "4px solid #E0B643",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div>Loading content...</div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

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
  const location = useLocation();
  const [isChangingRoute, setIsChangingRoute] = useState(false);

  // Detect route changes to show loading indicator
  useEffect(() => {
    setIsChangingRoute(true);

    // Hide the indicator after a short delay (simulating load completion)
    const timer = setTimeout(() => {
      setIsChangingRoute(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* Show top loading bar when changing routes */}
      {isChangingRoute && <TopLoadingBar />}

      <Suspense fallback={<LoadingFallback />}>
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
    </>
  );
};

export default AppRouter;
