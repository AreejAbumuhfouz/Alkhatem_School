

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Package, AlertCircle, CheckCircle, Plus, Minus, X, Eye, Calendar, User, Tag, Info, ChevronDown, ChevronRight, Search, Filter, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

export default function ClaimResourceForm() {
  const [resources, setResources] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState({});
  const [messages, setMessages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedResource, setExpandedResource] = useState(null);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch resources on mount
  useEffect(() => {
    setLoading({ general: true });
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/teacher`, { withCredentials: true })
      .then(res => {
        setResources(res.data);
        const initialQuantities = {};
        res.data.forEach(resource => {
          initialQuantities[resource.id] = 1;
        });
        setQuantities(initialQuantities);
        setLoading({ general: false });
      })
      .catch(err => {
        console.error('Error fetching resources:', err);
        setLoading({ general: false });
      });
  }, []);

  // Get unique subjects and conditions
  const subjects = useMemo(() => {
    const uniqueSubjects = [...new Set(resources.map(r => r.subject))];
    return uniqueSubjects.sort();
  }, [resources]);

  const conditions = useMemo(() => {
    const uniqueConditions = [...new Set(resources.map(r => r.condition))];
    return uniqueConditions.sort();
  }, [resources]);

  // Filter and search logic
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      // Search filter - safely handle undefined/null values
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        (resource.name?.toLowerCase() || '').includes(searchLower) ||
        (resource.description?.toLowerCase() || '').includes(searchLower) ||
        (resource.addedBy?.toLowerCase() || '').includes(searchLower);
      
      // Subject filter
      const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
      
      // Condition filter
      const matchesCondition = selectedCondition === 'all' || resource.condition === selectedCondition;
      
      // Availability filter
      const matchesAvailability = 
        availabilityFilter === 'all' ||
        (availabilityFilter === 'in-stock' && resource.quantity > 5) ||
        (availabilityFilter === 'low-stock' && resource.quantity > 0 && resource.quantity <= 5) ||
        (availabilityFilter === 'out-of-stock' && resource.quantity === 0);
      
      return matchesSearch && matchesSubject && matchesCondition && matchesAvailability;
    });
  }, [resources, searchQuery, selectedSubject, selectedCondition, availabilityFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResources = filteredResources.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSubject, selectedCondition, availabilityFilter]);

  const handleQuantityChange = (resourceId, value) => {
    const resource = resources.find(r => r.id === resourceId);
    const numValue = Math.max(1, Math.min(resource?.quantity || 1, parseInt(value) || 1));
    setQuantities(prev => ({ ...prev, [resourceId]: numValue }));
  };

  const adjustQuantity = (resourceId, delta) => {
    const resource = resources.find(r => r.id === resourceId);
    const currentQty = quantities[resourceId] || 1;
    const newQty = Math.max(1, Math.min(resource?.quantity || 1, currentQty + delta));
    setQuantities(prev => ({ ...prev, [resourceId]: newQty }));
  };

  const handleClaim = async resource => {
    const resourceId = resource.id;
    const quantityRequested = quantities[resourceId];

    if (quantityRequested > resource.quantity) {
      setMessages(prev => ({
        ...prev,
        [resourceId]: { type: 'error', text: `Only ${resource.quantity} available` },
      }));
      return;
    }

    setLoading(prev => ({ ...prev, [resourceId]: true }));
    setMessages(prev => ({ ...prev, [resourceId]: null }));

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resources/claim`,
        { resourceId, quantityRequested },
        { withCredentials: true }
      );

      setMessages(prev => ({
        ...prev,
        [resourceId]: { type: 'success', text: res.data.message },
      }));

      setResources(prev =>
        prev.map(r => (r.id === resourceId ? { ...r, quantity: r.quantity - quantityRequested } : r))
      );

      setTimeout(() => {
        setMessages(prev => ({ ...prev, [resourceId]: null }));
      }, 4000);
    } catch (err) {
      console.error(err);
      setMessages(prev => ({
        ...prev,
        [resourceId]: { type: 'error', text: err.response?.data?.message || 'Error claiming resource' },
      }));
    } finally {
      setLoading(prev => ({ ...prev, [resourceId]: false }));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedCondition('all');
    setAvailabilityFilter('all');
  };

  const getConditionStyle = condition => {
    const styles = {
      'good-new': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
      'good-used': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
      'damaged': 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200',
      'over-used': 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200',
    };
    return styles[condition] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getConditionIcon = condition => {
    const icons = {
      'good-new': '✨',
      'good-used': '👍',
      'damaged': '⚠️',
      'over-used': '🔄',
    };
    return icons[condition] || '📋';
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const activeFiltersCount = [
    searchQuery !== '',
    selectedSubject !== 'all',
    selectedCondition !== 'all',
    availabilityFilter !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto px-2 py-2">
        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-6 p-6">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search resources by name, description, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              />
            </div>
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
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Conditions</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>
                      {condition.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Items</option>
                  <option value="in-stock">In Stock (5+)</option>
                  <option value="low-stock">Low Stock (1-5)</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-semibold">Active Filters:</span>
                {searchQuery && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Search: "{searchQuery}"</span>}
                {selectedSubject !== 'all' && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Subject: {selectedSubject}</span>}
                {selectedCondition !== 'all' && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Condition: {selectedCondition.replace('-', ' ')}</span>}
                {availabilityFilter !== 'all' && <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">Availability: {availabilityFilter.replace('-', ' ')}</span>}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-semibold underline"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-bold text-gray-800">{startIndex + 1}-{Math.min(endIndex, filteredResources.length)}</span> of <span className="font-bold text-gray-800">{filteredResources.length}</span> resources
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">No Resources Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  <div className="col-span-1"></div>
                  <div className="col-span-1">Image</div>
                  <div className="col-span-3">Resource Details</div>
                  <div className="col-span-2">Subject & Condition</div>
                  <div className="col-span-1 text-center">Available</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200/50">
                {currentResources.map(resource => (
                  <div key={resource.id} className="group">
                    {/* Main Row */}
                    <div className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Expand Button */}
                        <div className="col-span-1">
                          <button
                            onClick={() => setExpandedResource(expandedResource === resource.id ? null : resource.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          >
                            {expandedResource === resource.id ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        {/* Resource Image */}
                        <div className="col-span-1">
                          <div className="relative group cursor-pointer">
                            <img
                              src={resource.imageUrls?.[0]}
                              alt={resource.name}
                              className="w-16 h-16 object-cover rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg border-2 border-white shadow-md"
                              onClick={() => setSelectedImage(resource.imageUrls?.[0])}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400';
                              }}
                            />
                            {resource.imageUrls?.length > 1 && (
                              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                                +{resource.imageUrls.length - 1}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Resource Details */}
                        <div className="col-span-3">
                          <div className="space-y-1">
                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                              {resource.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {resource.description}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>Added {formatDate(resource.createdAt)}</span>
                              <span>•</span>
                              <User className="h-3 w-3" />
                              <span>{resource.addedBy}</span>
                            </div>
                          </div>
                        </div>

                        {/* Subject & Condition */}
                        <div className="col-span-2">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                                <Tag className="h-3 w-3 inline mr-1" />
                                {resource.subject}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionStyle(resource.condition)}`}>
                                {getConditionIcon(resource.condition)} {resource.condition?.replace('-', ' ') || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Available Quantity */}
                        <div className="col-span-1 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span
                              className={`font-bold text-2xl ${
                                resource.quantity > 5
                                  ? 'text-green-600'
                                  : resource.quantity > 0
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {resource.quantity}
                            </span>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                resource.quantity > 5
                                  ? 'bg-green-100 text-green-800'
                                  : resource.quantity > 0
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {resource.quantity > 5
                                ? 'In Stock'
                                : resource.quantity > 0
                                ? 'Low Stock'
                                : 'Out of Stock'}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="col-span-2">
                          {resource.quantity > 0 ? (
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => adjustQuantity(resource.id, -1)}
                                disabled={quantities[resource.id] <= 1}
                                className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm border"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                max={resource.quantity}
                                value={quantities[resource.id] || 1}
                                onChange={e =>
                                  handleQuantityChange(resource.id, e.target.value)
                                }
                                className="w-16 text-center border border-gray-300 rounded-lg py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                              />
                              <button
                                onClick={() => adjustQuantity(resource.id, 1)}
                                disabled={quantities[resource.id] >= resource.quantity}
                                className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm border"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 text-sm">N/A</div>
                          )}
                        </div>

                        {/* Claim Button */}
                        <div className="col-span-2 text-center">
                          <button
                            onClick={() => handleClaim(resource)}
                            disabled={loading[resource.id] || resource.quantity === 0}
                            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                              resource.quantity === 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : loading[resource.id]
                                ? 'bg-blue-400 text-white cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            }`}
                          >
                            {loading[resource.id] ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Claiming...</span>
                              </div>
                            ) : resource.quantity === 0 ? (
                              '❌ Out of Stock'
                            ) : (
                              `🎯 Claim ${quantities[resource.id]}`
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details Row */}
                    {expandedResource === resource.id && (
                      <div className="px-6 pb-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80 border-t border-gray-200/50">
                        <div className="pt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Additional Images */}
                          {resource.imageUrls?.length > 1 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                Additional Images
                              </h4>
                              <div className="flex space-x-3 overflow-x-auto pb-2">
                                {resource.imageUrls.slice(1).map((url, index) => (
                                  <img
                                    key={index}
                                    src={url}
                                    alt={`${resource.name} ${index + 2}`}
                                    className="w-20 h-20 object-cover rounded-xl cursor-pointer hover:scale-110 transition-all duration-300 shadow-md border-2 border-white hover:shadow-lg"
                                    onClick={() => setSelectedImage(url)}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Resource Info */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                              <Info className="h-4 w-4 mr-2" />
                              Resource Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Last Updated:</span>
                                <span className="font-medium">{formatDate(resource.updatedAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subject Area:</span>
                                <span className="font-medium">{resource.subject}</span>
                              </div>
                              <div className="pt-2">
                                <span className="text-gray-600 block mb-1">Full Description:</span>
                                <p className="text-gray-700 leading-relaxed">{resource.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message Row */}
                    {messages[resource.id] && (
                      <div className="px-6 pb-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80">
                        <div
                          className={`flex items-center space-x-3 p-4 rounded-xl ${
                            messages[resource.id].type === 'success'
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200'
                              : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {messages[resource.id].type === 'success' ? (
                            <CheckCircle className="h-5 w-5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                          )}
                          <span className="font-medium">
                            {messages[resource.id].text}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4">
                <div className="text-sm text-gray-600">
                  Page <span className="font-bold text-gray-800">{currentPage}</span> of <span className="font-bold text-gray-800">{totalPages}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                      // Show first, last, current, and adjacent pages
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-semibold text-gray-700"
                  >
                    <span>Next</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Items per page info */}
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-800">{itemsPerPage}</span> items per page
                </div>
              </div>
            )}
          </>
        )}
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
            />
          </div>
        </div>
      )}
    </div>
  );
}