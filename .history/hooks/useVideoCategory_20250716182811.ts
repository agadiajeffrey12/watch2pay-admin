import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '@/config/api';
import { AxiosError } from 'axios';

// Types matching your backend
interface VideoCategoriesDto {
  name: string;
  description?: string;
  // Add other properties as needed based on your DTO
}

interface VideoCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Add other properties as needed
}

interface ResponseObjectInterface {
  message: string;
  success: boolean;
  status: number;
  data?: {
    videoCategory?: VideoCategory;
  };
  errors?: {
    message: string;
    code: string | null;
  };
}

// API function - direct translation of your backend method
const createVideoCategory = async (data: VideoCategoriesDto): Promise<ResponseObjectInterface> => {
  try {
    const response = await axiosInstance.post<ResponseObjectInterface>('/video-categories', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ResponseObjectInterface>;
    
    // Handle axios errors and return the same error structure as your backend
    return {
      message: 'An error occurred while creating video category',
      status: 500,
      success: false,
      errors: {
        message: axiosError.response?.data?.errors?.message || axiosError.message,
        code: axiosError.response?.data?.errors?.code || null,
      },
    };
  }
};

// Custom hook for creating video categories
export const useCreateVideoCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createVideoCategory,
    onSuccess: (data) => {
      // You can add cache invalidation here if you have a list query later
      console.log('Video category successfully created:', data);
    },
    onError: (error: ResponseObjectInterface) => {
      console.error('Video category creation error:', error);
    },
  });

  return {
    createVideoCategory: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};