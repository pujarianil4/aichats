import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { store } from "../contexts/store.ts";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";
import {
  setUserData,
  setUserError,
  setUserLoading,
} from "../contexts/reducers/index.ts";
import { disconnect } from "wagmi/actions";
import { wagmiConfig } from "../wagmiConfig.ts";

const SECRET_KEY = import.meta.env.TOKEN_SECRET_KEY || "secret_key";
const BASE_URL =
  import.meta.env.NEXT_PUBLIC_BASE_URL || "https://ai-agent-r139.onrender.com/";

// Encrypt token before saving to cookies
export const encryptToken = (token: string): string => {
  return AES.encrypt(token, SECRET_KEY.trim()).toString();
};

// Decrypt token function
export const decryptToken = (encryptedToken: string): string | null => {
  try {
    const bytes = AES.decrypt(encryptedToken, SECRET_KEY.trim());
    return bytes.toString(CryptoJS.enc.Utf8) || null;
  } catch (error) {
    console.error("Token decryption failed:", error);
    return null;
  }
};
// Save encrypted tokens in cookies
const saveTokens = (id: string, token: string): void => {
  Cookies.set("id", id, { path: "/" });
  Cookies.set("token", encryptToken(token), { path: "/" });
};

// Retrieve and decrypt token details from cookies
const getTokens = (): { id: string | null; token: string | null } => {
  const id = Cookies.get("id");
  const encryptedToken = Cookies.get("token");
  const token = encryptedToken ? decryptToken(encryptedToken) : null;
  return { id: id || null, token };
};

// Clear tokens from cookies
const clearTokens = (): void => {
  Cookies.remove("id");
  Cookies.remove("token");
  Cookies.remove("sid");
};

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { token } = getTokens();
    if (token) {
      config.headers = config.headers ?? ({} as AxiosRequestHeaders);
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.url === "/auth/connect") {
      const { token, id } = response.data;
      console.log(response.data);

      saveTokens(id, token);

      store.dispatch(setUserData({ isLogedIn: "yes", ...response.data }));
    }
    if (response.config.url === "/auth/disconnect") {
      //  store.dispatch(setUserData("disconnected"));
    }
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      console.error("401 Unauthorized - Clearing tokens");
      clearTokens();
      store.dispatch(setUserError("Session expired. Please log in again."));
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Initial token validation on page load
(async () => {
  const { token } = getTokens();
  if (token) {
    try {
      const user = await api.get("/auth/currentuser");

      store.dispatch(setUserData(user.data));
    } catch {
      clearTokens();

      store.dispatch(setUserError("Session expired. Please log in again."));
      await disconnect(wagmiConfig, {});
      window.location.reload();
    }
  }
})();

const validateUser = async () => {
  const { token } = getTokens();
  console.log("validateUser", token);

  if (token) {
    try {
      const user = await api.get("/auth/currentuser");

      store.dispatch(setUserData({ isLogedIn: "yes", ...user.data }));
    } catch {
      store.dispatch(setUserError("Session expired. Please log in again."));
    }
  }
};

export { api, saveTokens, clearTokens, getTokens, validateUser };
