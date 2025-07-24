'use client'
import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus, 
  Upload, 
  Download, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  Clock,
  Play,
  Pause,
  Users,
  TrendingUp,
  Heart,
  Share2,
  Award,
  Globe,
  ChevronDown,
  Film,
  Video,
  Tv,
  Monitor
} from 'lucide-react';
import Link from 'next/link';
import { useVideos } from '@/hooks/useVideo';
import { videoApiResponse } from '@/types/video';

const MoviesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const {data, error, isLoading} = useVideos();
  const [movies, setMovies] = useState<videoApiResponse[]>([]);
  
  useEffect(()=>{
    if (data && data.data && Array.isArray(data.data.videos)) {
      setMovies((data as any).data.videos);
    } else {
      console.error('Invalid movies data format:', data);
      setMovies([]);
    }
  },[data])
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading movies: {error.message}</div>;
  console.log('Movies data:', data);


  // Sample movies data
 
  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
  const statuses = ['All', 'Published', 'Draft', 'Processing'];

  const getStatusColor = (status:string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality:string) => {
    switch (quality) {
      case '4K':
        return 'bg-purple-100 text-purple-800';
      case 'HD':
        return 'bg-blue-100 text-blue-800';
      case 'SD':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesGenre = selectedGenre === 'all' || movie.genres[0].toLowerCase() === selectedGenre.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || movie.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const stats = [
    {
      title: 'Total Movies',
      value: movies.length.toString(),
      change: '+12',
      icon: Film,
      color: 'text-blue-600'
    },
    {
      title: 'Published',
      value: `${movies.filter(movie => movie.status === 'published').length}`,
      change: '+8',
      icon: Video,
      color: 'text-green-600'
    },
    {
      title: 'Total Views',
      value: '12.5M',
      change: '+1.2M',
      icon: Eye,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Rating',
      value: '8.2',
      change: '+0.3',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  const formatViews = (views:number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatLikes = (likes:number) => {
    if (likes >= 1000000) {
      return `${(likes / 1000000).toFixed(1)}M`;
    } else if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}K`;
    }
    return likes.toString();
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredMovies.map((movie) => (
        <Link href={`/dashboard/movies/${movie._id}`} key={movie._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative">
            <img 
              src={movie.thumbnailSignedUrl} 
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(movie.status)}`}>
                {movie.status}
              </span>
              {movie.isTrending && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  Trending
                </span>
              )}
            </div>
            <div className="absolute top-3 right-3">
              {/* <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQualityColor(movie.)}`}>
                {movie.quality}
              </span> */}
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
              <div className="flex items-center gap-1 bg-black bg-opacity-50 px-2 py-1 rounded">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                {/* <span className="text-xs">{movie.}</span> */}
              </div>
              <div className="flex items-center gap-1 bg-black bg-opacity-50 px-2 py-1 rounded">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{movie.duration}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{movie.title}</h3>
              <div className="relative">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">{(movie as any)?.year || "2004"}</span>
              <span className="text-gray-400">•</span>
              {/* <span className="text-sm text-gray-600">{movie.genres}</span> */}
              {
                movie.genres.map((genre, index) => (
                  <span key={index} className="text-sm text-gray-600">{genre}</span>
                ))
              }
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{movie.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatViews(movie.viewCount)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{formatLikes(movie.viewCount)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMovies.map((movie) => (
              <tr key={movie._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img 
                      src={movie.thumbnailSignedUrl}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {movie.title}
                        {movie.isTrending && <TrendingUp className="w-4 h-4 text-red-500" />}
                      </div>
                      {/* <div className="text-sm text-gray-600">{movie.director}</div> */}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movie.genres[0]}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movie.year}</td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    {/* <span className="text-sm font-medium">{movie.rating}</span> */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(movie.status)}`}>
                    {movie.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatViews(movie.viewCount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQualityColor(movie.quality)}`}>
                    {movie.quality}
                  </span> */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Movies</h1>
            <p className="text-gray-600">Manage your movie library and content</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>
            <Link href={'/dashboard/movies/add'} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Movie
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  <p className="text-xs text-gray-600">this month</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search movies..."
                className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genres.map(genre => (
                  <option key={genre} value={genre.toLowerCase()}>{genre}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status.toLowerCase()}>{status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Content */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}
      
      {/* Results info */}
      <div className="mt-6 text-center text-gray-600">
        Showing {filteredMovies.length} of {movies.length} movies
      </div>
    </div>
  );
};

export default MoviesPage;