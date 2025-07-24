// app/dashboard/movies/[id]/page.tsx
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Heart, 
  Eye, 
  Star, 
  Calendar,
  Clock,
  Tag,
  Share2,
  Edit,
  Trash2,
  ArrowLeft,
  MoreHorizontal
} from 'lucide-react'
import { 
  useVideoWithSignedUrl, 
  useVideoStream, 
  createVideoStreamProps,
  Video 
} from '@/hooks/useVideo'

interface PageProps {
  params: {
    id: string
  }
}

const MoviePreviewPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter()
  const videoId = params.id

  console.log('Video ID:', videoId)
  
  // Video streaming hooks
  const { data: videoData, isLoading, error, refetch } = useVideoWithSignedUrl(videoId)
  
  const { getStreamUrl } = useVideoStream()
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastRefreshTimeRef = useRef<number>(Date.now())

  const video = videoData?.data?.video
  const streamUrl = videoId ? video?.streamUrl : ''

  // Function to refresh the signed URL

// Enhanced refreshSignedUrl function for seamless playback
const refreshSignedUrl = useCallback(async () => {
  if (!videoRef.current || !video || isRefreshing) return

  try {
    setIsRefreshing(true)
    
    // Store current playback state
    const wasPlaying = !videoRef.current.paused
    const currentPosition = videoRef.current.currentTime
    const currentVolume = videoRef.current.volume
    const wasMuted = videoRef.current.muted

    console.log('Refreshing signed URL at position:', currentPosition)

    // Fetch new signed URL
    const result = await refetch()
    const newStreamUrl = result.data?.data?.video?.streamUrl

    if (newStreamUrl && newStreamUrl !== streamUrl) {
      // Create a new video element for preloading
      const tempVideo = document.createElement('video')
      tempVideo.src = newStreamUrl
      tempVideo.currentTime = currentPosition
      tempVideo.volume = currentVolume
      tempVideo.muted = wasMuted
      tempVideo.preload = 'metadata'

      // Wait for the temp video to be ready
      const preloadPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Preload timeout'))
        }, 10000) // 10 second timeout

        const handleCanPlay = () => {
          clearTimeout(timeout)
          tempVideo.removeEventListener('canplay', handleCanPlay)
          tempVideo.removeEventListener('error', handleError)
          resolve()
        }

        const handleError = () => {
          clearTimeout(timeout)
          tempVideo.removeEventListener('canplay', handleCanPlay)
          tempVideo.removeEventListener('error', handleError)
          reject(new Error('Failed to preload video'))
        }

        tempVideo.addEventListener('canplay', handleCanPlay)
        tempVideo.addEventListener('error', handleError)
      })

      try {
        // Wait for preload to complete
        await preloadPromise

        // Now seamlessly switch the source
        if (videoRef.current) {
          // Pause current video briefly
          const shouldResume = wasPlaying
          if (shouldResume) {
            videoRef.current.pause()
          }

          // Switch source
          videoRef.current.src = newStreamUrl
          videoRef.current.currentTime = currentPosition
          videoRef.current.volume = currentVolume
          videoRef.current.muted = wasMuted

          // Resume playback immediately if it was playing
          if (shouldResume) {
            try {
              await videoRef.current.play()
            } catch (playError) {
              console.warn('Could not resume playback:', playError)
            }
          }

          console.log('Successfully refreshed URL and maintained position:', currentPosition)
        }
      } catch (preloadError) {
        console.warn('Preload failed, falling back to direct switch:', preloadError)
        
        // Fallback: direct switch without preload
        if (videoRef.current) {
          videoRef.current.src = newStreamUrl
          videoRef.current.currentTime = currentPosition
          videoRef.current.volume = currentVolume
          videoRef.current.muted = wasMuted
          
          if (wasPlaying) {
            videoRef.current.play().catch(console.error)
          }
        }
      }

      // Clean up temp video
      tempVideo.src = ''
      tempVideo.remove()
    }

    lastRefreshTimeRef.current = Date.now()
  } catch (error) {
    console.error('Failed to refresh signed URL:', error)
  } finally {
    setIsRefreshing(false)
  }
}, [video, streamUrl, refetch, isRefreshing])
  // Setup auto-refresh interval
  useEffect(() => {
    if (!video || !streamUrl) return

    // Clear existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
    }

    // Set up new interval for 30 minutes (1800000 ms)
    refreshIntervalRef.current = setInterval(() => {
      refreshSignedUrl()
    }, 30 * 60 * 1000) // 3 minutes

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [video, streamUrl, refreshSignedUrl])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Video event handlers
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Handle video error events
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleVideoError = (e: Event) => {
      console.error('Video error occurred:', e)
      // Attempt to refresh the signed URL on error
      if (!isRefreshing) {
        console.log('Attempting to refresh URL due to video error')
        refreshSignedUrl()
      }
    }

    videoElement.addEventListener('error', handleVideoError)
    return () => videoElement.removeEventListener('error', handleVideoError)
  }, [refreshSignedUrl, isRefreshing])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading movie...</p>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Movie Not Found</h1>
          <p className="text-gray-600 mb-6">The movie you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/dashboard/movies')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Movies
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard/movies')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
              <div className="flex items-center space-x-2">
                <p className="text-gray-600">Movie Preview</p>
                {isRefreshing && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Refreshing...
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div 
              ref={containerRef}
              className="relative bg-black rounded-xl overflow-hidden aspect-video"
              onMouseMove={showControlsTemporarily}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              <video
                ref={videoRef}
                src={streamUrl}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={handlePlayPause}
                preload="metadata"
              />
              
              {/* URL Refresh Indicator */}
              {isRefreshing && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                    <span>Refreshing...</span>
                  </div>
                </div>
              )}
              
              {/* Video Controls Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Play/Pause Button (Center) */}
                {!isPlaying && !isRefreshing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handlePlayPause}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-all"
                    >
                      <Play className="w-12 h-12 text-white ml-1" fill="white" />
                    </button>
                  </div>
                )}
                
                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      disabled={isRefreshing}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        disabled={isRefreshing}
                        className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleMute}
                          disabled={isRefreshing}
                          className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          disabled={isRefreshing}
                          className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleFullscreen}
                      disabled={isRefreshing}
                      className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Movie Details Sidebar */}
          <div className="space-y-6">
            {/* Movie Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  video.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {video.status}
                </span>
                <button className="text-red-500 hover:text-red-700 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3">{video.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{video.description}</p>
              
              {/* Movie Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{video.year}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{Math.floor(video.duration / 60)}m</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{video.rating}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">0 views</span>
                </div>
              </div>

              {/* Quality Badge */}
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {video.quality}
                </span>
              </div>

              {/* Genres/Tags */}
              {video.genres && video.genres.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Genres</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {video.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handlePlayPause}
                  disabled={isRefreshing}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4" />
                  <span>{isRefreshing ? 'Loading...' : 'Watch Now'}</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>Add to Favorites</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share Movie</span>
                </button>
              </div>
            </div>

            {/* Movie Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Movie Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Release Year:</span>
                  <span className="font-medium">{video.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{Math.floor(video.duration / 60)} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality:</span>
                  <span className="font-medium">{video.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium">{video.rating}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{video.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #3b82f6;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #3b82f6;
        }
      `}</style>
    </div>
  )
}

export default MoviePreviewPage