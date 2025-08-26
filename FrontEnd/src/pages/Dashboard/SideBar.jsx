

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  // BarChart3,
  // BookOpen,
  // UserPlus,
  // Users,
  // PlusCircle,
  // ClipboardCheck,
  // ChevronRight,
  // ChevronLeft,
  // LogOut,

           Home,
  Users,
  UserPlus,
  BookOpen,
  Plus,
  FileCheck,
  FolderOpen,
  List,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Settings,
  Bell
          
} from 'lucide-react';
import logo from "../../assets/Logo.png";
import IsAdmin from "../../components/IsAdmin";




  
      
      
    
export default function SideBar({ activeTab, setActiveTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const navigate = useNavigate();

          const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home, description: 'Overview & Analytics' },
    
    // Admin Management Section
    { 
      id: 'UsersManagement', 
      label: 'Manage Users', 
      icon: Users, 
      adminOnly: true,
      description: 'View & edit users',
      section: 'User Management'
    },
    { 
      id: 'CreateUserModal', 
      label: 'Add New User', 
      icon: UserPlus, 
      adminOnly: true,
      description: 'Create user accounts',
      section: 'User Management'
    },
    
    // Resource Management Section
    { 
      id: 'resources', 
      label: 'All Resources', 
      icon: BookOpen, 
      adminOnly: true,
      description: 'Manage all resources',
      section: 'Resource Management'
    },
    { 
      id: 'addResource', 
      label: 'Add Resource', 
      icon: Plus, 
      adminOnly: true,
      description: 'Create new resource',
      section: 'Resource Management'
    },
    { 
      id: 'ResourceList', 
      label: 'Resource Status', 
      icon: List, 
      adminOnly: true,
      description: 'Track resource usage',
      section: 'Resource Management'
    },
    
    // User Actions Section
    { 
      id: 'claimResource', 
      label: 'Request Resource', 
      icon: FileCheck,
      description: 'Submit resource requests',
      section: 'My Activities'
    },
    { 
      id: 'MyResources', 
      label: 'My Resources', 
      icon: FolderOpen,
      description: 'View your resources',
      section: 'My Activities'
    },
  ];

  // const menuItems = [
  //   { id: 'overview', label: 'Overview', icon: Home },
  //   // Admin-only tabs
  //   { id: 'UsersManagement', label: 'Users Management', icon: Users, adminOnly: true },
  //   { id: 'CreateUserModal', label: 'Create User', icon: UserPlus, adminOnly: true },
  //   { id: 'resources', label: 'Resources Management', icon: BookOpen, adminOnly: true },
  //   { id: 'addResource', label: 'Add Resource', icon: PlusCircle, adminOnly: true },
  //   // Visible to all
  //   { id: 'ResourceList', label: 'Resource & Who Took It', icon: List, adminOnly: true },
  //   { id: 'claimResource', label: 'Claim Resource', icon: FileCheck },
  //   { id: 'MyResources', label: 'My Resources', icon: FolderOpen },
  // ];

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
        <div className="flex items-center justify-between p-4 border-b border-white/10 pt-3">
          <div className="flex items-center gap-3">
            {/* <img src={logo} alt="" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg" /> */}
            {!isSidebarCollapsed && (
              <div className='flex gap-4 '>
                <img src={logo} alt="" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg" />
                <div>

                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Al Khatem
                </h2>
                <p className="text-xs text-blue-200">School Management</p>
                </div>
              </div>
            )}
          </div>

          {/* Collapse/Expand Button */}
          <button onClick={toggleSidebar} className="text-white ml-auto pt-6">
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


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Home,
//   Users,
//   UserPlus,
//   BookOpen,
//   Plus,
//   FileCheck,
//   FolderOpen,
//   List,
//   ChevronRight,
//   ChevronLeft,
//   LogOut,
//   Settings,
//   Bell
// } from 'lucide-react';
// import logo from "../../assets/Logo.png";
// import IsAdmin from "../../components/IsAdmin";

// export default function SideBar({ activeTab, setActiveTab }) {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const navigate = useNavigate();

//   const menuItems = [
//     { id: 'overview', label: 'Dashboard', icon: Home, description: 'Overview & Analytics' },
    
