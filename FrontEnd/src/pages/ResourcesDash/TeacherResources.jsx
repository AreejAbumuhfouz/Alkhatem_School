


// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Package, AlertCircle, CheckCircle, Plus, Minus } from 'lucide-react';

// export default function ClaimResourceForm() {
//   const [resources, setResources] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [loading, setLoading] = useState({});
//   const [messages, setMessages] = useState({});

//   // Fetch resources on mount
//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/teacher', { withCredentials: true }) // ✅ include credentials
//       .then(res => {
//         setResources(res.data);
//         // initialize quantities
//         const initialQuantities = {};
//         res.data.forEach(resource => {
//           initialQuantities[resource.id] = 1;
//         });
//         setQuantities(initialQuantities);
//       })
//       .catch(err => console.error('Error fetching resources:', err));
//   }, []);

//   const handleQuantityChange = (resourceId, value) => {
//     const resource = resources.find(r => r.id === resourceId);
//     const numValue = Math.max(
//       1,
//       Math.min(resource?.quantity || 1, parseInt(value) || 1)
//     );
//     setQuantities(prev => ({
//       ...prev,
//       [resourceId]: numValue,
//     }));
//   };

//   const adjustQuantity = (resourceId, delta) => {
//     const resource = resources.find(r => r.id === resourceId);
//     const currentQty = quantities[resourceId] || 1;
//     const newQty = Math.max(
//       1,
//       Math.min(resource?.quantity || 1, currentQty + delta)
//     );
//     setQuantities(prev => ({
//       ...prev,
//       [resourceId]: newQty,
//     }));
//   };

//   const handleClaim = async resource => {
//     const resourceId = resource.id;
//     const quantityRequested = quantities[resourceId];

//     if (quantityRequested > resource.quantity) {
//       setMessages(prev => ({
//         ...prev,
//         [resourceId]: {
//           type: 'error',
//           text: `Only ${resource.quantity} available`,
//         },
//       }));
//       return;
//     }

//     setLoading(prev => ({ ...prev, [resourceId]: true }));
//     setMessages(prev => ({ ...prev, [resourceId]: null }));

//     try {
//       const res = await axios.post(
//         'http://localhost:5000/api/resources/claim',
//         {
//           resourceId,
//           quantityRequested,
//         },
//         { withCredentials: true }
//       );

//       setMessages(prev => ({
//         ...prev,
//         [resourceId]: { type: 'success', text: res.data.message },
//       }));

//       // Update local resource quantity
//       setResources(prev =>
//         prev.map(r =>
//           r.id === resourceId
//             ? { ...r, quantity: r.quantity - quantityRequested }
//             : r
//         )
//       );

//       // clear message after 3s
//       setTimeout(() => {
//         setMessages(prev => ({ ...prev, [resourceId]: null }));
//       }, 3000);
//     } catch (err) {
//       console.error(err);
//       setMessages(prev => ({
//         ...prev,
//         [resourceId]: {
//           type: 'error',
//           text: err.response?.data?.message || 'Error claiming resource',
//         },
//       }));
//     } finally {
//       setLoading(prev => ({ ...prev, [resourceId]: false }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Center</h1>
//           <p className="text-gray-600">
//             Claim the resources you need for your classroom
//           </p>
//         </div>

//         {resources.length === 0 ? (
//           <div className="text-center py-12">
//             <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//             <p className="text-gray-500">Loading resources...</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             {/* Table Header */}
//             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//               <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
//                 <div className="col-span-3">Resource Name</div>
//                 <div className="col-span-2">Category</div>
//                 <div className="col-span-3">Description</div>
//                 <div className="col-span-1 text-center">Available</div>
//                 <div className="col-span-2 text-center">Quantity</div>
//                 <div className="col-span-1 text-center">Action</div>
//               </div>
//             </div>

//             {/* Table Body */}
//             <div className="divide-y divide-gray-200">
//               {resources.map(resource => (
//                 <div
//                   key={resource.id}
//                   className="px-6 py-4 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="grid grid-cols-12 gap-4 items-center">
//                     {/* Resource Name */}
//                     <div className="col-span-3">
//                       <div className="flex items-center space-x-3">
//                         <Package className="h-5 w-5 text-gray-400" />
//                         <div>
//                           <p className="font-medium text-gray-900">
//                             {resource.name}
//                           </p>
//                           <div
//                             className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
//                               resource.quantity > 5
//                                 ? 'bg-green-100 text-green-800'
//                                 : resource.quantity > 0
//                                 ? 'bg-yellow-100 text-yellow-800'
//                                 : 'bg-red-100 text-red-800'
//                             }`}
//                           >
//                             {resource.quantity > 5
//                               ? 'In Stock'
//                               : resource.quantity > 0
//                               ? 'Low Stock'
//                               : 'Out of Stock'}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Category */}
//                     <div className="col-span-2">
//                       <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
//                         {resource.subject}
//                       </span>
//                     </div>

