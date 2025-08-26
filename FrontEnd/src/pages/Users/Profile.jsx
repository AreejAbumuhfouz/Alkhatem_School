import { useState, useEffect, useRef } from "react";
import { User, LogOut, Edit3, Check, X, Lock, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

export default function ProfileMenu({ user, handleSignOut }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const dropdownRef = useRef(null);

  // Reset fields when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && !isEditing) {
      setName(user?.name || "");
      setPassword("");
      setMessage("");
      setMessageType("");
    }
  }, [isDropdownOpen, user, isEditing]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsEditing(false);
        setMessage("");
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage("");
    setMessageType("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(user?.name || "");
    setPassword("");
    setMessage("");
    setMessageType("");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage("Name cannot be empty");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const res = await axios.patch(
  "https://alkhatem-school.onrender.com/api/currentprofile",
//   "http://localhost:5000/api/currentprofile",
  { 
    name: name.trim(), 
    password: password 
  },
  { withCredentials: true }
);
      
      setMessage(res.data.message || "Profile updated successfully!");
      setMessageType("success");
      setPassword("");
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-2 relative" ref={dropdownRef}>
      {/* Profile Settings Button */}
      <button
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
          if (isDropdownOpen) {
            setIsEditing(false);
            setMessage("");
          }
        }}
        className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
          <span className="text-sm">Profile Settings</span>
        </div>
        {isDropdownOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        )}
      </button>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div className="mt-1 mx-2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg animate-slideDown">
          <div className="p-4 space-y-4">
            {/* Message Display */}
            {message && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                messageType === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {messageType === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}

            {/* Profile Information */}
            <div className="space-y-3">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                    disabled={loading}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-800">
                    {user?.name}
                  </div>
                )}
              </div>

              {/* Password Field */}
              {isEditing && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave empty to keep current"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Only fill if you want to change your password
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading || !name.trim()}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}


      

      <style jsx>{`
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}