//     // Admin Management Section
//     { 
//       id: 'UsersManagement', 
//       label: 'Manage Users', 
//       icon: Users, 
//       adminOnly: true,
//       description: 'View & edit users',
//       section: 'User Management'
//     },
//     { 
//       id: 'CreateUserModal', 
//       label: 'Add New User', 
//       icon: UserPlus, 
//       adminOnly: true,
//       description: 'Create user accounts',
//       section: 'User Management'
//     },
    
//     // Resource Management Section
//     { 
//       id: 'resources', 
//       label: 'All Resources', 
//       icon: BookOpen, 
//       adminOnly: true,
//       description: 'Manage all resources',
//       section: 'Resource Management'
//     },
//     { 
//       id: 'addResource', 
//       label: 'Add Resource', 
//       icon: Plus, 
//       adminOnly: true,
//       description: 'Create new resource',
//       section: 'Resource Management'
//     },
//     { 
//       id: 'ResourceList', 
//       label: 'Resource Status', 
//       icon: List, 
//       adminOnly: true,
//       description: 'Track resource usage',
//       section: 'Resource Management'
//     },
    
//     // User Actions Section
//     { 
//       id: 'claimResource', 
//       label: 'Request Resource', 
//       icon: FileCheck,
//       description: 'Submit resource requests',
//       section: 'My Activities'
//     },
//     { 
//       id: 'MyResources', 
//       label: 'My Resources', 
//       icon: FolderOpen,
//       description: 'View your resources',
//       section: 'My Activities'
//     },
//   ];

//   const handleSignOut = () => {
//     document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//     navigate('/login');
//   };

//   const handleTabChange = (tabId) => {
//     setActiveTab(tabId);
//     setIsMobileMenuOpen(false);
//   };

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
//   const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

//   // Group menu items by section
//   const groupedItems = menuItems.reduce((acc, item) => {
//     const section = item.section || 'General';
//     if (!acc[section]) acc[section] = [];
//     acc[section].push(item);
//     return acc;
//   }, {});

//   return (
//     <>
//       {/* Mobile Toggle Button - Enhanced */}
//       <button
//         onClick={toggleMobileMenu}
//         className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white text-gray-700 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-200"
//       >
//         {isMobileMenuOpen ? (
//           <ChevronLeft className="w-5 h-5" />
//         ) : (
//           <div className="flex items-center gap-2">
//             <ChevronRight className="w-5 h-5" />
//             <span className="text-sm font-medium">Menu</span>
//           </div>
//         )}
//       </button>

//       {/* Overlay on Mobile - Enhanced */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar - Enhanced */}
//       <div
//         className={`
//           fixed lg:static inset-y-0 left-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white
//           transform transition-all duration-300 ease-out
//           ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//           ${isSidebarCollapsed ? 'w-20' : 'w-80'}
//           shadow-2xl border-r border-white/10 backdrop-blur-xl
//         `}
//       >
//         {/* Header - Enhanced */}
//         <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <img 
//                 src={logo} 
//                 alt="Al Khatem School" 
//                 className="w-12 h-12 bg-white rounded-2xl p-1 shadow-xl ring-2 ring-white/20" 
//               />
//               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
//             </div>
//             {!isSidebarCollapsed && (
//               <div className="flex flex-col">
//                 <h2 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
//                   Al Khatem School
//                 </h2>
//                 <p className="text-sm text-blue-200/80 font-medium">Resource Management System</p>
//               </div>
//             )}
//           </div>

//           {/* Collapse/Expand Button - Enhanced */}
//           <button 
//             onClick={toggleSidebar} 
//             className="hidden lg:flex items-center justify-center w-10 h-10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
//           >
//             {isSidebarCollapsed ? (
//               <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
//             ) : (
//               <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
//             )}
//           </button>
//         </div>

