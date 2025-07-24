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
  Crown,
  Shield,
  User,
  Calendar,
  Mail,
  MapPin
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [page,setPage] = useState(1)
  const [limit,setLimit]=useState(10)
  const {data,isLoading,error} = useUsers(page,limit)
  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error loading users: {error.message}</div>;
  }

  console.log(data)
  const userData = data?.data || {
    totalUsers:0,
    users: []

  };
  // Sample user data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Administrator',
      status: 'active',
      avatar: 'JD',
      joinDate: '2023-01-15',
      location: 'New York, USA',
      lastActive: '2 hours ago',
      moviesWatched: 156,
      subscriptionType: 'Premium'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'Moderator',
      status: 'active',
      avatar: 'SJ',
      joinDate: '2023-02-20',
      location: 'Los Angeles, USA',
      lastActive: '1 day ago',
      moviesWatched: 89,
      subscriptionType: 'Standard'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      role: 'User',
      status: 'inactive',
      avatar: 'MC',
      joinDate: '2023-03-10',
      location: 'Toronto, Canada',
      lastActive: '1 week ago',
      moviesWatched: 45,
      subscriptionType: 'Basic'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      role: 'User',
      status: 'active',
      avatar: 'ER',
      joinDate: '2023-04-05',
      location: 'Madrid, Spain',
      lastActive: '5 minutes ago',
      moviesWatched: 201,
      subscriptionType: 'Premium'
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@example.com',
      role: 'User',
      status: 'pending',
      avatar: 'DK',
      joinDate: '2023-05-12',
      location: 'Seoul, South Korea',
      lastActive: '3 days ago',
      moviesWatched: 12,
      subscriptionType: 'Basic'
    },
    {
      id: 6,
      name: 'Anna Kowalski',
      email: 'anna.kowalski@example.com',
      role: 'User',
      status: 'active',
      avatar: 'AK',
      joinDate: '2023-06-18',
      location: 'Warsaw, Poland',
      lastActive: '30 minutes ago',
      moviesWatched: 78,
      subscriptionType: 'Standard'
    }
  ];

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Administrator':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'Moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionColor = (type) => {
    switch (type) {
      case 'Premium':
        return 'bg-purple-100 text-purple-800';
      case 'Standard':
        return 'bg-blue-100 text-blue-800';
      case 'Basic':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: 'Total Users',
      value: userData.totalUsers ||  '1,247' ,
      icon: User,
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: '1,089',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'Premium Users',
      value: '524',
      icon: Crown,
      color: 'text-purple-600'
    },
    {
      title: 'New This Month',
      value: '89',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">Manage your platform users and permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filter
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

      {/* Users Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span className="text-sm font-medium">{user.role}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Subscription</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSubscriptionColor(user.subscriptionType)}`}>
                    {user.subscriptionType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Movies Watched</span>
                  <span className="text-sm font-medium">{user.moviesWatched}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Joined {user.joinDate}
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last active: {user.lastActive}</span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className="text-sm font-medium">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSubscriptionColor(user.subscriptionType)}`}>
                        {user.subscriptionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.moviesWatched}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Edit className="w-4 h-4" />
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
      )}
    </div>
  );
};

export default UsersPage;