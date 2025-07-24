// app/dashboard/movies/[id]/page.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
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
  const { data: videoData, isLoading, error } = useVideoWithSignedUrl(videoId)
  
  const { getStreamUrl } = useVideoStream()
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout |  null>(null)

  const video = videoData?.data?.video
  const streamUrl = videoId ? video?.streamUrl : ''

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
              <p className="text-gray-600">Movie Preview</p>
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
              />
              
              {/* Video Controls Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Play/Pause Button (Center) */}
                {!isPlaying && (
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
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleMute}
                          className="text-white hover:text-gray-300 transition-colors"
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
                          className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleFullscreen}
                      className="text-white hover:text-gray-300 transition-colors"
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
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Watch Now</span>
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