//         {/* Quick Actions Bar - Only when expanded */}
//         {!isSidebarCollapsed && (
//           <div className="px-6 py-4 border-b border-white/10 bg-white/5">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-blue-200">Quick Actions</span>
//               <div className="flex gap-2">
//                 <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
//                   <Bell className="w-4 h-4 text-blue-300" />
//                 </button>
//                 <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
//                   <Settings className="w-4 h-4 text-blue-300" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation - Enhanced with sections */}
//         <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
//           {Object.entries(groupedItems).map(([sectionName, items]) => (
//             <div key={sectionName} className="space-y-2">
//               {!isSidebarCollapsed && (
//                 <h3 className="text-xs font-semibold text-blue-300/80 uppercase tracking-wider px-3 py-2">
//                   {sectionName}
//                 </h3>
//               )}
//               {items.map((item) => {
//                 if (item.adminOnly) {
//                   return (
//                     <IsAdmin key={item.id}>
//                       <SidebarItem
//                         item={item}
//                         activeTab={activeTab}
//                         isSidebarCollapsed={isSidebarCollapsed}
//                         handleTabChange={handleTabChange}
//                       />
//                     </IsAdmin>
//                   );
//                 } else {
//                   return (
//                     <SidebarItem
//                       key={item.id}
//                       item={item}
//                       activeTab={activeTab}
//                       isSidebarCollapsed={isSidebarCollapsed}
//                       handleTabChange={handleTabChange}
//                     />
//                   );
//                 }
//               })}
//             </div>
//           ))}
//         </nav>

//         {/* User Profile Section - When expanded */}
//         {!isSidebarCollapsed && (
//           <div className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-800/50 to-blue-900/50">
//             <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
//                 U
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-white truncate">Current User</p>
//                 <p className="text-xs text-blue-200 truncate">user@alkhatem.edu</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Footer - Enhanced Sign Out */}
//         <div className="p-4 border-t border-white/10">
//           <button
//             onClick={handleSignOut}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200 group border border-red-500/20 hover:border-red-400/40 ${
//               isSidebarCollapsed ? 'justify-center' : ''
//             }`}
//           >
//             <div className="flex items-center justify-center w-10 h-10 rounded-xl text-red-400 group-hover:text-red-300 group-hover:bg-red-500/20 transition-all duration-200 shadow-sm">
//               <LogOut className="w-5 h-5" />
//             </div>
//             {!isSidebarCollapsed && (
//               <div className="flex-1">
//                 <span className="font-medium">Sign Out</span>
//                 <p className="text-xs text-red-400/70">End your session</p>
//               </div>
//             )}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// // Enhanced Sidebar Item Component
// function SidebarItem({ item, activeTab, isSidebarCollapsed, handleTabChange }) {
//   const Icon = item.icon;
//   const isActive = activeTab === item.id;

//   return (
//     <button
//       onClick={() => handleTabChange(item.id)}
//       className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden
//         ${isActive
//           ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl border border-blue-400/30 transform scale-[1.02]'
//           : 'text-blue-100 hover:bg-white/10 hover:text-white hover:transform hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-white/10'
//         }
//       `}
//     >
//       {/* Active indicator */}
//       {isActive && (
//         <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 to-indigo-300 rounded-r-full"></div>
//       )}
      
//       <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0
//         ${isActive 
//           ? 'bg-white/20 shadow-lg' 
//           : 'bg-white/5 group-hover:bg-white/15 text-blue-300 group-hover:text-white'
//         }
//       `}>
//         <Icon className="w-5 h-5" />
//       </div>
      
//       {!isSidebarCollapsed && (
//         <div className="flex-1 min-w-0">
//           <span className="font-medium block truncate">{item.label}</span>
//           {item.description && (
//             <p className={`text-xs truncate transition-colors duration-200 ${
//               isActive ? 'text-blue-100' : 'text-blue-300/70 group-hover:text-blue-200'
//             }`}>
//               {item.description}
//             </p>
//           )}
//         </div>
//       )}
      
//       {isActive && !isSidebarCollapsed && (
//         <ChevronRight className="w-4 h-4 text-white/80 flex-shrink-0" />
//       )}

//       {/* Tooltip for collapsed state */}
//       {isSidebarCollapsed && (
//         <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-700">
//           <div className="font-medium">{item.label}</div>
//           {item.description && (
//             <div className="text-xs text-gray-300">{item.description}</div>
//           )}
//           <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45"></div>
//         </div>
//       )}
//     </button>
//   );
// }
