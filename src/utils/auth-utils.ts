import { encryptStorage } from "./encrypt-storage";

export const setAuthToken = (token: string) => {
  document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
  encryptStorage.setItem("token", token);
};

export const removeAuthToken = () => {
  document.cookie =
    "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  encryptStorage.removeItem("token");
};
