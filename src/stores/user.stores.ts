import { removeAuthToken, setAuthToken } from "@/utils/auth-utils";
import { encryptStorage } from "@/utils/encrypt-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tempEmail: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setTempEmail: (email: string | null) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      tempEmail: null,

      setUser: (user) => set({ user }),

      setToken: (token) => {
        if (token) {
          setAuthToken(token);
        } else {
          removeAuthToken();
        }
        set({ token });
      },

      setRefreshToken: (refreshToken) => set({ refreshToken }),

      setTempEmail: (email) => set({ tempEmail: email }),

      logout: () => {
        removeAuthToken();
        set({
          user: null,
          token: null,
          refreshToken: null,
          tempEmail: null,
        });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => encryptStorage),
    }
  )
);

export default useUserStore;
