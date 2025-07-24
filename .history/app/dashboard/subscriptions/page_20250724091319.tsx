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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Check,
  X,
  Settings,
  Users,
  CreditCard,
  Zap,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const SubscriptionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('plans');
  const [filterOpen, setFilterOpen] = useState(false);

  // Subscription plans data
  const subscriptionPlans = [
    {
      id: 1,
      name: 'Basic',
      price: '$9.99',
      interval: 'month',
      features: ['HD Streaming', '1 Device', 'Basic Support', 'Limited Content'],
      subscribers: 312,
      revenue: '$3,118.88',
      status: 'active',
      color: 'from-gray-500 to-gray-600',
      icon: User
    },
    {
      id: 2,
      name: 'Standard',
      price: '$19.99',
      interval: 'month',
      features: ['Full HD Streaming', '2 Devices', 'Priority Support', 'Full Content Library', 'Offline Downloads'],
      subscribers: 524,
      revenue: '$10,479.76',
      status: 'active',
      color: 'from-blue-500 to-blue-600',
      icon: Shield
    },
    {
      id: 3,
      name: 'Premium',
      price: '$29.99',
      interval: 'month',
      features: ['4K Ultra HD', '4 Devices', '24/7 Support', 'Exclusive Content', 'Early Access', 'Family Sharing'],
      subscribers: 411,
      revenue: '$12,329.89',
      status: 'active',
      color: 'from-purple-500 to-purple-600',
      icon: Crown
    },
    {
      id: 4,
      name: 'Enterprise',
      price: '$99.99',
      interval: 'month',
      features: ['Unlimited Devices', 'Admin Dashboard', 'Custom Branding', 'API Access', 'Dedicated Support'],
      subscribers: 47,
      revenue: '$4,679.53',
      status: 'inactive',
      color: 'from-orange-500 to-orange-600',
      icon: Zap
    }
  ];

  // Recent subscriptions data
  const recentSubscriptions = [
    {
      id: 1,
      user: 'John Doe',
      email: 'john.doe@example.com',
      plan: 'Premium',
      status: 'active',
      startDate: '2024-07-01',
      nextBilling: '2024-08-01',
      amount: '$29.99',
      avatar: 'JD'
    },
    {
      id: 2,
      user: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      plan: 'Standard',
      status: 'active',
      startDate: '2024-06-15',
      nextBilling: '2024-07-15',
      amount: '$19.99',
      avatar: 'SJ'
    },
    {
      id: 3,
      user: 'Mike Chen',
      email: 'mike.chen@example.com',
      plan: 'Basic',
      status: 'cancelled',
      startDate: '2024-05-10',
      nextBilling: null,
      amount: '$9.99',
      avatar: 'MC'
    },
    {
      id: 4,
      user: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      plan: 'Premium',
      status: 'paused',
      startDate: '2024-04-20',
      nextBilling: '2024-08-20',
      amount: '$29.99',
      avatar: 'ER'
    },
    {
      id: 5,
      user: 'David Kim',
      email: 'david.kim@example.com',
      plan: 'Standard',
      status: 'active',
      startDate: '2024-07-10',
      nextBilling: '2024-08-10',
      amount: '$19.99',
      avatar: 'DK'
    }
  ];

  const getStatusColor = (status:string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan:string) => {
    switch (plan) {
      case 'Basic':
        return 'bg-gray-100 text-gray-800';
      case 'Standard':
        return 'bg-blue-100 text-blue-800';
      case 'Premium':
        return 'bg-purple-100 text-purple-800';
      case 'Enterprise':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: '$30,607.06',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Subscriptions',
      value: '1,294',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Monthly Recurring Revenue',
      value: '$25,608.62',
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Churn Rate',
      value: '2.4%',
      change: '-0.8%',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-red-600'
    }
  ];

  const filteredSubscriptions = recentSubscriptions.filter(sub =>
    sub.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPlansTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {subscriptionPlans.map((plan) => (
        <div key={plan.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-gradient-to-br ${plan.color}`}>
              <plan.icon className="w-6 h-6 text-white" />
            </div>
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-600">/{plan.interval}</span>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(plan.status)}`}>
              {plan.status}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subscribers</span>
              <span className="text-sm font-medium">{plan.subscribers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenue</span>
              <span className="text-sm font-medium">{plan.revenue}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-4 h-4" />
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

  const renderSubscribersTab = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Subscriptions</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search subscribers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubscriptions.map((subscription) => (
              <tr key={subscription.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {subscription.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{subscription.user}</div>
                      <div className="text-sm text-gray-600">{subscription.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(subscription.plan)}`}>
                    {subscription.plan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscription.status)}`}>
                    {subscription.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subscription.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subscription.startDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subscription.nextBilling || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    {subscription.status === 'active' && (
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-yellow-600">
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    {subscription.status === 'paused' && (
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-green-600">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {subscription.status === 'cancelled' && (
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
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
            <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
            <p className="text-gray-600">Manage subscription plans and monitor revenue</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <CreditCard className="w-4 h-4" />
              Billing
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Plan
            </button>
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
                <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6">
          <button
            onClick={() => setActiveTab('plans')}
            className={`pb-2 border-b-2 font-medium transition-colors ${
              activeTab === 'plans'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Subscription Plans
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`pb-2 border-b-2 font-medium transition-colors ${
              activeTab === 'subscribers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Subscribers
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'plans' ? renderPlansTab() : renderSubscribersTab()}
    </div>
  );
};

export default SubscriptionsPage;