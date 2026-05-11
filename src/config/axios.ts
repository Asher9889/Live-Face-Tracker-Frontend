import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, async function onRejected(error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error



    // Network/server unreachable
    if (!error.response) {
      return Promise.reject( new Error("Server is not responding"));
    }

    // Handle auth refresh only
    if (error.response.status === 401) {

      const originalRequest = error.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      try {
        originalRequest._retry = true;
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }

      
    }

    // Normalize all other errors
      const responseData = error.response.data as { message?: string } | undefined;
      const message: string = responseData?.message || "Something went wrong";

    return Promise.reject(new Error(message));
  }
)

export default api;