import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
// const BASE_URL = "http://localhost:8080/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials:true
});

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials:true
});


// Create an axios instance
export const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials:true

});

// Request interceptor — attach the access token
authAxios.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') { // Ensure client-side execution
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to prevent multiple token refresh requests
// let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper to handle queued requests after token refresh
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Response interceptor — handle 403 and refresh token
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (typeof window !== 'undefined' && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        console.log(refreshToken)
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await authAxios.post('/auth/refresh', { refreshToken, type:'customer' });

        sessionStorage.setItem('accessToken', data.accessToken);

        // Update the header with the new token
        authAxios.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return authAxios(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);