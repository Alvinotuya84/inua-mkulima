import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/network";
import useUserStore from "@/stores/user.stores";
import { toast } from "@/hooks/use-toast";
import { postJson } from "@/utils/fetch.utils";

// Validation schemas
export const usernameSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Combined schema for the complete login form
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Auth response type from dummyjson API
interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    setUser,
    setToken,
    setRefreshToken,
    logout: storeLogout,
  } = useUserStore();

  // Login mutation with React Query
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      try {
        // Use the postJson function to make the API call
        const response = await postJson<AuthResponse>(
          `${BASE_URL}/auth/login`,
          {
            ...data,
            expiresInMins: 60,
          },
          { excludeAuthHeader: true }
        );

        // Return the response
        return response;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: (response) => {
      if (response.accessToken) {
        const userData = response;

        // Set user data in store
        setUser({
          id: userData.id.toString(),
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
        });

        // Set tokens
        setToken(userData.accessToken);
        if (userData.refreshToken) {
          setRefreshToken(userData.refreshToken);
        }

        toast({
          title: "Login Successful",
          description: `Welcome, ${userData.firstName} ${userData.lastName}`,

          variant: "default",
        });

        navigate("/dashboard");
      } else {
        const errorMsg = "Invalid credentials";
        setError(errorMsg);

        toast({
          title: "Login Failed",
          description: errorMsg,

          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);

      toast({
        title: "Login Error",
        description: errorMessage,

        variant: "destructive",
      });
    },
  });

  const login = (data: LoginFormData) => {
    setError(null);
    loginMutation.mutate(data);
  };

  const logout = () => {
    storeLogout();

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",

      variant: "default",
    });

    navigate("/login");
  };

  return {
    login,
    logout,
    isLoading: loginMutation.isPending,
    isSuccess: loginMutation.isSuccess,
    error,
  };
};