//                     {/* Description */}
//                     <div className="col-span-3">
//                       <p className="text-sm text-gray-600">
//                         {resource.description}
//                       </p>
//                     </div>

//                     {/* Available Quantity */}
//                     <div className="col-span-1 text-center">
//                       <span
//                         className={`font-bold text-lg ${
//                           resource.quantity > 5
//                             ? 'text-green-600'
//                             : resource.quantity > 0
//                             ? 'text-yellow-600'
//                             : 'text-red-600'
//                         }`}
//                       >
//                         {resource.quantity}
//                       </span>
//                     </div>

//                     {/* Quantity Selector */}
//                     <div className="col-span-2">
//                       <div className="flex items-center justify-center space-x-2">
//                         <button
//                           onClick={() => adjustQuantity(resource.id, -1)}
//                           disabled={quantities[resource.id] <= 1}
//                           className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
//                         >
//                           <Minus className="h-4 w-4" />
//                         </button>
//                         <input
//                           type="number"
//                           min="1"
//                           max={resource.quantity}
//                           value={quantities[resource.id] || 1}
//                           onChange={e =>
//                             handleQuantityChange(resource.id, e.target.value)
//                           }
//                           className="w-16 text-center border border-gray-300 rounded-lg py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           disabled={resource.quantity === 0}
//                         />
//                         <button
//                           onClick={() => adjustQuantity(resource.id, 1)}
//                           disabled={quantities[resource.id] >= resource.quantity}
//                           className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
//                         >
//                           <Plus className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Claim Button */}
//                     <div className="col-span-1 text-center">
//                       <button
//                         onClick={() => handleClaim(resource)}
//                         disabled={loading[resource.id] || resource.quantity === 0}
//                         className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                           resource.quantity === 0
//                             ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                             : loading[resource.id]
//                             ? 'bg-blue-400 text-white cursor-not-allowed'
//                             : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
//                         }`}
//                       >
//                         {loading[resource.id] ? (
//                           <div className="flex items-center space-x-1">
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           </div>
//                         ) : (
//                           'Claim'
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Message Row */}
//                   {messages[resource.id] && (
//                     <div className="mt-3 ml-8">
//                       <div
//                         className={`flex items-center space-x-2 p-3 rounded-lg ${
//                           messages[resource.id].type === 'success'
//                             ? 'bg-green-50 text-green-700'
//                             : 'bg-red-50 text-red-700'
//                         }`}
//                       >
//                         {messages[resource.id].type === 'success' ? (
//                           <CheckCircle className="h-4 w-4 flex-shrink-0" />
//                         ) : (
//                           <AlertCircle className="h-4 w-4 flex-shrink-0" />
//                         )}
//                         <span className="text-sm">
//                           {messages[resource.id].text}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import { Package, AlertCircle, CheckCircle, Plus, Minus, X, Eye, Calendar, User, Tag, Info, ChevronDown, ChevronRight } from 'lucide-react';

// export default function ClaimResourceForm() {
//   const [resources, setResources] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [loading, setLoading] = useState({});
//   const [messages, setMessages] = useState({});
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [expandedResource, setExpandedResource] = useState(null);

