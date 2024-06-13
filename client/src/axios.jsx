import axios from "axios";

export const AxiosInstance = axios.create({
baseURL: `http://localhost:3000`,
//baseURL: "http://localhost:5007/api",
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // config.headers.Authorization = `Bearer ${accessToken}`;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
