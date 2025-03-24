import { AES, enc } from "crypto-js";

const STORAGE_KEY = "thumbprint_secure_storage";
const ENCRYPTION_KEY = "default-key";

export const encryptStorage = {
  getItem: (key: string): string | null => {
    try {
      const encryptedData = localStorage.getItem(STORAGE_KEY);
      if (!encryptedData) return null;

      const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
      return decryptedData[key] || null;
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string) => {
    try {
      const existingData = encryptStorage.getItem(STORAGE_KEY) || "{}";
      const parsedData = JSON.parse(existingData);
      const newData = { ...parsedData, [key]: value };
      const encrypted = AES.encrypt(
        JSON.stringify(newData),
        ENCRYPTION_KEY
      ).toString();
      localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error) {
      console.error("Error storing data:", error);
    }
  },

  removeItem: (key: string) => {
    try {
      const existingData = encryptStorage.getItem(STORAGE_KEY);
      if (!existingData) return;

      const parsedData = JSON.parse(existingData);
      delete parsedData[key];
      const encrypted = AES.encrypt(
        JSON.stringify(parsedData),
        ENCRYPTION_KEY
      ).toString();
      localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error) {
      console.error("Error removing data:", error);
    }
  },
};
