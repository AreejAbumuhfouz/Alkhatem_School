
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   BarChart3,
//   BookOpen,
//   Settings,
//   UserPlus,
//   Menu,
//   X,
//   GraduationCap,
//   Calendar,
//   FileText,
//   Bell,
//   LogOut,
//   ChevronRight,
//   ChevronLeft,
//   Users,
//   PlusCircle,
//   List,
//   ClipboardCheck
// } from 'lucide-react';
// import logo from "../../assets/logo.png"
// import IsAdmin from "../../components/IsAdmin"
// export default function SideBar({ activeTab, setActiveTab }) {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
//   const navigate = useNavigate();

//    const menuItems = [
//     { id: 'overview', label: 'Overview', icon: BarChart3 },
//     { id: 'UsersManagement', label: 'Users Management', icon: UserPlus },
//     { id: 'CreateUserModal', label: 'Create User', icon: Users },
//     { id: 'resources', label: 'Resources Managment', icon: BookOpen },
//     { id: 'addResource', label: 'Add Resource', icon: PlusCircle },
//     { id: 'claimResource', label: 'Claim Resource', icon: ClipboardCheck },
//     { id: 'MyResources', label: 'MyResources', icon: UserPlus },
//     { id: 'ResourceList', label: 'Resource and who took it ', icon: BookOpen },

//   ];

//   const handleSignOut = () => {
//     document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//     navigate('/login');
//   };

//   const handleTabChange = (tabId) => {
//     setActiveTab(tabId);
//     setIsMobileMenuOpen(false); // auto-close on mobile
//   };

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
//   const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

//   return (
//     <>
//       {/* Mobile Toggle Button */}
//       <button
//         onClick={toggleMobileMenu}
//         className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white text-gray-700 rounded-xl shadow-lg border border-gray-200"
//       >
//         {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//       </button>

//       {/* Overlay on Mobile */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed lg:static inset-y-0 left-0 z-50 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white
//           transform transition-transform duration-300 ease-in-out
//           ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//           ${isSidebarCollapsed ? 'w-20' : 'w-72'}
//           shadow-2xl border-r border-white/10
//         `}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-white/10">
//           <div className="flex items-center gap-3">
//               <img src={logo} alt="" className='w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg' />
//             {!isSidebarCollapsed && (
//               <div>
//                 <h2 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
//                   Al Khatem
//                 </h2>
//                 <p className="text-xs text-blue-200">School Management</p>
//               </div>
//             )}
//           </div>

//           {/* Collapse/Expand Button */}
//           <button onClick={toggleSidebar} className="text-white ml-auto">
//             {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = activeTab === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleTabChange(item.id)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group
//                   ${isActive
//                     ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
//                     : 'text-blue-100 hover:bg-white/10 hover:text-white hover:transform hover:scale-105'
//                   }
//                 `}
//               >
//                 <div className={`w-8 h-8 flex items-center justify-center rounded-lg
//                   ${isActive ? 'bg-white/20' : 'group-hover:bg-white/10 text-blue-300 group-hover:text-white'}
//                 `}>
//                   <Icon className="w-5 h-5" />
//                 </div>
//                 {!isSidebarCollapsed && (
//                   <span className="font-medium flex-1">{item.label}</span>
//                 )}
//                 {isActive && !isSidebarCollapsed && (
//                   <ChevronRight className="w-4 h-4 text-white/80" />
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-white/10">
          
//           <button
//             onClick={handleSignOut}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 group ${isSidebarCollapsed ? 'justify-center' : ''}`}
//           >
//             <div className="flex items-center justify-center w-8 h-8 rounded-lg text-red-400 group-hover:text-red-300 group-hover:bg-red-500/20 transition-all duration-200">
//               <LogOut className="w-5 h-5" />
//             </div>
//             {!isSidebarCollapsed && <span className="font-medium">Sign Out</span>}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  UserPlus,
  Users,
  PlusCircle,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import logo from "../../assets/Logo.png";
import IsAdmin from "../../components/IsAdmin";




  
      
      
    
export default function SideBar({ activeTab, setActiveTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    // Admin-only tabs
    { id: 'UsersManagement', label: 'Users Management', icon: UserPlus, adminOnly: true },
    { id: 'CreateUserModal', label: 'Create User', icon: Users, adminOnly: true },
    { id: 'resources', label: 'Resources Management', icon: BookOpen, adminOnly: true },
    { id: 'addResource', label: 'Add Resource', icon: PlusCircle, adminOnly: true },
    // Visible to all
    { id: 'claimResource', label: 'Claim Resource', icon: ClipboardCheck },
    { id: 'MyResources', label: 'My Resources', icon: UserPlus },
    { id: 'ResourceList', label: 'Resource & Who Took It', icon: BookOpen, adminOnly: true },
  ];

  const handleSignOut = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // auto-close on mobile
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white text-gray-700 rounded-xl shadow-lg border border-gray-200"
      >
        {isMobileMenuOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Overlay on Mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarCollapsed ? 'w-20' : 'w-72'}
          shadow-2xl border-r border-white/10
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg" />
            {!isSidebarCollapsed && (
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Al Khatem
                </h2>
                <p className="text-xs text-blue-200">School Management</p>
              </div>
            )}
          </div>

          {/* Collapse/Expand Button */}
          <button onClick={toggleSidebar} className="text-white ml-auto">
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.adminOnly) {
              // Render only if admin
              return (
                <IsAdmin key={item.id}>
                  <SidebarItem
                    item={item}
                    activeTab={activeTab}
                    isSidebarCollapsed={isSidebarCollapsed}
                    handleTabChange={handleTabChange}
                  />
                </IsAdmin>
              );
            } else {
              return (
                <SidebarItem
                  key={item.id}
                  item={item}
                  activeTab={activeTab}
                  isSidebarCollapsed={isSidebarCollapsed}
                  handleTabChange={handleTabChange}
                />
              );
            }
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 group ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg text-red-400 group-hover:text-red-300 group-hover:bg-red-500/20 transition-all duration-200">
              <LogOut className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
}

// Sidebar item component
function SidebarItem({ item, activeTab, isSidebarCollapsed, handleTabChange }) {
  const Icon = item.icon;
  const isActive = activeTab === item.id;
  return (
    <button
      onClick={() => handleTabChange(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group
        ${isActive
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
          : 'text-blue-100 hover:bg-white/10 hover:text-white hover:transform hover:scale-105'
        }
      `}
    >
      <div className={`w-8 h-8 flex items-center justify-center rounded-lg
        ${isActive ? 'bg-white/20' : 'group-hover:bg-white/10 text-blue-300 group-hover:text-white'}
      `}>
        <Icon className="w-5 h-5" />
      </div>
      {!isSidebarCollapsed && (
        <span className="font-medium flex-1">{item.label}</span>
      )}
      {isActive && !isSidebarCollapsed && (
        <ChevronRight className="w-4 h-4 text-white/80" />
      )}
    </button>
  );
}
