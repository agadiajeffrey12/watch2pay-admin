import { Settings, TrendingUp, Users, Video } from 'lucide-react'
import React from 'react'

const Dashboard = () => {
  return (
     <div className={`
        flex-1 lg:ml-0 transition-all duration-300 ease-in-out
       
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
  )
}

export default Dashboard