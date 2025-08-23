import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  UserCheck, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Award,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  CheckCircle,
  XCircle,
  Package,
  User,
  Shield
} from 'lucide-react';
import axios from 'axios';

const Overview = () => {
  // const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    users: [],
    resources: [],
    userCounts: {
      total: 0,
      admins: 0,
      teachers: 0
    },
    resourceStats: {
      total: 0,
      lowStock: 0,
      outOfStock: 0
    }
  });

  // Fetch data using actual APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // setLoading(true);
        
        // Actual API calls
        const [usersRes, resourcesRes] = await Promise.all([
          axios.get('https://alkhatem-school.onrender.com/api/users'),
          axios.get('https://alkhatem-school.onrender.com/api/getAllResources')
        ]);
        
        const users = usersRes.data.users;
        const resources = resourcesRes.data;

        const userCounts = {
          total: users.length,
          admins: users.filter(u => u.role === 'admin').length,
          teachers: users.filter(u => u.role === 'teacher').length,
          active: users.filter(u => u.isDeleted === 'false').length
        };

        const resourceStats = {
          total: resources.length,
          lowStock: resources.filter(r => r.quantity > 0 && r.quantity <= (r.minQuantity || 10)).length,
          outOfStock: resources.filter(r => r.quantity === 0).length,
          wellStocked: resources.filter(r => r.quantity > (r.minQuantity || 10)).length
        };

        setDashboardData({
          users,
          resources,
          userCounts,
          resourceStats
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
       
      } finally {
        // setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

 

  return (
    <div className="min-h-screen  p-2">
    {/* <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6"> */}
      <div className="max-w-7xl mx-auto space-y-8">
        
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.userCounts.total}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  {dashboardData.userCounts.total} active
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Admins */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.userCounts.admins}</p>
                <p className="text-sm text-purple-600 mt-1">
                  <Shield className="w-4 h-4 inline mr-1" />
                  System access
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Teachers */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.userCounts.teachers}</p>
                <p className="text-sm text-indigo-600 mt-1">
                  <GraduationCap className="w-4 h-4 inline mr-1" />
                  Faculty members
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Resource Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resource Overview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Resource Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Resources</span>
                <span className="text-xl font-bold text-blue-600">{dashboardData.resourceStats.total}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Well Stocked</span>
                <span className="text-xl font-bold text-green-600">{dashboardData.resourceStats.wellStocked}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Low Stock</span>
                <span className="text-xl font-bold text-yellow-600">{dashboardData.resourceStats.lowStock}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Out of Stock</span>
                <span className="text-xl font-bold text-red-600">{dashboardData.resourceStats.outOfStock}</span>
              </div>
            </div>
          </div>

          {/* Critical Resources */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              Critical Resources
            </h3>
            <div className="space-y-3">
              {dashboardData.resources
                .filter(resource => resource.quantity === 0 || resource.quantity <= (resource.minQuantity || 10))
                .slice(0, 5)
                .map(resource => (
                <div key={resource.id} className="flex items-center justify-between p-3 rounded-lg border-l-4 border-red-400 bg-red-50">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{resource.name}</p>
                    <p className="text-xs text-gray-600">{resource.category || 'General'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${
                      resource.quantity === 0 ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {resource.quantity === 0 ? 'OUT' : resource.quantity}
                    </span>
                    <p className="text-xs text-gray-500">Min: {resource.minQuantity || 10}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-medium">
                Add New User
              </button>
              <button className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 font-medium">
                Manage Resources
              </button>
              <button className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-medium">
                View Reports
              </button>
              <button className="w-full p-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 font-medium">
                System Settings
              </button>
            </div>
          </div>
        </div>

      

      </div>
    </div>
  );
};

export default Overview;