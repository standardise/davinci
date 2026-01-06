import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://davinci-core-731059858056.asia-southeast1.run.app/api/v1";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Note: ใน Next.js Client Component ยังใช้ localStorage ได้
    // แต่ถ้าอยาก Advance ต้องเปลี่ยนไปใช้ Cookies (js-cookie) ครับ
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);
