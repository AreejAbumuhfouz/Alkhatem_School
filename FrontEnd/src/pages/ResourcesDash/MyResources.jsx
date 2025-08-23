// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function MyResources() {
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingResource, setEditingResource] = useState(null);
//   const [form, setForm] = useState({
//     description: "",
//     condition: "good-new",
//     images: null,
//     quantityReturned: 1,
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch my claimed resources
//   const fetchResources = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const res = await axios.get("http://localhost:5000/api/my-resources", {
//         withCredentials: true,
//       });
//       setResources(res.data);
//     } catch (error) {
//       console.error("Failed to fetch resources:", error);
//       setError("Failed to fetch your resources. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchResources();
//   }, []);

//   // Initialize form when editing starts
//   const startEditing = (resource) => {
//     setEditingResource(resource);
//     setForm({
//       description: resource.description || "",
//       condition: resource.condition || "good-new",
//       images: null,
//       quantityReturned: 1,
//     });
//     setError("");
//     setSuccess("");
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setForm((prev) => ({ ...prev, [name]: files }));
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Handle resource return + update
//   const handleReturn = async (resourceId) => {
//     try {
//       setError("");
//       setSuccess("");

//       // Validation
//       if (form.quantityReturned < 1) {
//         setError("Quantity to return must be at least 1");
//         return;
//       }

//       const currentResource = resources.find(r => r.resourceId === resourceId);
//       if (form.quantityReturned > currentResource.quantityTaken) {
//         setError(`Cannot return more than ${currentResource.quantityTaken} items`);
//         return;
//       }

//       const data = new FormData();
//       data.append("resourceId", resourceId);
//       data.append("description", form.description);
//       data.append("condition", form.condition);
//       data.append("quantityReturned", form.quantityReturned);
      
//       // Append multiple images if selected
//       if (form.images && form.images.length > 0) {
//         for (let i = 0; i < form.images.length; i++) {
//           data.append("images", form.images[i]);
//         }
//       }

//       const res = await axios.post("http://localhost:5000/api/return", data, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // Update state based on response
//       setResources((prev) =>
//         prev.map((r) => {
//           if (r.resourceId === resourceId) {
//             const newQuantityTaken = r.quantityTaken - parseInt(form.quantityReturned);
//             return {
//               ...r,
//               description: form.description,
//               condition: form.condition,
//               quantityTaken: newQuantityTaken,
//               // Update images if new ones were uploaded
//               imageUrls: res.data.resource?.imageUrls || r.imageUrls,
//             };
//           }
//           return r;
//         }).filter(r => r.quantityTaken > 0) // Remove resources with 0 quantity
//       );

//       setSuccess(`Successfully returned ${form.quantityReturned} item(s)`);
//       setEditingResource(null);
//       setForm({ 
//         description: "", 
//         condition: "good-new", 
//         images: null, 
//         quantityReturned: 1 
//       });

//       // Clear success message after 3 seconds
//       setTimeout(() => setSuccess(""), 3000);

//     } catch (error) {
//       console.error("Failed to return/update resource:", error);
//       setError(error.response?.data?.message || "Failed to return resource. Please try again.");
//     }
//   };

//   // Cancel editing
//   const cancelEditing = () => {
//     setEditingResource(null);
//     setForm({ 
//       description: "", 
//       condition: "good-new", 
//       images: null, 
//       quantityReturned: 1 
//     });
//     setError("");
//     setSuccess("");
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">My Resources</h2>
      
//       {/* Error/Success Messages */}
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}
      
//       {success && (
//         <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
//           {success}
//         </div>
//       )}

//       {resources.length === 0 ? (
//         <div className="text-center py-8">
//           <p className="text-gray-500 text-lg">You have no claimed resources.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {resources.map((res) => (
//             <div key={res.resourceId} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
//               {/* Resource Image */}
//               {(res.imageUrls?.length > 0 || res.imageUrl) && (
//                 <div className="mb-3">
//                   <img
//                     src={res.imageUrls?.[0] || res.imageUrl}
//                     alt={res.name}
//                     className="w-full h-40 object-cover rounded-lg"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 </div>
//               )}

