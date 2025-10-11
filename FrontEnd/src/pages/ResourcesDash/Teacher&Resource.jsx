// import { useEffect, useState } from 'react';
// import { Search, Filter, Upload, Users, Package, MapPin, BookOpen, GraduationCap, Calendar, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
// import * as XLSX from 'xlsx';
// import axios from 'axios';

// const ResourceList = () => {
//   const [resources, setResources] = useState([]);
//   const [filteredResources, setFilteredResources] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     subject: '',
//     schoolLevel: '',
//     location: '',
//     status: '',
//     availability: ''
//   });
//   const [showFilters, setShowFilters] = useState(false);

//   // Unique values for dropdowns
//   const getUniqueValues = (field) => {
//     const values = resources.flatMap(res => {
//       if (field === 'status') {
//         return res.Users?.map(user => user.UserResource.status).filter(Boolean) || [];
//       }
//       return res[field] ? [res[field]] : [];
//     });
//     return [...new Set(values)].filter(Boolean);
//   };

//   useEffect(() => {
//     axios.get('https://alkhatem-school.onrender.com/api/with-users')
//       .then(res => setResources(res.data))
//       .catch(err => console.error('Error fetching resources:', err));
//   }, []);

//   useEffect(() => {
//     let filtered = resources;

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(resource =>
//         resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         resource.Users?.some(user => 
//           user.name.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }

//     // Subject filter
//     if (filters.subject) {
//       filtered = filtered.filter(resource => resource.subject === filters.subject);
//     }
//     // Level filter
//     if (filters.schoolLevel) {
//       filtered = filtered.filter(resource => resource.school_level === filters.schoolLevel);
//     }
//     // Location filter
//     if (filters.location) {
//       filtered = filtered.filter(resource => resource.location === filters.location);
//     }
//     // Status filter
//     if (filters.status) {
//       filtered = filtered.filter(resource => 
//         resource.Users?.some(user => user.UserResource.status === filters.status)
//       );
//     }
//     // Availability filter
//     if (filters.availability) {
//       if (filters.availability === 'available') {
//         filtered = filtered.filter(resource => resource.quantity > 0);
//       } else if (filters.availability === 'unavailable') {
//         filtered = filtered.filter(resource => resource.quantity === 0);
//       } else if (filters.availability === 'taken') {
//         filtered = filtered.filter(resource => resource.Users && resource.Users.length > 0);
//       }
//     }

//     setFilteredResources(filtered);
//   }, [resources, searchTerm, filters]);

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilters({
//       subject: '',
//       schoolLevel: '',
//       location: '',
//       status: '',
//       availability: ''
//     });
//   };

//   const handleExcelUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
//         axios.post('https://alkhatem-school.onrender.com/api/upload-report', jsonData);
//         alert(`Successfully uploaded ${jsonData.length} records from Excel file`);
//       } catch (error) {
//         console.error('Error reading Excel file:', error);
//         alert('Error reading Excel file. Please check the file format.');
//       }
//     };
//     reader.readAsArrayBuffer(file);
//     event.target.value = '';
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'returned': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'borrowed': return <Clock className="w-4 h-4 text-orange-500" />;
//       case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
//       default: return <Clock className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="min-h-screen  p-2">
//       <div className="max-w-full mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">Resource Management</h1>
//             <p className="text-gray-600">Track resources and monitor usage across your organization</p>
//           </div>
//           <label className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl cursor-pointer shadow-lg">
//             <Upload className="w-5 h-5" />
//             Upload Excel Report
//             <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" />
//           </label>
//         </div>

//         {/* Search + Filter */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
//           <div className="flex flex-col lg:flex-row gap-4 mb-6">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//               />
//             </div>
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl"
//             >
//               <Filter className="w-5 h-5" /> Filters
//             </button>
//           </div>

//           {showFilters && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-xl">
//               <select value={filters.subject} onChange={(e) => setFilters({...filters, subject: e.target.value})} className="px-3 py-2 border rounded-lg">
//                 <option value="">All Subjects</option>
//                 {getUniqueValues('subject').map(val => <option key={val} value={val}>{val}</option>)}
//               </select>
//               <select value={filters.schoolLevel} onChange={(e) => setFilters({...filters, schoolLevel: e.target.value})} className="px-3 py-2 border rounded-lg">
//                 <option value="">All Levels</option>
//                 {getUniqueValues('school_level').map(val => <option key={val} value={val}>{val}</option>)}
//               </select>
//               <select value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} className="px-3 py-2 border rounded-lg">
//                 <option value="">All Locations</option>
//                 {getUniqueValues('location').map(val => <option key={val} value={val}>{val}</option>)}
//               </select>
//               <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="px-3 py-2 border rounded-lg">
//                 <option value="">All Status</option>
//                 <option value="borrowed">Borrowed</option>
//                 <option value="returned">Returned</option>
//                 <option value="overdue">Overdue</option>
//               </select>
//               <select value={filters.availability} onChange={(e) => setFilters({...filters, availability: e.target.value})} className="px-3 py-2 border rounded-lg">
//                 <option value="">All Availability</option>
//                 <option value="available">Available</option>
//                 <option value="unavailable">Out of Stock</option>
//                 <option value="taken">Currently Taken</option>
//               </select>
//               <div className="lg:col-span-5">
//                 <button onClick={clearFilters} className="px-4 py-2 text-blue-600 hover:text-blue-800">Clear all filters</button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-100 text-gray-700">
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Description</th>
//                 <th className="p-3">Quantity</th>
//                 <th className="p-3">Location</th>
//                 <th className="p-3">Subject</th>
//                 <th className="p-3">Level</th>
//                 <th className="p-3">Users</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredResources.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center p-6 text-gray-500">No resources found</td>
//                 </tr>
//               ) : (
//                 filteredResources.map(resource => (
//                   <tr key={resource.id} className="border-t hover:bg-gray-50">
//                     <td className="p-3 font-semibold">{resource.name}</td>
//                     <td className="p-3">{resource.description || '-'}</td>
//                     <td className="p-3">{resource.quantity}</td>
//                     <td className="p-3">{resource.location}</td>
//                     <td className="p-3">{resource.subject}</td>
//                     <td className="p-3">
//   {resource.imageUrl ? (
//     <img
//       src={resource.imageUrl}
//       alt={resource.name}
//       className="w-16 h-16 object-cover rounded-lg shadow-sm"
//     />
//   ) : resource.imageUrls && resource.imageUrls.length > 0 ? (
//     <img
//       src={resource.imageUrls[0]}
//       alt={resource.name}
//       className="w-16 h-16 object-cover rounded-lg shadow-sm"
//     />
//   ) : (
//     <span className="text-gray-400">No image</span>
//   )}
// </td>

//                     <td className="p-3">{resource.school_level}</td>
//                     <td className="p-3">
//                       {resource.Users?.length > 0 ? (
//                         <ul className="space-y-1">
//                           {resource.Users.map(user => (
//                             <li key={user.id} className="flex items-center gap-2">
//                               <span className="font-medium">{user.name}</span>
//                               {user.UserResource.status && getStatusIcon(user.UserResource.status)}
//                               <span className="text-xs text-gray-500">({user.UserResource.quantityTaken})</span>
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <span className="text-gray-400">No users</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResourceList;


import { useEffect, useState } from 'react';
import { Search, Filter, Upload, X, ChevronLeft, ChevronRight, Package, MapPin, BookOpen, GraduationCap, Users, CheckCircle, Clock, AlertCircle, RefreshCw, Download } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

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
    setLoading(true);
    axios.get('https://alkhatem-school.onrender.com/api/with-users')
      .then(res => {
        setResources(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching resources:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.Users?.some(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filters.subject) {
      filtered = filtered.filter(resource => resource.subject === filters.subject);
    }
    if (filters.schoolLevel) {
      filtered = filtered.filter(resource => resource.school_level === filters.schoolLevel);
    }
    if (filters.location) {
      filtered = filtered.filter(resource => resource.location === filters.location);
    }
    if (filters.status) {
      filtered = filtered.filter(resource => 
        resource.Users?.some(user => user.UserResource.status === filters.status)
      );
    }
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
    setCurrentPage(1);
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

  const activeFilterCount = Object.values(filters).filter(val => val !== '').length;

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

  const getStatusBadge = (status) => {
    const styles = {
      returned: 'bg-green-100 text-green-700 border-green-200',
      borrowed: 'bg-orange-100 text-orange-700 border-orange-200',
      overdue: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const exportToExcel = () => {
    const exportData = filteredResources.map(resource => ({
      Name: resource.name,
      Description: resource.description || '-',
      Quantity: resource.quantity,
      Location: resource.location,
      Subject: resource.subject,
      Level: resource.school_level,
      Users: resource.Users?.map(u => `${u.name} (${u.UserResource.status})`).join(', ') || 'No users'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resources');
    XLSX.writeFile(wb, 'resources_export.xlsx');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Resource Management
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">Track and monitor resources across your organization</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
              {/* <label className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200 font-medium">
                <Upload className="w-5 h-5" />
                Upload
                <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" />
              </label> */}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Resources</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{resources.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Available</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {resources.filter(r => r.quantity > 0).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">In Use</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {resources.filter(r => r.Users && r.Users.length > 0).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {resources.filter(r => r.quantity === 0).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search resources, descriptions, users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                showFilters 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 bg-white text-blue-600 rounded-full text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select 
                    value={filters.subject} 
                    onChange={(e) => setFilters({...filters, subject: e.target.value})} 
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  >
                    <option value="">All Subjects</option>
                    {getUniqueValues('subject').map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Level</label>
                  <select 
                    value={filters.schoolLevel} 
                    onChange={(e) => setFilters({...filters, schoolLevel: e.target.value})} 
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  >
                    <option value="">All Levels</option>
                    {getUniqueValues('school_level').map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select 
                    value={filters.location} 
                    onChange={(e) => setFilters({...filters, location: e.target.value})} 
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  >
                    <option value="">All Locations</option>
                    {getUniqueValues('location').map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    value={filters.status} 
                    onChange={(e) => setFilters({...filters, status: e.target.value})} 
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  >
                    <option value="">All Status</option>
                    <option value="borrowed">Borrowed</option>
                    <option value="returned">Returned</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select 
                    value={filters.availability} 
                    onChange={(e) => setFilters({...filters, availability: e.target.value})} 
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  >
                    <option value="">All Availability</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Out of Stock</option>
                    <option value="taken">Currently Taken</option>
                  </select>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button 
                  onClick={clearFilters} 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Resource</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Users</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">No resources found</p>
                          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((resource, idx) => (
                        <tr key={resource.id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0">
                                {resource.imageUrl || (resource.imageUrls && resource.imageUrls.length > 0) ? (
                                  <img
                                    src={resource.imageUrl || resource.imageUrls[0]}
                                    alt={resource.name}
                                    className="w-14 h-14 object-cover rounded-xl shadow-md border border-gray-200"
                                  />
                                ) : (
                                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-blue-600" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{resource.name}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">{resource.description || 'No description'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                <span className="text-gray-700">{resource.subject}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <GraduationCap className="w-4 h-4 text-purple-500" />
                                <span className="text-gray-700">{resource.school_level}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                              resource.quantity > 5 
                                ? 'bg-green-100 text-green-700' 
                                : resource.quantity > 0 
                                ? 'bg-orange-100 text-orange-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {resource.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {resource.location}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {resource.Users?.length > 0 ? (
                              <div className="space-y-2">
                                {resource.Users.slice(0, 2).map(user => (
                                  <div key={user.id} className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                      {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                      <div className="flex items-center gap-1">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(user.UserResource.status)}`}>
                                          {getStatusIcon(user.UserResource.status)}
                                          {user.UserResource.status}
                                        </span>
                                        <span className="text-xs text-gray-500">({user.UserResource.quantityTaken})</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {resource.Users.length > 2 && (
                                  <div className="text-xs text-gray-500 pl-10">
                                    +{resource.Users.length - 2} more
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">No users</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      entries | Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredResources.length)} of {filteredResources.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-1">
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
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                currentPage === pageNum
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return <span key={pageNum} className="px-2 py-1.5 text-gray-400">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceList;