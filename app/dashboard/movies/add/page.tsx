'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, Plus, Star, Calendar, Clock, Tag, Eye, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useVideoUploadWithProgress } from '@/hooks/useVideo'
import { toast } from 'sonner' // or your preferred toast library
import { useVideoCategories } from '@/hooks/useVideoCategory'
import { Category } from '@/types/categories'

export default function AddMoviePageWithUpload() {
  const [movieData, setMovieData] = useState({
    title: '',
    year: '',
    genre: '',
    duration: '',
    description: '',
    rating: '',
    quality: '4K',
    status: 'draft',
    thumbnail: null,
    movieFile: null,
    tags: []
  })

  const [newTag, setNewTag] = useState('')
  const [dragOver, setDragOver] = useState(false)
    const {data:categoriesData, isLoading:loadingVideoCategories, error:loadingVideoCategoriesError} = useVideoCategories();
    const [categories, setCategories] = useState<Category[]>([]);


      useEffect(()=>{
        if(categoriesData && (categoriesData as any)?.data?.videoCategories) {
          setCategories((categoriesData as any)?.data?.videoCategories.map((cat: any, index: number) => ({
            id: cat._id || index + 1, 
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            image: cat.category_image || '/api/placeholder/300/200',
            movieCount: cat.movieCount || 0,
            status: cat.isActive ? 'active' : 'inactive',
            createdAt: new Date(cat.createdAt).toLocaleDateString(),
            color: cat.category_color || '#3b82f6'
          })));
        }
      },[categoriesData])


  // Use the upload hook
  const {
    uploadVideo,
    uploadProgress,
    isUploading,
    isError,
    error,
    isSuccess,
    data,
    reset
  } = useVideoUploadWithProgress()
  


  if (loadingVideoCategories) {
    return <div className="text-center p-4">Loading categories...</div> 
    }

    if (loadingVideoCategoriesError) {
    return <div className="text-center p-4 text-red-500">Error loading categories: {loadingVideoCategoriesError.message}</div>
    }
  const handleInputChange = (field, value) => {
    setMovieData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !movieData.tags.includes(newTag.trim())) {
      setMovieData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setMovieData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleDrop = (e, type = 'thumbnail') => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files[0]) {
      setMovieData(prev => ({ ...prev, [type]: files[0] }))
    }
  }

  const handleFileSelect = (e, type = 'thumbnail') => {
    const file = e.target.files[0]
    if (file) {
      setMovieData(prev => ({ ...prev, [type]: file }))
    }
  }

  const validateForm = () => {
    const required = ['title', 'year', 'genre', 'duration', 'description']
    const missing = required.filter(field => !movieData[field])
    
    if (missing.length > 0) {
      toast.error(`Please fill in required fields: ${missing.join(', ')}`)
      return false
    }

    if (!movieData.movieFile) {
      toast.error('Please upload a movie file')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      // Prepare data for upload
      const uploadData = {
        ...movieData,
        videoFile: movieData.movieFile, // Map movieFile to videoFile for backend
      }

      const result = await uploadVideo(uploadData)
      
      if (result.success) {
        toast.success('Movie uploaded successfully!')
        // Optionally redirect or reset form
        // router.push('/movies')
      } else {
        toast.error(result.message || 'Upload failed')
      }
    } catch (error) {
      toast.error('Upload failed: ' + error.message)
    }
  }

  const handleReset = () => {
    setMovieData({
      title: '',
      year: '',
      genre: '',
      duration: '',
      description: '',
      rating: '',
      quality: '4K',
      status: 'draft',
      thumbnail: null,
      movieFile: null,
      tags: []
    })
    reset()
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Movie</h2>
          <p className="text-muted-foreground">
            Add a new movie to your library and content
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Movie
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading movie...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success/Error Messages */}
      {isSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Movie uploaded successfully! {data?.message}
          </AlertDescription>
        </Alert>
      )}

      {isError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Upload failed: {error?.message || 'Unknown error occurred'}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details of the movie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Movie Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter movie title"
                      value={movieData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      disabled={isUploading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Release Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2024"
                      value={movieData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      disabled={isUploading}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre *</Label>
                    <Select 
                      value={movieData.genre} 
                      onValueChange={(value) => handleInputChange('genre', value)}
                      disabled={isUploading}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}                        
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 2h 32m"
                      value={movieData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      disabled={isUploading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter movie description"
                    className="min-h-[100px]"
                    value={movieData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={isUploading}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Movie File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Movie File *</CardTitle>
                <CardDescription>
                  Upload the movie file (MP4, MKV, AVI, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors relative ${
                    dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    if (!isUploading) setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => handleDrop(e, 'movieFile')}
                >
                  {movieData.movieFile ? (
                    <div className="space-y-2">
                      <div className="mx-auto h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">{movieData.movieFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(movieData.movieFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMovieData(prev => ({ ...prev, movieFile: null }))}
                        disabled={isUploading}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Drop your movie file here</p>
                        <p className="text-xs text-muted-foreground">or click to browse</p>
                        <p className="text-xs text-muted-foreground mt-1">Supports MP4, MKV, AVI, MOV</p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileSelect(e, 'movieFile')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add relevant tags to help categorize the movie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    disabled={isUploading}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm" disabled={isUploading}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {movieData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                      {!isUploading && (
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Movie Poster */}
            <Card>
              <CardHeader>
                <CardTitle>Movie Poster</CardTitle>
                <CardDescription>
                  Upload a poster image for the movie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors relative ${
                    dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    if (!isUploading) setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => handleDrop(e, 'thumbnail')}
                >
                  {movieData.thumbnail ? (
                    <div className="space-y-2">
                      <img
                        src={URL.createObjectURL(movieData.thumbnail)}
                        alt="Movie poster"
                        className="mx-auto h-40 w-28 object-cover rounded"
                      />
                      <p className="text-sm text-muted-foreground">{movieData.thumbnail.name}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMovieData(prev => ({ ...prev, thumbnail: null }))}
                        disabled={isUploading}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Drop your poster here</p>
                        <p className="text-xs text-muted-foreground">or click to browse</p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'thumbnail')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Movie Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Movie Settings</CardTitle>
                <CardDescription>
                  Configure movie properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Select 
                    value={movieData.quality} 
                    onValueChange={(value) => handleInputChange('quality', value)}
                    disabled={isUploading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4K">4K</SelectItem>
                      <SelectItem value="HD">HD</SelectItem>
                      <SelectItem value="SD">SD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="8.5"
                    value={movieData.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                    disabled={isUploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={movieData.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                    disabled={isUploading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Published
                        </div>
                      </SelectItem>
                      <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Draft
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview Stats</CardTitle>
                <CardDescription>
                  How this movie will appear
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Rating</span>
                  </div>
                  <span className="font-medium">{movieData.rating || '0.0'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Year</span>
                  </div>
                  <span className="font-medium">{movieData.year || '-'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <span className="font-medium">{movieData.duration || '-'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Status</span>
                  </div>
                  <Badge variant={movieData.status === 'published' ? 'default' : 'secondary'}>
                    {movieData.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}