//               {/* Resource Details */}
//               <div className="space-y-2">
//                 <h3 className="font-semibold text-lg text-gray-800">{res.name}</h3>
//                 <div className="text-sm text-gray-600">
//                   <p><span className="font-medium">Subject:</span> {res.subject || 'N/A'}</p>
//                   <p><span className="font-medium">Quantity Taken:</span> {res.quantityTaken}</p>
//                   <p><span className="font-medium">Condition:</span> 
//                     <span className={`ml-1 px-2 py-1 rounded text-xs ${
//                       res.condition === 'good-new' ? 'bg-green-100 text-green-800' :
//                       res.condition === 'good-used' ? 'bg-yellow-100 text-yellow-800' :
//                       res.condition === 'damaged' ? 'bg-red-100 text-red-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {res.condition || 'N/A'}
//                     </span>
//                   </p>
//                   {res.description && (
//                     <p><span className="font-medium">Description:</span> {res.description}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Return Button */}
//               {res.quantityTaken > 0 && (
//                 <div className="mt-4">
//                   {editingResource?.resourceId !== res.resourceId ? (
//                     <button
//                       onClick={() => startEditing(res)}
//                       className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                     >
//                       Return Resource
//                     </button>
//                   ) : (
//                     /* Return Form */
//                     <div className="mt-3 p-3 border rounded-lg bg-gray-50">
//                       <h4 className="font-medium mb-3">Return Resource</h4>
                      
//                       {/* Quantity to Return */}
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium mb-1">
//                           Quantity to Return (Max: {res.quantityTaken})
//                         </label>
//                         <input
//                           type="number"
//                           name="quantityReturned"
//                           value={form.quantityReturned}
//                           min="1"
//                           max={res.quantityTaken}
//                           onChange={handleChange}
//                           className="w-full border rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                       </div>

//                       {/* Updated Description */}
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium mb-1">
//                           Update Description (Optional)
//                         </label>
//                         <textarea
//                           name="description"
//                           value={form.description}
//                           onChange={handleChange}
//                           placeholder="Enter updated description..."
//                           rows="3"
//                           className="w-full border rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                       </div>

//                       {/* Updated Condition */}
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium mb-1">
//                           Update Condition
//                         </label>
//                         <select
//                           name="condition"
//                           value={form.condition}
//                           onChange={handleChange}
//                           className="w-full border rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         >
                           
//                           <option value="good-new">Good</option>
//                           <option value="good-used">Used</option>
//                           <option value="damaged">Damaged</option>
//                           <option value="over-used">Over Used</option>
//                         </select>
//                       </div>

//                       {/* Updated Images */}
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium mb-1">
//                           Update Images (Optional)
//                         </label>
//                         <input
//                           type="file"
//                           name="images"
//                           onChange={handleChange}
//                           multiple
//                           accept="image/*"
//                           className="w-full border rounded px-3 py-1"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                           Select multiple images to replace current ones
//                         </p>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleReturn(res.resourceId)}
//                           className="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//                         >
//                           Submit Return
//                         </button>
//                         <button
//                           onClick={cancelEditing}
//                           className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "axios";

