'use client'
import React, { useState } from 'react';
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

const MoviesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample movies data
  const movies = [
    {
      id: 1,
      title: 'The Dark Knight',
      genre: 'Action',
      year: 2008,
      rating: 9.0,
      duration: '2h 32m',
      status: 'published',
      views: 1250000,
      likes: 98500,
      poster: '/api/placeholder/300/450',
      director: 'Christopher Nolan',
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      description: 'When the menace known as the Joker wreaks havoc on Gotham City...',
      quality: '4K',
      languages: ['English', 'Spanish', 'French'],
      uploadDate: '2024-01-15',
      trending: true
    },
    {
      id: 2,
      title: 'Inception',
      genre: 'Sci-Fi',
      year: 2010,
      rating: 8.8,
      duration: '2h 28m',
      status: 'published',
      views: 980000,
      likes: 85200,
      poster: '/api/placeholder/300/450',
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
      description: 'A thief who steals corporate secrets through dream-sharing technology...',
      quality: '4K',
      languages: ['English', 'Japanese'],
      uploadDate: '2024-02-10',
      trending: false
    },
    {
      id: 3,
      title: 'The Shawshank Redemption',
      genre: 'Drama',
      year: 1994,
      rating: 9.3,
      duration: '2h 22m',
      status: 'published',
      views: 1500000,
      likes: 125000,
      poster: '/api/placeholder/300/450',
      director: 'Frank Darabont',
      cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
      description: 'Two imprisoned men bond over years, finding solace and redemption...',
      quality: 'HD',
      languages: ['English'],
      uploadDate: '2024-01-20',
      trending: true
    },
    {
      id: 4,
      title: 'Avatar: The Way of Water',
      genre: 'Adventure',
      year: 2022,
      rating: 7.6,
      duration: '3h 12m',
      status: 'draft',
      views: 0,
      likes: 0,
      poster: '/api/placeholder/300/450',
      director: 'James Cameron',
      cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
      description: 'Jake Sully and Neytiri have formed a family and are doing everything...',
      quality: '4K',
      languages: ['English', 'Na\'vi'],
      uploadDate: '2024-03-05',
      trending: false
    },
    {
      id: 5,
      title: 'Parasite',
      genre: 'Thriller',
      year: 2019,
      rating: 8.6,
      duration: '2h 12m',
      status: 'published',
      views: 750000,
      likes: 67800,
      poster: '/api/placeholder/300/450',
      director: 'Bong Joon-ho',
      cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
      description: 'A poor family schemes to become employed by a wealthy family...',
      quality: 'HD',
      languages: ['Korean', 'English'],
      uploadDate: '2024-02-28',
      trending: false
    },
    {
      id: 6,
      title: 'Spider-Man: No Way Home',
      genre: 'Action',
      year: 2021,
      rating: 8.2,
      duration: '2h 28m',
      status: 'published',
      views: 2100000,
      likes: 189000,
      poster: '/api/placeholder/300/450',
      director: 'Jon Watts',
      cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'],
      description: 'With Spider-Man\'s identity revealed, Peter asks Doctor Strange for help...',
      quality: '4K',
      languages: ['English', 'Spanish'],
      uploadDate: '2024-01-08',
      trending: true
    },
    {
      id: 7,
      title: 'Dune',
      genre: 'Sci-Fi',
      year: 2021,
      rating: 8.0,
      duration: '2h 35m',
      status: 'processing',
      views: 0,
      likes: 0,
      poster: '/api/placeholder/300/450',
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac'],
      description: 'A noble family becomes embroiled in a war for control over the galaxy...',
      quality: '4K',
      languages: ['English'],
      uploadDate: '2024-03-10',
      trending: false
    },
    {
      id: 8,
      title: 'Top Gun: Maverick',
      genre: 'Action',
      year: 2022,
      rating: 8.3,
      duration: '2h 11m',
      status: 'published',
      views: 1800000,
      likes: 156000,
      poster: '/api/placeholder/300/450',
      director: 'Joseph Kosinski',
      cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly'],
      description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator...',
      quality: '4K',
      languages: ['English'],
      uploadDate: '2024-01-25',
      trending: true
    }
  ];

  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
  const statuses = ['All', 'Published', 'Draft', 'Processing'];

  const getStatusColor = (status) => {
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

  const getQualityColor = (quality) => {
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
                         movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.cast.some(actor => actor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGenre = selectedGenre === 'all' || movie.genre.toLowerCase() === selectedGenre.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || movie.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const stats = [
    {
      title: 'Total Movies',
      value: '1,247',
      change: '+12',
      icon: Film,
      color: 'text-blue-600'
    },
    {
      title: 'Published',
      value: '1,089',
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

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatLikes = (likes) => {
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
        <div key={movie.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative">
            <img 
              src={movie.poster} 
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(movie.status)}`}>
                {movie.status}
              </span>
              {movie.trending && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  Trending
                </span>
              )}
            </div>
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQualityColor(movie.quality)}`}>
                {movie.quality}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
              <div className="flex items-center gap-1 bg-black bg-opacity-50 px-2 py-1 rounded">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs">{movie.rating}</span>
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
              <span className="text-sm text-gray-600">{movie.year}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{movie.genre}</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{movie.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatViews(movie.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{formatLikes(movie.likes)}</span>
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
        </div>
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
              <tr key={movie.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {movie.title}
                        {movie.trending && <TrendingUp className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="text-sm text-gray-600">{movie.director}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movie.genre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movie.year}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{movie.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(movie.status)}`}>
                    {movie.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatViews(movie.views)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQualityColor(movie.quality)}`}>
                    {movie.quality}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {movie.uploadDate}
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