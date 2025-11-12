

import { useEffect, useState } from 'react';
import { Edit3, Trash2, X, Save, UserPlus, Users, Shield, BookOpen, Mail, User, RotateCcw, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
// import CreateUserModal from "./CreateUser";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: '', password: '', role: '', subject_taught: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      password: '',
      role: user.role,
      subject_taught: user.subject_taught || '',
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setForm({ name: '', password: '', role: '', subject_taught: '' });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${editingUser.id}`, form);
      await fetchUsers(); // Refresh the users list
      cancelEdit();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteToggle = async (userId, isDeleted) => {
    try {
      setLoading(true);
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/delete`, { isDeleted });
      await fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error deleting/restoring user:', error);
      setError('Failed to delete/restore user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesDeletedFilter = showDeleted ? user.isDeleted : !user.isDeleted;
    return matchesSearch && matchesRole && matchesDeletedFilter;
  });

  const getRoleIcon = (role) => {
    return role === 'admin' ? <Shield className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />;
  };

  const getRoleBadgeClass = (role) => {
    return role === 'admin' 
      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200' 
      : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200';
  };

  // const activeUsersCount = users.filter(u => !u.isDeleted).length;
  const deletedUsersCount = users.filter(u => u.isDeleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Users Management
                </h1>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Loading...' : error ? 'Error loading users' : 
                   showDeleted ? `${deletedUsersCount} deleted users` : `${activeUsersCount} active users`}
                </p>
              </div>
            </div>
            <div>
           
             <button 
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mx-auto"
            disabled={loading}
            onClick={() => setIsModalOpen(true)}
          >
              <UserPlus className="w-5 h-5" />
              <span>Add User</span>
              
            </button>
          </div>
           {/* <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        /> */}
          {/* </div>
          
          {/* Error Message */}
          {/* {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
              <button 
                onClick={fetchUsers}
                className="mt-2 text-red-600 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div> */} 

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[150px]"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>

            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 ${
                showDeleted
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showDeleted ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <span>{showDeleted ? 'Hide Deleted' : 'Show Deleted'}</span>
              {showDeleted && deletedUsersCount > 0 && (
                <span className="bg-white/20 text-white px-2 py-1 rounded-full text-sm">
                  {deletedUsersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Users...</h3>
              <p className="text-gray-600">Please wait while we fetch the user data</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Users</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchUsers}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-blue-50/50 transition-all duration-200 ${
                        user.isDeleted ? 'bg-red-50/30' : 'bg-white/50'
                      }`}
                    >
                      {/* User Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold ${
                            user.isDeleted 
                              ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                              : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className={`font-semibold ${user.isDeleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Mail className={`w-4 h-4 ${user.isDeleted ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm ${user.isDeleted ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                            {user.email}
                          </span>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${
                          user.isDeleted 
                            ? 'bg-gray-100 text-gray-500 border-gray-200' 
                            : getRoleBadgeClass(user.role)
                        }`}>
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </span>
                      </td>

                      {/* Subject Column */}
                      <td className="px-6 py-4">
                        {user.subject_taught ? (
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                            user.isDeleted 
                              ? 'bg-gray-100 text-gray-500' 
                              : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800'
                          }`}>
                            <BookOpen className="w-4 h-4" />
                            <span className="text-sm font-medium">{user.subject_taught}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.isDeleted
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {user.isDeleted ? 'Deleted' : 'Active'}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {!user.isDeleted ? (
                            <>
                              <button
                                onClick={() => startEdit(user)}
                                disabled={loading}
                                className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                                  loading 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                                }`}
                                title="Edit User"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteToggle(user.id, true)}
                                disabled={loading}
                                className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                                  loading 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white'
                                }`}
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleDeleteToggle(user.id, false)}
                              disabled={loading}
                              className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                                loading 
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                              }`}
                              title="Restore User"
                            >
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
          ) : (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {showDeleted ? 'No deleted users found' : 'No users found'}
              </h3>
              <p className="text-gray-600">
                {showDeleted 
                  ? 'There are no deleted users matching your criteria' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md transform transition-all duration-300 scale-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Edit User</h3>
                  <p className="text-gray-600 mt-1">{editingUser.email}</p>
                </div>
                <button
                  onClick={cancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="admin">Administrator</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Taught</label>
                  <input
                    type="text"
                    value={form.subject_taught}
                    onChange={(e) => setForm({ ...form, subject_taught: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter subject (if teacher)"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                    loading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={loading}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    loading 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}