import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '@/config/api';
import { AxiosError } from 'axios';

// get all users with pagination
export const useUsers = (page: number, limit: number) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<AxiosError | null>(null);
  
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/admin/users?page=${page}&limit=${limit}`);
      return response.data;
    } catch (err) {
      setError(err as AxiosError);
      throw err;
    }
  }, [page, limit]);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', page, limit],
    queryFn: fetchUsers,
    retry: false,
  });
  
  return { data, isLoading, error, refetch };
}
 