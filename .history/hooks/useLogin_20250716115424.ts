import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '@/config/api';

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

// API functions
const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const deviceId = credentials.deviceId || getDeviceId();
  
  const response = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for refresh token
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      deviceId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};

const logoutAPI = async (): Promise<void> => {
  const response = await fetch('/api/admin/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

const refreshTokenAPI = async (): Promise<AuthResponse> => {
  const response = await fetch('/api/admin/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Token refresh failed');
  }

  return response.json();
};

const verifyTokenAPI = async (token: string): Promise<AuthResponse> => {
  const response = await fetch('/api/admin/auth/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  return response.json();
};

// Main hook
export const useAdminAuth = () => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>(getStoredAuthState);

  // Update session storage when auth state changes
  useEffect(() => {
    setStoredAuthState(authState);
  }, [authState]);

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



// Custom hook for API requests with auth
export const useAuthenticatedRequest = () => {
  const { accessToken, refreshToken, logout } = useAdminAuth();

  const makeRequest = useCallback(async (
    url: string,
    options: RequestInit = {}
  ) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle 401 errors by trying to refresh token
    if (response.status === 401 && accessToken) {
      try {
        await refreshToken();
        // Retry the request with new token
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });
        
        if (retryResponse.status === 401) {
          logout();
          throw new Error('Authentication failed');
        }
        
        return retryResponse;
      } catch (error) {
        logout();
        throw error;
      }
    }

    return response;
  }, [accessToken, refreshToken, logout]);

  return { makeRequest };
};