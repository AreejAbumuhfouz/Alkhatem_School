import { useEffect, useState } from 'react';
import { Search, Filter, Upload, Users, Package, MapPin, BookOpen, GraduationCap, Calendar, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    schoolLevel: '',
    location: '',
    status: '',
    availability: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Unique values for dropdowns
  const getUniqueValues = (field) => {
    const values = resources.flatMap(res => {
      if (field === 'status') {
        return res.Users?.map(user => user.UserResource.status).filter(Boolean) || [];
      }
      return res[field] ? [res[field]] : [];
    });
    return [...new Set(values)].filter(Boolean);
  };

  useEffect(() => {
    axios.get('https://alkhatem-school.onrender.com/api/with-users')
      .then(res => setResources(res.data))
      .catch(err => console.error('Error fetching resources:', err));
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.Users?.some(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Subject filter
    if (filters.subject) {
      filtered = filtered.filter(resource => resource.subject === filters.subject);
    }
    // Level filter
    if (filters.schoolLevel) {
      filtered = filtered.filter(resource => resource.school_level === filters.schoolLevel);
    }
    // Location filter
    if (filters.location) {
      filtered = filtered.filter(resource => resource.location === filters.location);
    }
    // Status filter
    if (filters.status) {
      filtered = filtered.filter(resource => 
        resource.Users?.some(user => user.UserResource.status === filters.status)
      );
    }
    // Availability filter
    if (filters.availability) {
      if (filters.availability === 'available') {
        filtered = filtered.filter(resource => resource.quantity > 0);
      } else if (filters.availability === 'unavailable') {
        filtered = filtered.filter(resource => resource.quantity === 0);
      } else if (filters.availability === 'taken') {
        filtered = filtered.filter(resource => resource.Users && resource.Users.length > 0);
      }
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, filters]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      subject: '',
      schoolLevel: '',
      location: '',
      status: '',
      availability: ''
    });
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        axios.post('https://alkhatem-school.onrender.com/api/upload-report', jsonData);
        alert(`Successfully uploaded ${jsonData.length} records from Excel file`);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        alert('Error reading Excel file. Please check the file format.');
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'returned': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'borrowed': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen  p-2">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Resource Management</h1>
            <p className="text-gray-600">Track resources and monitor usage across your organization</p>
          </div>
          <label className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl cursor-pointer shadow-lg">
            <Upload className="w-5 h-5" />
            Upload Excel Report
            <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" />
          </label>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl"
            >
              <Filter className="w-5 h-5" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-xl">
              <select value={filters.subject} onChange={(e) => setFilters({...filters, subject: e.target.value})} className="px-3 py-2 border rounded-lg">
                <option value="">All Subjects</option>
                {getUniqueValues('subject').map(val => <option key={val} value={val}>{val}</option>)}
              </select>
              <select value={filters.schoolLevel} onChange={(e) => setFilters({...filters, schoolLevel: e.target.value})} className="px-3 py-2 border rounded-lg">
                <option value="">All Levels</option>
                {getUniqueValues('school_level').map(val => <option key={val} value={val}>{val}</option>)}
              </select>
              <select value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} className="px-3 py-2 border rounded-lg">
                <option value="">All Locations</option>
                {getUniqueValues('location').map(val => <option key={val} value={val}>{val}</option>)}
              </select>
              <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="px-3 py-2 border rounded-lg">
                <option value="">All Status</option>
                <option value="borrowed">Borrowed</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </select>
              <select value={filters.availability} onChange={(e) => setFilters({...filters, availability: e.target.value})} className="px-3 py-2 border rounded-lg">
                <option value="">All Availability</option>
                <option value="available">Available</option>
                <option value="unavailable">Out of Stock</option>
                <option value="taken">Currently Taken</option>
              </select>
              <div className="lg:col-span-5">
                <button onClick={clearFilters} className="px-4 py-2 text-blue-600 hover:text-blue-800">Clear all filters</button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Location</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Level</th>
                <th className="p-3">Users</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">No resources found</td>
                </tr>
              ) : (
                filteredResources.map(resource => (
                  <tr key={resource.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-semibold">{resource.name}</td>
                    <td className="p-3">{resource.description || '-'}</td>
                    <td className="p-3">{resource.quantity}</td>
                    <td className="p-3">{resource.location}</td>
                    <td className="p-3">{resource.subject}</td>
                    <td className="p-3">
  {resource.imageUrl ? (
    <img
      src={resource.imageUrl}
      alt={resource.name}
      className="w-16 h-16 object-cover rounded-lg shadow-sm"
    />
  ) : resource.imageUrls && resource.imageUrls.length > 0 ? (
    <img
      src={resource.imageUrls[0]}
      alt={resource.name}
      className="w-16 h-16 object-cover rounded-lg shadow-sm"
    />
  ) : (
    <span className="text-gray-400">No image</span>
  )}
</td>

                    <td className="p-3">{resource.school_level}</td>
                    <td className="p-3">
                      {resource.Users?.length > 0 ? (
                        <ul className="space-y-1">
                          {resource.Users.map(user => (
                            <li key={user.id} className="flex items-center gap-2">
                              <span className="font-medium">{user.name}</span>
                              {user.UserResource.status && getStatusIcon(user.UserResource.status)}
                              <span className="text-xs text-gray-500">({user.UserResource.quantityTaken})</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">No users</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResourceList;
