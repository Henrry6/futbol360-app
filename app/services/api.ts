import axios from "axios";
import { useAuthStore } from "@/services/store";

// URL de la API según el modo (ver .env.development / .env.production).
// Sin valor se usa "/api", que next.config.ts reescribe a http://localhost:5001.
const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Protección: en desarrollo no se debe escribir sobre la API de producción.
if (
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
  !/^(\/|https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?)/.test(baseURL)
) {
  console.warn(
    `⚠️ Modo desarrollo usando una API remota: ${baseURL}. ` +
      "Revisa NEXT_PUBLIC_API_URL en .env.development / .env.local.",
  );
}

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
