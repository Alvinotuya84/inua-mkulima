import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginSchema, LoginFormData, useAuth } from "@/hooks/use-auth";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #f0f2f5, #e6e9f0)",
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1200,
          height: "80vh",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left side - Image */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            backgroundImage: "url(/farmer-image.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 30,
              left: 30,
              display: "flex",
              alignItems: "center",
              color: "white",
            }}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "white",
                textShadow: "0px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              BANK
            </Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 30,
              right: 30,
              textAlign: "right",
            }}
          >
            <img
              src="/county-logo.png"
              alt="County Logo"
              style={{ width: 100, height: "auto" }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                color: "white",
                mt: 1,
                fontStyle: "italic",
                textShadow: "0px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Growing together
            </Typography>
          </Box>
        </Box>

        {/* Right side - Login Form */}
        <Paper
          elevation={0}
          sx={{
            flex: { xs: 1, md: 0.7 },
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "medium",
                color: "#656565",
                mb: 1,
              }}
            >
              WELCOME TO
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#43a047",
                mb: 4,
              }}
            >
              Inua Mkulima -
              <br />
              Subsidy Program
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1,
                    textAlign: "left",
                    color: "#656565",
                  }}
                >
                  Enter your password to continue
                </Typography>

                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>

              {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: "#E0B643",
                  "&:hover": {
                    backgroundColor: "#C9A43B",
                  },
                }}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
