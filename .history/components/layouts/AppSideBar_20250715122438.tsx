'use client'
import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Video, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  PlayCircle,
  UserCheck,
  Tags,
  FileText,
  TrendingUp,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Video, label: 'Movies', href: '/movies' },
    { icon: FolderOpen, label: 'Categories', href: '/categories' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: PlayCircle, label: 'Playlists', href: '/playlists' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: UserCheck, label: 'Subscriptions', href: '/subscriptions' },
    { icon: Tags, label: 'Tags', href: '/tags' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: TrendingUp, label: 'Trending', href: '/trending' },
    { icon: Shield, label: 'Moderation', href: '/moderation' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        flex flex-col
      `}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">StreamAdmin</h2>
                  <p className="text-xs text-gray-500">Movie Platform</p>
                </div>
              )}
            </div>
            
            {/* Collapse Button - Desktop Only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg
                    text-gray-700 hover:bg-gray-100 hover:text-gray-900
                    transition-colors duration-200 group
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`
        flex-1 lg:ml-0 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        min-h-screen bg-gray-50
      `}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Welcome back, John!</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings size={20} className="text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Cards */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Movies</p>
                  <p className="text-2xl font-bold text-gray-800">2,847</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-gray-600 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-800">45,231</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-gray-600 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">$87,420</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-red-600 font-medium">-3%</span>
                <span className="text-gray-600 ml-1">from last month</span>
              </div>
            </div>
          </div>

          {/* Sample Content */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">New user registered: user{item}@example.com</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Sidebar;