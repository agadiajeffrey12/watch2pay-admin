// hooks/useVideoUpload.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/config/api'
import { useState } from 'react'

// API service for video upload
const videoApi = {
  // Upload video with file
  uploadVideo: async (videoData, onProgress) => {
    const formData = new FormData()
    
    // Add video file
    if (videoData.videoFile) {
      formData.append('videoFile', videoData.videoFile)
    }
    
    // Add thumbnail file
    if (videoData.thumbnail) {
      formData.append('thumbnail', videoData.thumbnail)
    }
    
    // Add other video data as JSON string or individual fields
    const videoInfo = {
      title: videoData.title,
      description: videoData.description,
      year: videoData.year,
      duration: videoData.duration,
      rating: parseFloat(videoData.rating) || 0,
      quality: videoData.quality,
      status: videoData.status,
      genres: videoData.tags || [], // Assuming tags map to genres
    }
    
    // Add video info fields to FormData
    Object.keys(videoInfo).forEach(key => {
      if (videoInfo[key] !== undefined && videoInfo[key] !== null) {
        if (Array.isArray(videoInfo[key])) {
          // Handle array fields (like genres)
          videoInfo[key].forEach(item => {
            formData.append(`${key}[]`, item)
          })
        } else {
          formData.append(key, videoInfo[key])
        }
      }
    })

    const response = await axiosInstance.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
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
  getVideoWithSignedUrl: async (videoId) => {
    const response = await axiosInstance.get(`/videos/${videoId}/signed-url`)
    return response.data
  },

  // Get all videos
  getVideos: async (params = {}) => {
    const response = await axiosInstance.get('/videos/all', { params })
    return response.data
  }
}

// Main upload hook
export const useVideoUpload = () => {
  const queryClient = useQueryClient()

  return useMutation({
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
export const useVideoWithSignedUrl = (videoId, options = {}) => {
  return useQuery({
    queryKey: ['video', videoId, 'signed-url'],
    queryFn: () => videoApi.getVideoWithSignedUrl(videoId),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000, // 5 minutes (signed URLs typically expire)
    ...options
  })
}

// Hook for getting videos list
export const useVideos = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => videoApi.getVideos(params),
    ...options
  })
}

// Custom hook with upload progress and state management
export const useVideoUploadWithProgress = () => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  const uploadMutation = useVideoUpload()

  const uploadVideo = async (videoData) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const result = await uploadMutation.mutateAsync({
        videoData,
        onProgress: (progress) => {
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