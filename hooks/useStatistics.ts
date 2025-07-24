import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '@/config/api';
import { AxiosError } from 'axios';

// get all statistics
export const useStatistics = () => {
    const queryClient = useQueryClient();
    const [error, setError] = useState<AxiosError | null>(null);
    
    const fetchStatistics = useCallback(async () => {
        try {
        const response = await axiosInstance.get('/admin/statistics');
        return response.data;
        } catch (err) {
        setError(err as AxiosError);
        throw err;
        }
    }, []);
    
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['statistics'],
        queryFn: fetchStatistics,
        retry: false,
    });
    
    return { data, isLoading, error, refetch };
}