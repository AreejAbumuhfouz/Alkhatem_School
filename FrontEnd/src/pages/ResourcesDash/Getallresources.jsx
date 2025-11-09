

import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Edit3, Trash2, RotateCcw, Save, X, ChevronLeft, ChevronRight, Eye, EyeOff, UploadCloud, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

axios.defaults.baseURL = 'https://alkhatem-school.onrender.com/api';

export default function ImprovedResourcesTable() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [togglingId, setTogglingId] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    school_level: '',
    subject: '',
    showDeleted: false
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter panel visibility
  const [showFilters, setShowFilters] = useState(false);

  const schoolLevelOptions = [
    { value: "C1", label: "Cycle 1" },
    { value: "C2", label: "Cycle 2" },
    { value: "C3", label: "Cycle 3" },
    { value: "KG", label: "KG" },
    { value: "ALL", label: "All" },
    { value: "Others", label: "Others" }
  ];

  const locationOptions = [
    "KG Storage", "Library Storage", "Opposite to EMT Office",
    "Opposite to 1201 (Next CCDI Class)", "SEN", "Social Studies Storage",
    "Reception Storage", "Admin Storage Room", "ART Storage Room", "LABs", "Others"
  ];

  const conditionOptions = [
    "good-new", "good-used", "damaged", "over-used"
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = () => {
    setLoading(true);
    axios
      .get('https://alkhatem-school.onrender.com/api/getAllResources')
      .then(res => setResources(res.data))
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  };

  // Filtered and paginated resources with safe handling
  const filteredResources = useMemo(() => {
    let filtered = resources.filter(resource => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (resource.name?.toLowerCase() || '').includes(searchLower) ||
        (resource.description?.toLowerCase() || '').includes(searchLower) ||
        (resource.subject?.toLowerCase() || '').includes(searchLower);
      
      const matchesLocation = !filters.location || resource.location === filters.location;
      const matchesLevel = !filters.school_level || resource.school_level === filters.school_level;
      const matchesSubject = !filters.subject || (resource.subject?.toLowerCase() || '').includes(filters.subject.toLowerCase());
      const matchesDeleted = filters.showDeleted || !resource.isDeleted;
      
      return matchesSearch && matchesLocation && matchesLevel && matchesSubject && matchesDeleted;
    });

    return filtered;
  }, [resources, searchTerm, filters]);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (res) => {
    setEditId(res.id);
    setEditedData({
      name: res.name,
      description: res.description,
      location: res.location,
      school_level: res.school_level,
      subject: res.subject,
      quantity: res.quantity,
      condition: res.condition,
    });
    setEditedImage(null);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditedData({});
    setEditedImage(null);
  };

  const handleSave = async (id) => {
    try {
      let base64Image = null;
      if (editedImage) {
        base64Image = await toBase64(editedImage);
      }

      const payload = {
        ...editedData,
        images: base64Image || null,
      };

      await axios.patch(`https://alkhatem-school.onrender.com/api/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setEditId(null);
      setEditedData({});
      setEditedImage(null);
      fetchResources();
    } catch (err) {
      console.error('Update error:', err.response || err);
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleToggleDelete = async (id) => {
    const resource = resources.find(r => r.id === id);
    const action = resource.isDeleted ? 'restore' : 'delete';
    if (!window.confirm(`Are you sure you want to ${action} this resource?`)) return;
    
    setTogglingId(id);
    try {
      await axios.patch(`https://alkhatem-school.onrender.com/api/${id}/toggle`);
      fetchResources();
    } catch (err) {
      console.error('Toggle delete error:', err.response || err);
      const msg = err.response?.data?.message || err.message;
      alert(`Failed to ${action} resource: ` + msg);
    } finally {
      setTogglingId(null);
    }
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      school_level: '',
      subject: '',
      showDeleted: false
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const activeFiltersCount = [
    searchTerm !== '',
    filters.location !== '',
    filters.school_level !== '',
    filters.subject !== '',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto px-2 py-2">
        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search resources by name, description, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 relative"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Show Deleted Toggle */}
            <button
              onClick={() => setFilters({...filters, showDeleted: !filters.showDeleted})}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                filters.showDeleted 
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
              }`}
            >
              {filters.showDeleted ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              <span>{filters.showDeleted ? 'Hide Deleted' : 'Show Deleted'}</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Locations</option>
                  {locationOptions.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">School Level</label>
                <select
                  value={filters.school_level}
                  onChange={(e) => setFilters({...filters, school_level: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Levels</option>
                  {schoolLevelOptions.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Filter by subject..."
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-semibold">Active Filters:</span>
                {searchTerm && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Search: "{searchTerm}"</span>}
                {filters.location && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Location: {filters.location}</span>}
                {filters.school_level && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Level: {filters.school_level}</span>}
                {filters.subject && <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">Subject: {filters.subject}</span>}
              </div>
              <button
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-700 font-semibold underline"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-800">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredResources.length)}</span> of <span className="font-bold text-gray-800">{filteredResources.length}</span> resources
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">Items per page:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading resources...</p>
            </div>
          ) : paginatedResources.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <p className="text-gray-800 text-xl font-semibold mb-2">No resources found</p>
                <p className="text-gray-600 text-sm mb-4">Try adjusting your search or filters</p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Image</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Level</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Condition</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {paginatedResources.map((res, idx) => {
                      const isEditing = editId === res.id;
                      const isToggling = togglingId === res.id;
                      const dateAdded = res.createdAt ? new Date(res.createdAt).toLocaleDateString() : '';
                      const globalIndex = startIndex + idx + 1;
                      
                      return (
                        <tr 
                          key={res.id} 
                          className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 ${
                            res.isDeleted ? 'bg-red-50 opacity-75' : ''
                          }`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                            {globalIndex}
                          </td>
                          
                          <td className="px-4 py-4">
                            {isEditing ? (
                              <div className="relative w-16 h-16">
                                {res.imageUrls && res.imageUrls.length > 0 ? (
                                  <img
                                    src={res.imageUrls[0]}
                                    alt="Current"
                                    className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-md"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 rounded-xl cursor-pointer transition">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditedImage(e.target.files[0])}
                                    className="hidden"
                                  />
                                  <UploadCloud className="h-6 w-6 text-white" />
                                </label>
                              </div>
                            ) : (
                              <div 
                                className="cursor-pointer group relative"
                                onClick={() => setSelectedImage(res.imageUrls?.[0])}
                              >
                                <img
                                  src={res.imageUrls?.[0] || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400"}
                                  alt={res.name || "placeholder"}
                                  className="w-16 h-16 object-cover rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg border-2 border-white shadow-md"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400';
                                  }}
                                />
                                {res.imageUrls?.length > 1 && (
                                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                                    +{res.imageUrls.length - 1}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedData.name || ''}
                                onChange={e => setEditedData({ ...editedData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
                              <div className="text-sm font-semibold text-gray-900">{res.name}</div>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            {isEditing ? (
                              <textarea
                                value={editedData.description || ''}
                                onChange={e => setEditedData({ ...editedData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows="2"
                              />
                            ) : (
                              <div className="text-sm text-gray-700 max-w-xs line-clamp-2" title={res.description}>
                                {res.description}
                              </div>
                            )}
                          </td>
                        
                          <td className="px-4 py-4">
                            {isEditing ? (
                              <select
                                value={editedData.location || ''}
                                onChange={e => setEditedData({ ...editedData, location: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="" disabled>Select Location</option>
                                {locationOptions.map(loc => (
                                  <option key={loc} value={loc}>{loc}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                                {res.location}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            {isEditing ? (
                              <select
                                value={editedData.school_level || ''}
                                onChange={e => setEditedData({ ...editedData, school_level: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="" disabled>Select Level</option>
                                {schoolLevelOptions.map(level => (
                                  <option key={level.value} value={level.value}>{level.label}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                {res.school_level}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedData.subject || ''}
                                onChange={e => setEditedData({ ...editedData, subject: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
                              <div className="text-sm font-medium text-gray-800">{res.subject}</div>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            {isEditing ? (
                              <select
                                value={editedData.condition || ''}
                                onChange={e => setEditedData({ ...editedData, condition: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="" disabled>Select Condition</option>
                                {conditionOptions.map(cond => (
                                  <option key={cond} value={cond}>{cond.replace('-', ' ')}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                {res.condition?.replace('-', ' ') || 'N/A'}
                              </span>
                            )}
                          </td>
                        
                          <td className="px-4 py-4">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                value={editedData.quantity || 0}
                                onChange={e => setEditedData({ ...editedData, quantity: parseInt(e.target.value, 10) || 0 })}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                res.quantity > 5
                                  ? 'bg-green-100 text-green-800'
                                  : res.quantity > 0
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {res.quantity}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {dateAdded}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSave(res.id)}
                                    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                  >
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white text-xs font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEdit(res)}
                                    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                  >
                                    <Edit3 className="h-4 w-4 mr-1" />
                                    Edit
                                  </button>
                                  {res.isDeleted ? (
                                    <button
                                      onClick={() => handleToggleDelete(res.id)}
                                      disabled={isToggling}
                                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {isToggling ? (
                                        <div className="h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <RotateCcw className="h-4 w-4 mr-1" />
                                      )}
                                      Restore
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleToggleDelete(res.id)}
                                      disabled={isToggling}
                                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {isToggling ? (
                                        <div className="h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4 mr-1" />
                                      )}
                                      Delete
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-bold text-gray-800">{currentPage}</span> of <span className="font-bold text-gray-800">{totalPages}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-semibold text-gray-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="hidden md:flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                                currentPage === pageNum
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                  : 'bg-white hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return <span key={pageNum} className="text-gray-400">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-semibold text-gray-700"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Resource Detail"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}