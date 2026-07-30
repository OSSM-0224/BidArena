import { store } from "@/app/store";
import { removeUser } from "@/features/auth/state/authSlice";
import axios from "axios";

export let axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    let originalReq = error.config;

     if (originalReq.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      try {
        await axiosInstance.post("/auth/refresh");
        return axiosInstance(originalReq);
      } catch (error) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
