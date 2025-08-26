
// import { useState ,useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   BarChart3, 
//   BookOpen, 
//   Settings, 
//   UserPlus, 
//   Menu, 
//   X, 
//   GraduationCap,
//   Home as HomeIcon,
//   Users,
//   Calendar,
//   FileText,
//   Bell,
//   LogOut,
//   ChevronRight,
//   Search,
//   User,
//   ChevronDown,
//   Shield,
//   Clock 

// } from 'lucide-react';
// import axios from 'axios';
// import AdminNotifications from '../ResourcesDash/AdminNotifications';
// export default function Header(){
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [user, setUser] = useState(null); // to store the user data
//   const [loading, setLoading] = useState(true); // loading state
//   const [error, setError] = useState(null); // error state
//   const navigate = useNavigate();
//   const [date, setDate] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setDate(new Date());
//     }, 1000); // update every second

//     return () => clearInterval(timer); // cleanup
//   }, []);

//   const formattedDate = date.toLocaleDateString('en-US', {
//     timeZone: 'Asia/Dubai',
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });

//   const formattedTime = date.toLocaleTimeString('en-US', {
//     timeZone: 'Asia/Dubai',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true,
//   });

//  useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get('https://alkhatem-school.onrender.com/api/profile', {
//           withCredentials: true, 
//         });
//         setUser(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Something went wrong');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   if (loading) return <p className="text-center text-gray-500"></p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

 
//    const handleSignOut = () => {
//     document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//     navigate('/login');
//   };
//   return (
//     <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm sticky top-0 z-30">
//       <div className="flex items-center justify-between px-6 py-4">
        
//         {/* Search Bar */}
//         <div className="flex-1 max-w-2xl">
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search students, classes, reports..."
//               className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
//             />
//           </div>
//         </div>
//                 <div className="flex items-center gap-4 ml-6">


//  <div className="text-right p-4 bg-white rounded-xl shadow-sm">
//       <p className="text-sm text-gray-600 font-medium flex items-center justify-end gap-2">
//         <Calendar className="w-4 h-4 text-blue-500" />
//         <span>{formattedDate}</span>
//         <Clock className="w-4 h-4 text-yellow-500 ml-3" />
//         <span className="text-gray-800">{formattedTime}</span>
//       </p>
//     </div>

          
//       <AdminNotifications adminId={user.id} />
          

//           {/* Profile Dropdown */}
//           <div className="relative">
           

//         <button
//         onClick={() => setShowProfile(!showProfile)}
//         className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-2xl transition-all duration-200"
//       >
//         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
//           {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
//         </div>
//         <div className="hidden md:block text-left">
//           <p className="text-sm font-semibold text-gray-800">
//             {user?.name }
//           </p>
//           <p className="text-xs text-gray-500">
//             {user?.role}
            
            
            
//           </p>
//         </div>
//         <ChevronDown className="w-4 h-4 text-gray-400" />
//       </button>


//             {showProfile && (
//               <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
//                 <div className="p-4 border-b border-gray-100 bg-gray-50">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold">
//                       {user?.name?.slice(0, 2).toUpperCase()}
//                      </div>
//                     <div>
//                       <p className="font-semibold text-gray-800">{user?.name }</p>
//                       <p className="text-sm text-gray-500">{user?.email}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="py-2">
//                   <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3">
//                     <User className="w-4 h-4" />
//                     <span className="text-sm">Profile Settings</span>
//                   </button>
//                   <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3">
//                     <Shield className="w-4 h-4" />
//                     <span className="text-sm">Security</span>
//                   </button>
//                   <hr className="my-2" />
//                   <button 
//                    onClick={handleSignOut}
//                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center gap-3">
//                     <LogOut className="w-4 h-4" />

                    
//                     <span className="text-sm">Sign Out</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
import { useState ,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  BookOpen, 
  Settings, 
  UserPlus, 
  Menu, 
  X, 
  GraduationCap,
  Home as HomeIcon,
  Users,
  Calendar,
  FileText,
  Bell,
  LogOut,
  ChevronRight,
  Search,
  User,
  ChevronDown,
  Shield,
  Clock 
} from 'lucide-react';
import axios from 'axios';
import AdminNotifications from '../ResourcesDash/AdminNotifications';
import IsAdmin from "../../components/IsAdmin";
import UpdateProfileModal from "../Users/Profile";

export default function Header(){
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null); // to store the user data
  const [error, setError] = useState(null); // error state
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000); // update every second
    return () => clearInterval(timer);
  }, []);

  const formattedDate = date.toLocaleDateString('en-US', {
    timeZone: 'Asia/Dubai',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://alkhatem-school.onrender.com/api/profile', {
          withCredentials: true, 
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students, classes, reports..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-6">
          <div className="text-right p-4 bg-white rounded-xl shadow-sm">
            <p className="text-sm text-gray-600 font-medium flex items-center justify-end gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{formattedDate}</span>
              <Clock className="w-4 h-4 text-yellow-500 ml-3" />
              <span className="text-gray-800">{formattedTime}</span>
            </p>
          </div>
          <IsAdmin key="true">
          <AdminNotifications adminId={user?.id} />
            
          </IsAdmin>


          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-2xl transition-all duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.slice(0, 2).toUpperCase() }
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold">
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <UpdateProfileModal/>
                  
                  <hr className="my-2" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