export default function MyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [form, setForm] = useState({
    description: "",
    condition: "good-new",
    images: null,
    quantityReturned: 1,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch my claimed resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("https://alkhatem-school.onrender.com/api/my-resources", {
        withCredentials: true,
      });
      setResources(res.data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      setError("Failed to fetch your resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Initialize form when editing starts
  const startEditing = (resource) => {
    setEditingResource(resource);
    setForm({
      description: resource.description || "",
      condition: resource.condition || "good-new",
      images: null,
      quantityReturned: 1,
    });
    setError("");
    setSuccess("");
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle resource return + update
  const handleReturn = async (resourceId) => {
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);

      // Validation
      if (form.quantityReturned < 1) {
        setError("Quantity to return must be at least 1");
        return;
      }

      const currentResource = resources.find(r => r.resourceId === resourceId);
      if (form.quantityReturned > currentResource.quantityTaken) {
        setError(`Cannot return more than ${currentResource.quantityTaken} items`);
        return;
      }

      const data = new FormData();
      data.append("resourceId", resourceId);
      data.append("description", form.description);
      data.append("condition", form.condition);
      data.append("quantityReturned", form.quantityReturned);
      
      // Append multiple images if selected
      if (form.images && form.images.length > 0) {
        for (let i = 0; i < form.images.length; i++) {
          data.append("images", form.images[i]);
        }
      }

      const res = await axios.post("https://alkhatem-school.onrender.com/api/return", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update state based on response
      setResources((prev) =>
        prev.map((r) => {
          if (r.resourceId === resourceId) {
            const newQuantityTaken = r.quantityTaken - parseInt(form.quantityReturned);
            return {
              ...r,
              description: form.description,
              condition: form.condition,
              quantityTaken: newQuantityTaken,
              // Update images if new ones were uploaded
              imageUrls: res.data.resource?.imageUrls || r.imageUrls,
            };
          }
          return r;
        }).filter(r => r.quantityTaken > 0) // Remove resources with 0 quantity
      );

      setSuccess(`✨ Successfully returned ${form.quantityReturned} item(s)!`);
      setEditingResource(null);
      setForm({ 
        description: "", 
        condition: "good-new", 
        images: null, 
        quantityReturned: 1 
      });

      // Clear success message after 4 seconds
      setTimeout(() => setSuccess(""), 4000);

    } catch (error) {
      console.error("Failed to return/update resource:", error);
      setError(error.response?.data?.message || "Failed to return resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingResource(null);
    setForm({ 
      description: "", 
      condition: "good-new", 
      images: null, 
      quantityReturned: 1 
    });
    setError("");
    setSuccess("");
  };

  const getConditionStyle = (condition) => {
    const styles = {
      'good-new': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
      'good-used': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
      'damaged': 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200',
      'over-used': 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200'
    };
    return styles[condition] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getConditionIcon = (condition) => {
    const icons = {
      'good-new': '✨',
      'good-used': '👍',
      'damaged': '⚠️',
      'over-used': '🔄'
    };
    return icons[condition] || '📋';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              📚 My Resources
            </h1>
            <p className="text-gray-600">Manage and return your claimed educational resources</p>
          </div>
        </div> */}
        
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 rounded-xl shadow-sm animate-slideIn">
            <div className="flex items-center">
              <span className="text-xl mr-3">❌</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 rounded-xl shadow-sm animate-slideIn">
            <div className="flex items-center">
              <span className="text-xl mr-3">✅</span>
              <span className="font-medium">{success}</span>
            </div>
          </div>
        )}

        {resources.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">No Resources Found</h3>
              <p className="text-gray-600 text-lg">You haven't claimed any resources yet. Browse available resources to get started!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div 
                key={res.resourceId} 
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-[1.02]"
              >
                {/* Resource Image */}
                {(res.imageUrls?.length > 0 || res.imageUrl) && (
                  <div className="mb-6 relative overflow-hidden rounded-xl">
                    <img
                      src={res.imageUrls?.[0] || res.imageUrl}
                      alt={res.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}

                {/* Resource Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {res.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                        📖 {res.subject || 'General'}
                      </span>
                      <span className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold border border-indigo-200">
                        Qty: {res.quantityTaken}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Condition:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionStyle(res.condition)}`}>
                        {getConditionIcon(res.condition)} {res.condition?.replace('-', ' ') || 'N/A'}
                      </span>
                    </div>
                    
                    {res.description && (
                      <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                        <span className="text-gray-600 font-medium block mb-1">Description:</span>
                        <p className="text-gray-700 text-sm leading-relaxed">{res.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Return Button */}
                {res.quantityTaken > 0 && (
                  <div className="mt-6">
                    {editingResource?.resourceId !== res.resourceId ? (
                      <button
                        onClick={() => startEditing(res)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                      >
                        🔄 Return Resource
                      </button>
                    ) : (
                      /* Return Form */
                      <div className="mt-4 p-4 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                        <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                          <span className="mr-2">🔄</span>
                          Return Resource
                        </h4>
                        
                        {/* Quantity to Return */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Quantity to Return (Max: {res.quantityTaken})
                          </label>
                          <input
                            type="number"
                            name="quantityReturned"
                            value={form.quantityReturned}
                            min="1"
                            max={res.quantityTaken}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                          />
                        </div>

                        {/* Updated Description */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Update Description (Optional)
                          </label>
                          <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter updated description..."
                            rows="3"
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-white/80"
                          />
                        </div>

                        {/* Updated Condition */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Update Condition
                          </label>
                          <select
                            name="condition"
                            value={form.condition}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                          >
                            <option value="good-new">✨ Good (New)</option>
                            <option value="good-used">👍 Good (Used)</option>
                            <option value="damaged">⚠️ Damaged</option>
                            <option value="over-used">🔄 Over Used</option>
                          </select>
                        </div>

                        {/* Updated Images */}
                        <div className="mb-6">
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Update Images (Optional)
                          </label>
                          <input
                            type="file"
                            name="images"
                            onChange={handleChange}
                            multiple
                            accept="image/*"
                            className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 transition-all duration-200 bg-white/50"
                          />
                          <p className="text-xs text-gray-500 mt-2 flex items-center">
                            <span className="mr-1">📷</span>
                            Select multiple images to replace current ones
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleReturn(res.resourceId)}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <span className="mr-2">✅</span>
                                Submit Return
                              </>
                            )}
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center"
                          >
                            <span className="mr-2">❌</span>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}