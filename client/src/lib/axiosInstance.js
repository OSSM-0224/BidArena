import { store } from "@/app/store";
import { removeUser } from "@/features/auth/state/authSlice";
import axios from "axios";

export let axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(removeUser());
    }
    return Promise.reject(error);
  },
);