//   // Mock axios for demo - replace with actual axios
//   const axios = {
//     get: async (url, config) => {
//       // Simulate API call
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({
          
//           });
//         }, 1000);
//       });
//     },
//     post: async (url, data, config) => {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({
//             data: { message: `Successfully claimed ${data.quantityRequested} item(s)!` }
//           });
//         }, 1500);
//       });
//     }
//   };

//   // Fetch resources on mount
//   useEffect(() => {
//     setLoading({ general: true });
//     axios
//       .get('http://localhost:5000/api/teacher', { withCredentials: true })
//       .then(res => {
//         setResources(res.data);
//         // initialize quantities
//         const initialQuantities = {};
//         res.data.forEach(resource => {
//           initialQuantities[resource.id] = 1;
//         });
//         setQuantities(initialQuantities);
//         setLoading({ general: false });
//       })
//       .catch(err => {
//         console.error('Error fetching resources:', err);
//         setLoading({ general: false });
//       });
//   }, []);

//   const handleQuantityChange = (resourceId, value) => {
//     const resource = resources.find(r => r.id === resourceId);
//     const numValue = Math.max(
//       1,
//       Math.min(resource?.quantity || 1, parseInt(value) || 1)
//     );
//     setQuantities(prev => ({
//       ...prev,
//       [resourceId]: numValue,
//     }));
//   };

//   const adjustQuantity = (resourceId, delta) => {
//     const resource = resources.find(r => r.id === resourceId);
//     const currentQty = quantities[resourceId] || 1;
//     const newQty = Math.max(
//       1,
//       Math.min(resource?.quantity || 1, currentQty + delta)
//     );
//     setQuantities(prev => ({
//       ...prev,
//       [resourceId]: newQty,
//     }));
//   };

//   const handleClaim = async resource => {
//     const resourceId = resource.id;
//     const quantityRequested = quantities[resourceId];

//     if (quantityRequested > resource.quantity) {
//       setMessages(prev => ({
//         ...prev,
//         [resourceId]: {
//           type: 'error',
//           text: `Only ${resource.quantity} available`,
//         },
//       }));
//       return;
//     }

//     setLoading(prev => ({ ...prev, [resourceId]: true }));
//     setMessages(prev => ({ ...prev, [resourceId]: null }));

//     try {
//       const res = await axios.post(
//         'http://localhost:5000/api/resources/claim',
//         {
//           resourceId,
//           quantityRequested,
//         },
//         { withCredentials: true }
//       );

//       setMessages(prev => ({
//         ...prev,
//         [resourceId]: { type: 'success', text: res.data.message },
//       }));

//       // Update local resource quantity
//       setResources(prev =>
//         prev.map(r =>
//           r.id === resourceId
//             ? { ...r, quantity: r.quantity - quantityRequested }
//             : r
//         )
//       );

//       // clear message after 4s
//       setTimeout(() => {
//         setMessages(prev => ({ ...prev, [resourceId]: null }));
//       }, 4000);
//     } catch (err) {
//       console.error(err);
//       setMessages(prev => ({
//         ...prev,
//         [resourceId]: {
//           type: 'error',
//           text: err.response?.data?.message || 'Error claiming resource',
//         },
//       }));
//     } finally {
//       setLoading(prev => ({ ...prev, [resourceId]: false }));
//     }
//   };

//   const getConditionStyle = (condition) => {
//     const styles = {
//       'good-new': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
//       'good-used': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
//       'damaged': 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200',
//       'over-used': 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200'
//     };
//     return styles[condition] || 'bg-gray-100 text-gray-800 border border-gray-200';
//   };

//   const getConditionIcon = (condition) => {
//     const icons = {
//       'good-new': '✨',
//       'good-used': '👍',
//       'damaged': '⚠️',
//       'over-used': '🔄'
//     };
//     return icons[condition] || '📋';
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };
import { useState, useEffect } from 'react';
import axios from 'axios'; // Use real axios
import { Package, AlertCircle, CheckCircle, Plus, Minus, X, Eye, Calendar, User, Tag, Info, ChevronDown, ChevronRight } from 'lucide-react';

export default function ClaimResourceForm() {
  const [resources, setResources] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState({});
  const [messages, setMessages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedResource, setExpandedResource] = useState(null);

  // Fetch resources on mount
  useEffect(() => {
    setLoading({ general: true });
    axios
      .get('http://localhost:5000/api/teacher', { withCredentials: true })
      .then(res => {
        setResources(res.data);
        // initialize quantities
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
        'http://localhost:5000/api/resources/claim',
        { resourceId, quantityRequested },
        { withCredentials: true }
      );

      setMessages(prev => ({
        ...prev,
        [resourceId]: { type: 'success', text: res.data.message },
      }));

      // Update local resource quantity
      setResources(prev =>
        prev.map(r => (r.id === resourceId ? { ...r, quantity: r.quantity - quantityRequested } : r))
      );

      // Clear message after 4s
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


  return (
    <div className="min-h-screen ">
      <div className="max-w-full mx-auto px-2 py-2">
       

        {resources.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">No Resources Available</h3>
              <p className="text-gray-600">Check back later for new resources!</p>
            </div>
          </div>
        ) : (
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
              {resources.map(resource => (
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
                            src={resource.imageUrls?.[0] }
                            alt={resource.name}
                            className="w-16 h-16 object-cover rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg border-2 border-white shadow-md"
                            onClick={() => setSelectedImage(resource.imageUrls?.[0] )}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400';
                            }}
                          />
                          {resource.imageUrls?.length > 1 && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                              +{resource.imageUrls.length - 1}
                            </div>
                          )}
                          {/* <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white" />
                          </div> */}
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