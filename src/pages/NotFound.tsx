import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useUserStore from "@/stores/user.stores";

const NotFound: React.FC = () => {
  const token = useUserStore((state) => state.token);
  const redirectPath = token ? "/dashboard" : "/login";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "#E0B643", mb: 2 }} />

        <Typography variant="h4" component="h1" gutterBottom>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>

        <Button
          component={Link}
          to={redirectPath}
          variant="contained"
          sx={{
            backgroundColor: "#355E3B",
            "&:hover": {
              backgroundColor: "#2A4A30",
            },
          }}
        >
          {token ? "Back to Dashboard" : "Go to Login"}
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
