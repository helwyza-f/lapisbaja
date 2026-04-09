// lib/auth.ts
import Cookies from "js-cookie";

const TOKEN_KEY = "lapisbaja_token";

export const setToken = (token: string) => {
  // Simpan token selama 1 hari
  Cookies.set(TOKEN_KEY, token, {
    expires: 1,
    secure: true,
    sameSite: "strict",
  });
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};
