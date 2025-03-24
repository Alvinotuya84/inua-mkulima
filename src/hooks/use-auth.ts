import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { BASE_URL } from "@/constants/network";
import useUserStore from "@/stores/user.stores";
import { toast } from "@/hooks/use-toast";
import { postJson } from "@/utils/fetch.utils";

// Validation schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { setUser, setToken, logout } = useUserStore();

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await postJson<{
        id: number;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        gender: string;
        image: string;
        accessToken: string;
        refreshToken: string;
      }>(
        `${BASE_URL}/auth/login`,
        {
          ...data,
          expiresInMins: 60,
        },
        { excludeAuthHeader: true }
      );

      if (response.success) {
        const userData = response.data;
        setUser({
          id: userData.id.toString(),
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
        });
        setToken(userData.accessToken);

        toast({
          title: "Login Successful",
          description: "Welcome to Inua Mkulima Subsidy Program",
          variant: "default",
        });

        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed");
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      variant: "default",
    });
    navigate("/login");
  };

  return {
    login,
    logout: handleLogout,
    isLoading,
    error,
  };
};
