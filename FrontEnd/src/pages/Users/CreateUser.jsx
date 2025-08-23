// import React, { useState } from "react";
// import { X, User, Mail, Lock, Users, BookOpen, Check, AlertCircle, UserPlus, Eye, EyeOff } from "lucide-react";

// export default function  CreateUserModal()  {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "teacher",
//     subject_taught: "",
//   });

//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     }
    
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }
    
//     if (!formData.password.trim()) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setIsLoading(true);
//     setMessage("");
    
//     try {
//       const response = await fetch("http://localhost:5000/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage(data.message || "User created successfully!");
        
//         // Reset form after successful creation
//         setTimeout(() => {
//           setFormData({
//             name: "",
//             email: "",
//             password: "",
//             role: "teacher",
//             subject_taught: "",
//           });
//           setMessage("");
//           setErrors({});
//           // onClose();
//         }, 2000);
//       } else {
//         setMessage(data.message || "Error during user creation.");
//       }
      
//     } catch (error) {
//       setMessage(error.message || "Error during user creation. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleClose = () => {
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       role: "teacher",
//       subject_taught: "",
//     });
//     setMessage("");
//     setErrors({});
//     setShowPassword(false);
//   };


//   return (
   
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4 border border-gray-100">
//         {/* Header with Gradient */}
//         <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-8 rounded-t-3xl">
//           <div className="absolute inset-0 bg-white/10 rounded-t-3xl"></div>
//           <div className="relative flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
//                 <UserPlus size={24} className="text-white" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-white">Create New User</h2>
//                 <p className="text-blue-100 mt-1">Add a new member to your team</p>
//               </div>
//             </div>
//             <button
//               onClick={handleClose}
//               className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
//             >
//               <X size={20} className="text-white group-hover:text-blue-100" />
//             </button>
//           </div>
//         </div>

//         {/* Success/Error Message */}
//         {message && (
//           <div className={`mx-8 mt-6 p-4 rounded-xl flex items-center gap-3 ${
//             message.toLowerCase().includes("error")
//               ? "bg-red-50 text-red-700 border border-red-200 shadow-sm"
//               : "bg-green-50 text-green-700 border border-green-200 shadow-sm"
//           }`}>
//             {message.toLowerCase().includes("error") ? (
//               <AlertCircle size={18} className="flex-shrink-0" />
//             ) : (
//               <Check size={18} className="flex-shrink-0" />
//             )}
//             <span className="text-sm font-medium">{message}</span>
//           </div>
//         )}

//         {/* Form */}
//         <div className="p-8 space-y-6">
//           {/* Name Field */}
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
//               <User size={16} className="text-blue-600" />
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter full name"
//               className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md`}
//             />
//             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//           </div>

//           {/* Email Field */}
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
//               <Mail size={16} className="text-blue-600" />
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter email address"
//               className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md`}
//             />
//             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//           </div>

//           {/* Password Field */}
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
//               <Lock size={16} className="text-blue-600" />
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Create a secure password"
//                 className={`w-full px-4 py-3 pr-12 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//           </div>

//           {/* Role Field */}
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
//               <Users size={16} className="text-blue-600" />
//               Role
//             </label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white cursor-pointer shadow-sm hover:shadow-md"
//             >
//               <option value="teacher">👨‍🏫 Teacher</option>
//               <option value="admin">⚡ Administrator</option>
//             </select>
//           </div>

//           {/* Subject Field */}
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
//               <BookOpen size={16} className="text-blue-600" />
//               Subject Taught
//               <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full">(Optional)</span>
//             </label>
//             <input
//               type="text"
//               name="subject_taught"
//               value={formData.subject_taught}
//               onChange={handleChange}
//               placeholder="e.g., Mathematics, English, Science"
//               className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-4 pt-4">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02]"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Creating...
//                 </>
//               ) : (
//                 <>
//                   <UserPlus size={18} />
//                   Create User
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//   );
// };


import React, { useState } from "react";
import { 
  X, User, Mail, Lock, Users, BookOpen, Check, AlertCircle, UserPlus, Eye, EyeOff 
} from "lucide-react";

export default function CreateUserModal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "teacher",
    subject_taught: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://alkhatem-school.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "User created successfully!");
        setTimeout(() => handleClose(), 2000);
      } else {
        setMessage(data.message || "Error during user creation.");
      }
    } catch (error) {
      setMessage(error.message || "Error during user creation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", password: "", role: "teacher", subject_taught: "" });
    setMessage("");
    setErrors({});
    setShowPassword(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">

    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4 border border-gray-100">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-8 rounded-t-3xl">
        <div className="absolute inset-0 bg-white/10 rounded-t-3xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <UserPlus size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create New User</h2>
              <p className="text-blue-100 mt-1">Add a new member to your team</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
          >
            <X size={20} className="text-white group-hover:text-blue-100" />
          </button>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mx-8 mt-6 p-4 rounded-xl flex items-center gap-3 ${
          message.toLowerCase().includes("error")
            ? "bg-red-50 text-red-700 border border-red-200 shadow-sm"
            : "bg-green-50 text-green-700 border border-green-200 shadow-sm"
        }`}>
          {message.toLowerCase().includes("error") ? <AlertCircle size={18} /> : <Check size={18} />}
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      {/* Form */}
      <form className="p-8 space-y-6" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <User size={16} className="text-blue-600" /> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Mail size={16} className="text-blue-600" /> Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Lock size={16} className="text-blue-600" /> Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a secure password"
              className={`w-full px-4 py-3 pr-12 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Users size={16} className="text-blue-600" /> Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 cursor-pointer shadow-sm hover:shadow-md"
          >
            <option value="teacher">👨‍🏫 Teacher</option>
            <option value="admin">⚡ Administrator</option>
          </select>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen size={16} className="text-blue-600" /> Subject Taught
            <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full">(Optional)</span>
          </label>
          <input
            type="text"
            name="subject_taught"
            value={formData.subject_taught}
            onChange={handleChange}
            placeholder="e.g., Mathematics, English, Science"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create User
              </>
            )}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
