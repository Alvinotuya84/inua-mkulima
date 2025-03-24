import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import farmerBg from "@/assets/utils/farmer.png";

import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowForward } from "@mui/icons-material";
import {
  usernameSchema,
  passwordSchema,
  LoginFormData,
  useAuth,
} from "@/hooks/use-auth";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"username" | "password">("username");
  const { login, isLoading, error } = useAuth();

  // Create separate forms for username and password steps
  const {
    control: usernameControl,
    handleSubmit: handleUsernameSubmit,
    formState: { errors: usernameErrors },
    watch: watchUsername,
  } = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Get current username from the form
  const username = watchUsername("username");

  const onUsernameSubmit = async () => {
    // Simply move to password step without verification
    setStep("password");
  };

  const onPasswordSubmit = (data: any) => {
    login({
      username,
      password: data.password,
    });
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
            backgroundImage: `url(${farmerBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        />

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

            {/* Username step */}
            {step === "username" && (
              <form onSubmit={handleUsernameSubmit(onUsernameSubmit)}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      textAlign: "left",
                      color: "#656565",
                    }}
                  >
                    Enter your username to continue
                  </Typography>

                  <Controller
                    name="username"
                    control={usernameControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!usernameErrors.username}
                        helperText={usernameErrors.username?.message}
                        autoFocus
                      />
                    )}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    backgroundColor: "#E0B643",
                    "&:hover": {
                      backgroundColor: "#C9A43B",
                    },
                  }}
                >
                  Continue
                </Button>
              </form>
            )}

            {/* Password step */}
            {step === "password" && (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      textAlign: "left",
                      color: "#656565",
                    }}
                  >
                    Hello, <strong>{username}</strong>
                    <br />
                    Enter your password to continue
                  </Typography>

                  <Controller
                    name="password"
                    control={passwordControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!passwordErrors.password}
                        helperText={passwordErrors.password?.message}
                        autoFocus
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

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setStep("username")}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      flex: 1,
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      flex: 2,
                      backgroundColor: "#E0B643",
                      "&:hover": {
                        backgroundColor: "#C9A43B",
                      },
                    }}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </Box>
              </form>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
