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
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Video, label: 'Movies', href: '/movies' },
    { icon: FolderOpen, label: 'Categories', href: '/dashboard/categories' },
    { icon: Users, label: 'Users', href: '/dashboard/users' },
    { icon: PlayCircle, label: 'Playlists', href: '/playlists' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: UserCheck, label: 'Subscriptions', href: '/dashboard/subscriptions' },
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
        fixed lg:relative top-0 left-0 h-screen bg-white border-r border-gray-200 
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
                <Link
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
                </Link>
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
    
    </>
  );
};

export default Sidebar;