import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '@/config/api';
import { AxiosError } from 'axios';

// Types
interface LoginCredentials {
  email: string;
  password: string;
  deviceId?: string;
}

interface AdminUser {
  userId: string;
  email: string;
  role: string;
  name: {
    firstName: string;
    lastName: string;
  };
  avatar: string;
  stats: {
    referrals: number;
    watchTime: number;
    earnings: number;
    taskCompleted: number;
  };
}

interface AuthResponse {
  status: number;
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    user: AdminUser;
    sessionId: string;
  };
  errors?: {
    message: string;
  };
}

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
}

// Constants
const AUTH_STORAGE_KEY = 'admin_auth_state';
const DEVICE_ID_KEY = 'admin_device_id';

// Utility functions
const generateDeviceId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 15);
  return `admin_${timestamp}_${randomString}`;
};

const getDeviceId = (): string => {
  let deviceId = sessionStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = generateDeviceId();
    sessionStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

const getStoredAuthState = (): AuthState => {
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error parsing stored auth state:', error);
  }
  
  return {
    user: null,
    accessToken: null,
    sessionId: null,
    isAuthenticated: false,
  };
};

const setStoredAuthState = (state: AuthState): void => {
  try {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error storing auth state:', error);
  }
};

const clearStoredAuthState = (): void => {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(DEVICE_ID_KEY);
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};

// API functions using axiosInstance
const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const deviceId = credentials.deviceId || getDeviceId();
  
  try {
    const response = await axiosInstance.post('/admin/authenticate', {
      email: credentials.email,
      password: credentials.password,
      deviceId,
    });
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthResponse>;
    throw new Error(axiosError.response?.data?.message || 'Login failed');
  }
};

const logoutAPI = async (): Promise<void> => {
  try {
    await axiosInstance.post('/api/admin/logout');
  } catch (error) {
    // const axiosError = error as AxiosError;
 const axiosError = error as AxiosError<AuthResponse>;
    throw new Error(axiosError.response?.data?.message || 'Token verification failed');
  }
};

const refreshTokenAPI = async (): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/api/admin/refresh');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthResponse>;
    throw new Error(axiosError.response?.data?.message || 'Token refresh failed');
  }
};

const verifyTokenAPI = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/api/admin/verify', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AuthResponse>;
    throw new Error(axiosError.response?.data?.message || 'Token verification failed');
  }
};

// Main hook
export const useAdminAuth = () => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>(getStoredAuthState);

  // Update session storage when auth state changes
  useEffect(() => {
    setStoredAuthState(authState);
  }, [authState]);

  // Set up axios interceptor for automatic token inclusion
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (authState.accessToken) {
          config.headers.Authorization = `Bearer ${authState.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshResponse = await refreshTokenAPI();
            if (refreshResponse.success && refreshResponse.data) {
              const newAuthState: AuthState = {
                user: refreshResponse.data.user,
                accessToken: refreshResponse.data.accessToken,
                sessionId: refreshResponse.data.sessionId,
                isAuthenticated: true,
              };
              setAuthState(newAuthState);
              
              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [authState.accessToken]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginAPI,
    onSuccess: (data) => {
      if (data.success && data.data) {
        const newAuthState: AuthState = {
          user: data.data.user,
          accessToken: data.data.accessToken,
          sessionId: data.data.sessionId,
          isAuthenticated: true,
        };
        setAuthState(newAuthState);
        queryClient.invalidateQueries({ queryKey: ['admin', 'auth'] });
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      logout();
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutAPI,
    onSettled: () => {
      // Clear state regardless of API success/failure
      logout();
    },
  });

  // Token refresh mutation
  const refreshMutation = useMutation({
    mutationFn: refreshTokenAPI,
    onSuccess: (data) => {
      if (data.success && data.data) {
        const newAuthState: AuthState = {
          user: data.data.user,
          accessToken: data.data.accessToken,
          sessionId: data.data.sessionId,
          isAuthenticated: true,
        };
        setAuthState(newAuthState);
      }
    },
    onError: () => {
      logout();
    },
  });

  // Token verification query
  const { data: verificationData, isError: verificationError } = useQuery({
    queryKey: ['admin', 'auth', 'verify', authState.accessToken],
    queryFn: () => verifyTokenAPI(authState.accessToken!),
    enabled: !!authState.accessToken && authState.isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Handle token verification errors
  useEffect(() => {
    if (verificationError && authState.isAuthenticated) {
      // Try to refresh token first
      refreshMutation.mutate();
    }
  }, [verificationError, authState.isAuthenticated, refreshMutation]);

  // Logout function
  const logout = useCallback(() => {
    const clearedState: AuthState = {
      user: null,
      accessToken: null,
      sessionId: null,
      isAuthenticated: false,
    };
    setAuthState(clearedState);
    clearStoredAuthState();
    queryClient.clear();
  }, [queryClient]);

  // Login function
  const login = useCallback((credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  }, [loginMutation]);

  // Logout function with API call
  const logoutWithAPI = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  // Refresh token function
  const refreshToken = useCallback(() => {
    refreshMutation.mutate();
  }, [refreshMutation]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!authState.accessToken || !authState.isAuthenticated) return;

    // Parse token to get expiration time (assuming JWT)
    try {
      const tokenPayload = JSON.parse(atob(authState.accessToken.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      // Refresh 5 minutes before expiration
      const refreshTime = Math.max(timeUntilExpiration - 5 * 60 * 1000, 0);

      if (refreshTime > 0) {
        const timeoutId = setTimeout(() => {
          refreshToken();
        }, refreshTime);

        return () => clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }, [authState.accessToken, authState.isAuthenticated, refreshToken]);

  return {
    // State
    user: authState.user,
    accessToken: authState.accessToken,
    sessionId: authState.sessionId,
    isAuthenticated: authState.isAuthenticated,

    // Actions
    login,
    logout: logoutWithAPI,
    logoutLocal: logout,
    refreshToken,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshMutation.isPending,

    // Errors
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    refreshError: refreshMutation.error,

    // Utility
    getAuthHeader: () => authState.accessToken ? `Bearer ${authState.accessToken}` : null,
    getDeviceId,
  };
};

// Simplified authenticated request hook since axios handles everything
export const useAuthenticatedRequest = () => {
  const { isAuthenticated } = useAdminAuth();

  return {
    // axiosInstance is already configured with interceptors
    axiosInstance,
    isAuthenticated,
  };
};