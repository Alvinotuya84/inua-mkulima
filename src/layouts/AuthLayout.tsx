import React from "react";
import { Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import useUserStore from "@/stores/user.stores";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useUserStore((state) => state.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Box sx={{ minHeight: "100vh" }}>{children}</Box>;
};

export default AuthLayout;
