// hooks/useVideoUpload.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/config/api'
import { useState } from 'react'

// Types
export interface VideoData {
  videoFile?: File
  thumbnail?: File
  title: string
  description: string
  year: number
  duration: number
  rating: number
  quality: string
  status: string
  tags?: string[]
}

export interface Video {
  _id: string
  title: string
  description: string
  year: number
  duration: number
  rating: number
  quality: string
  status: string
  genres: string[]
  thumbnailUrl?: string
  videoUrl?: string
  createdAt: string
  updatedAt: string
}

export interface VideoUploadResponse {
  success: boolean
  message: string
  data?: {
    video: Video
  }
}

export interface VideoWithSignedUrlResponse {
  success: boolean
  data: {
    video: Video
    signedUrl: string
    streamUrl: string
  }
}

export interface VideosListResponse {
  success: boolean
  data: {
    videos: Video[]
    total: number
    page: number
    limit: number
  }
}

export interface VideoStreamOptions {
  range?: string
  quality?: string
}

export interface GetVideosParams {
  page?: number
  limit?: number
  search?: string
  genre?: string
  year?: number
  quality?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UploadProgressCallback {
  (progress: number): void
}

// API service for video operations
const videoApi = {
  // Upload video with file
  uploadVideo: async (videoData: VideoData, onProgress?: UploadProgressCallback): Promise<VideoUploadResponse> => {
    const formData = new FormData()
    
    // Add video file
    if (videoData.videoFile) {
      formData.append('videoFile', videoData.videoFile)
    }
    
    // Add thumbnail file
    if (videoData.thumbnail) {
      formData.append('thumbnail', videoData.thumbnail)
    }
    
    // Add other video data
    const videoInfo = {
      title: videoData.title,
      description: videoData.description,
      year: videoData.year,
      duration: videoData.duration,
      rating: parseFloat(videoData.rating.toString()) || 0,
      quality: videoData.quality,
      status: videoData.status,
      genres: videoData.tags || [],
    }
    
    // Add video info fields to FormData
    Object.entries(videoInfo).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle array fields (like genres)
          value.forEach(item => {
            formData.append(`${key}[]`, item.toString())
          })
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    const response = await axiosInstance.post<VideoUploadResponse>('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(progress)
        }
      },
    })

    return response.data
  },

  // Get video with signed URL
  getVideoWithSignedUrl: async (videoId: string): Promise<VideoWithSignedUrlResponse> => {
    const response = await axiosInstance.get<VideoWithSignedUrlResponse>(`/videos/${videoId}/stream`)
    return response.data
  },

  // Get all videos
  getVideos: async (params: GetVideosParams = {}): Promise<VideosListResponse> => {
    const response = await axiosInstance.get<VideosListResponse>('/videos/all', { params })
    return response.data
  },

  // Get video stream URL (for direct streaming)
  getVideoStreamUrl: (videoId: string, options: VideoStreamOptions = {}): string => {
    const baseUrl = axiosInstance.defaults.baseURL || ''
    const queryParams = new URLSearchParams()
    
    if (options.quality) {
      queryParams.append('quality', options.quality)
    }
    
    const queryString = queryParams.toString()
    return `${baseUrl}/videos/${videoId}/stream${queryString ? `?${queryString}` : ''}`
  },

  // Create a streaming request with range support
  streamVideo: async (videoId: string, options: VideoStreamOptions = {}): Promise<Response> => {
    const url = videoApi.getVideoStreamUrl(videoId, options)
    
    const headers: Record<string, string> = {}
    if (options.range) {
      headers['Range'] = options.range
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include', // Include cookies for authentication if needed
    })

    if (!response.ok) {
      throw new Error(`Streaming failed: ${response.status} ${response.statusText}`)
    }

    return response
  },

  // Get video metadata only
  getVideoMetadata: async (videoId: string): Promise<{ success: boolean; data: Video }> => {
    const response = await axiosInstance.get<{ success: boolean; data: Video }>(`/videos/${videoId}`)
    return response.data
  }
}

// Main upload hook
export const useVideoUpload = () => {
  const queryClient = useQueryClient()

  return useMutation<VideoUploadResponse, Error, { videoData: VideoData; onProgress?: UploadProgressCallback }>({
    mutationFn: ({ videoData, onProgress }) => 
      videoApi.uploadVideo(videoData, onProgress),
    
    onSuccess: (data) => {
      // Invalidate and refetch videos list
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      
      // Optionally add the new video to the cache
      if (data.success && data.data?.video) {
        queryClient.setQueryData(['video', data.data.video._id], data.data.video)
      }
    },
    
    onError: (error) => {
      console.error('Video upload failed:', error)
    }
  })
}

// Hook for getting video with signed URL
export const useVideoWithSignedUrl = (videoId: string | undefined, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['video', videoId, 'signed-url'],
    queryFn: () => videoApi.getVideoWithSignedUrl(videoId!),
    enabled: !!videoId && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes (signed URLs typically expire)
    ...options
  })
}

// Hook for getting videos list
export const useVideos = (params: GetVideosParams = {}, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => videoApi.getVideos(params),
    ...options
  })
}

// Hook for video metadata only
export const useVideoMetadata = (videoId: string | undefined, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['video', videoId, 'metadata'],
    queryFn: () => videoApi.getVideoMetadata(videoId!),
    enabled: !!videoId && (options.enabled !== false),
    ...options
  })
}

// Custom hook with upload progress and state management
export const useVideoUploadWithProgress = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  
  const uploadMutation = useVideoUpload()

  const uploadVideo = async (videoData: VideoData): Promise<VideoUploadResponse> => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const result = await uploadMutation.mutateAsync({
        videoData,
        onProgress: (progress: number) => {
          setUploadProgress(progress)
        }
      })
      
      setIsUploading(false)
      setUploadProgress(100)
      
      return result
    } catch (error) {
      setIsUploading(false)
      setUploadProgress(0)
      throw error
    }
  }

  return {
    uploadVideo,
    uploadProgress,
    isUploading,
    isError: uploadMutation.isError,
    error: uploadMutation.error,
    isSuccess: uploadMutation.isSuccess,
    data: uploadMutation.data,
    reset: () => {
      uploadMutation.reset()
      setUploadProgress(0)
      setIsUploading(false)
    }
  }
}

// Custom hook for video streaming
export const useVideoStream = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const getStreamUrl = (videoId: string, options: VideoStreamOptions = {}): string => {
    return videoApi.getVideoStreamUrl(videoId, options)
  }

  const streamVideo = async (videoId: string, options: VideoStreamOptions = {}): Promise<Response> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await videoApi.streamVideo(videoId, options)
      setIsLoading(false)
      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown streaming error')
      setError(error)
      setIsLoading(false)
      throw error
    }
  }

  return {
    getStreamUrl,
    streamVideo,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}

// Utility functions for video streaming
export const createVideoStreamProps = (videoId: string, options: VideoStreamOptions = {}) => {
  const streamUrl = videoApi.getVideoStreamUrl(videoId, options)
  
  return {
    src: streamUrl,
    controls: true,
    preload: 'metadata' as const,
    // Additional props for better streaming experience
    crossOrigin: 'use-credentials' as const,
    playsInline: true,
  }
}

// Export the API for direct use if needed
export { videoApi }