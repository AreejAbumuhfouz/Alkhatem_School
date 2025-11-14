
// // import React, { useEffect, useState } from 'react';
// // import { Navigate } from 'react-router-dom';
// // import { BookOpen, GraduationCap, Users, Calendar } from 'lucide-react';
// // import logo from "../assets/Logo.png"

// // const SchoolLoadingSpinner = () => {
// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
// //       <div className="text-center">
// //         {/* Main Loading Animation */}
// //         <div className="relative mb-8">
// //           {/* Outer rotating ring */}
// //           <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          
// //           {/* Inner pulsing circle */}
// //           <div className="absolute inset-0 flex items-center justify-center">
// //             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse flex items-center justify-center">
              
// //             </div>
// //           </div>
// //         </div>

// //         {/* School-themed floating icons */}
// //         <div className="relative mb-8">
// //           <div className="absolute -top-4 -left-8 animate-float-1">
// //             <GraduationCap className="w-6 h-6 text-indigo-400 opacity-70" />
// //           </div>
// //           <div className="absolute -top-2 -right-8 animate-float-2">
// //             <Users className="w-5 h-5 text-purple-400 opacity-60" />
// //           </div>
// //           <div className="absolute -bottom-2 left-0 animate-float-3">
// //             <Calendar className="w-5 h-5 text-blue-400 opacity-50" />
// //           </div>
// //         </div>

// //         {/* Loading text with typewriter effect */}
// //         <div className="space-y-3">
// //           <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
// //              Al khatem School
// //           </h2>
         
// //         </div>

// //         {/* Progress dots */}
// //         <div className="flex justify-center space-x-2 mt-6">
// //           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
// //           <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
// //           <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
// //         </div>

// //         {/* Decorative elements */}
// //         <div className="absolute top-20 left-20 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-30"></div>
// //         <div className="absolute bottom-32 right-24 w-3 h-3 bg-indigo-300 rounded-full animate-ping opacity-20" style={{animationDelay: '1s'}}></div>
// //         <div className="absolute top-40 right-16 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40" style={{animationDelay: '2s'}}></div>
// //       </div>

// //       {/* <style jsx>{`
// //         @keyframes float-1 {
// //           0%, 100% { transform: translateY(0px) rotate(0deg); }
// //           50% { transform: translateY(-10px) rotate(5deg); }
// //         }
// //         @keyframes float-2 {
// //           0%, 100% { transform: translateY(0px) rotate(0deg); }
// //           50% { transform: translateY(-15px) rotate(-5deg); }
// //         }
// //         @keyframes float-3 {
// //           0%, 100% { transform: translateY(0px) rotate(0deg); }
// //           50% { transform: translateY(-8px) rotate(3deg); }
// //         }
// //         .animate-float-1 {
// //           animation: float-1 3s ease-in-out infinite;
// //         }
// //         .animate-float-2 {
// //           animation: float-2 2.5s ease-in-out infinite;
// //         }
// //         .animate-float-3 {
// //           animation: float-3 4s ease-in-out infinite;
// //         }
// //       `}</style> */}

// //       <style>
// // {`
// //   @keyframes float-1 {
// //     0%, 100% { transform: translateY(0px) rotate(0deg); }
// //     50% { transform: translateY(-10px) rotate(5deg); }
// //   }
// //   @keyframes float-2 {
// //     0%, 100% { transform: translateY(0px) rotate(0deg); }
// //     50% { transform: translateY(-15px) rotate(-5deg); }
// //   }
// //   @keyframes float-3 {
// //     0%, 100% { transform: translateY(0px) rotate(0deg); }
// //     50% { transform: translateY(-8px) rotate(3deg); }
// //   }
// //   .animate-float-1 {
// //     animation: float-1 3s ease-in-out infinite;
// //   }
// //   .animate-float-2 {
// //     animation: float-2 2.5s ease-in-out infinite;
// //   }
// //   .animate-float-3 {
// //     animation: float-3 4s ease-in-out infinite;
// //   }
// // `}
// // </style>

// //     </div>
// //   );
// // };

// // const ProtectedRoute = ({ children }) => {
// //   const [checkingAuth, setCheckingAuth] = useState(true);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);


// // useEffect(() => {
// //   const verifyAuth = async () => {
// //     try {
// //       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
// //         method: 'GET',
// //         credentials: 'include',
// //       });

// //       setIsAuthenticated(res.ok);
// //     } catch (err) {
// //       console.error('Auth error:', err);
// //       setIsAuthenticated(false);
// //     } finally {
// //       setCheckingAuth(false);
// //     }
// //   };

// //   verifyAuth();
// // }, []);


// //   if (checkingAuth) {
// //     return <SchoolLoadingSpinner />;
// //   }

// //   return isAuthenticated ? children : <Navigate to="/login" replace />;
// // };

// // export default ProtectedRoute;

// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { GraduationCap, Users, Calendar } from 'lucide-react';
// import logo from "../assets/Logo.png";

// // Loading spinner component
// const SchoolLoadingSpinner = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//       <div className="text-center relative">
//         {/* Rotating ring */}
//         <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-8"></div>

//         {/* Inner pulsing circle */}
//         <div className="absolute inset-0 top-[105px] flex items-center justify-center">
//           <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
//         </div>

//         {/* Floating icons */}
//         <div className="relative mb-8">
//           <div className="absolute -top-4 -left-8 animate-float-1">
//             <GraduationCap className="w-6 h-6 text-indigo-400 opacity-70" />
//           </div>
//           <div className="absolute -top-2 -right-8 animate-float-2">
//             <Users className="w-5 h-5 text-purple-400 opacity-60" />
//           </div>
//           <div className="absolute -bottom-2 left-0 animate-float-3">
//             <Calendar className="w-5 h-5 text-blue-400 opacity-50" />
//           </div>
//         </div>

//         <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
//           Al Khatem School
//         </h2>

//         {/* Progress dots */}
//         <div className="flex justify-center space-x-2 mt-6">
//           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
//           <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//           <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//         </div>

//         {/* Floating animations */}
//         <style>{`
//           @keyframes float-1 {
//             0%, 100% { transform: translateY(0px) rotate(0deg); }
//             50% { transform: translateY(-10px) rotate(5deg); }
//           }
//           @keyframes float-2 {
//             0%, 100% { transform: translateY(0px) rotate(0deg); }
//             50% { transform: translateY(-15px) rotate(-5deg); }
//           }
//           @keyframes float-3 {
//             0%, 100% { transform: translateY(0px) rotate(0deg); }
//             50% { transform: translateY(-8px) rotate(3deg); }
//           }
//           .animate-float-1 {
//             animation: float-1 3s ease-in-out infinite;
//           }
//           .animate-float-2 {
//             animation: float-2 2.5s ease-in-out infinite;
//           }
//           .animate-float-3 {
//             animation: float-3 4s ease-in-out infinite;
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// // Protected route
// // const ProtectedRoute = ({ children }) => {
// //   const [checkingAuth, setCheckingAuth] = useState(true);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// // useEffect(() => {
// //   const verifyAuth = async () => {
// //     try {
// //       console.log('API URL:', import.meta.env.VITE_API_URL); // Check URL
// //       console.log('Cookies:', document.cookie); // Check if cookies exist
      
// //       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
// //         method: 'GET',
// //         credentials: 'include',
// //       });

// //       console.log('Response status:', res.status);
// //       console.log('Response headers:', res.headers);
      
// //       const data = await res.json();
// //       console.log('Response data:', data);
      
// //       if (res.ok && data.user) {
// //         setIsAuthenticated(true);
// //       } else {
// //         setIsAuthenticated(false);
// //       }
// //     } catch (err) {
// //       console.error('Auth error:', err);
// //       setIsAuthenticated(false);
// //     } finally {
// //       setCheckingAuth(false);
// //     }
// //   };

// //   verifyAuth();
// // }, []);

// //   if (checkingAuth) {
// //     return <SchoolLoadingSpinner />;
// //   }

// //   return isAuthenticated ? children : <Navigate to="/login" replace />;
// // };

// // export default ProtectedRoute;
// const ProtectedRoute = ({ children }) => {
//   const [checkingAuth, setCheckingAuth] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const verifyAuth = async () => {
//       try {
//         console.log("API URL:", import.meta.env.VITE_API_URL);
//         console.log("Cookies:", document.cookie);

//         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
//           method: "GET",
//           credentials: "include",
//         });

//         console.log("Response status:", res.status);
//         const data = await res.json();
//         console.log("Response data:", data);

//         if (res.ok && data.user) {
//           setIsAuthenticated(true);
//         } else {
//           setIsAuthenticated(false);
//         }
//       } catch (err) {
//         console.error("Auth error:", err);
//         setIsAuthenticated(false);
//       } finally {
//         setCheckingAuth(false);
//       }
//     };

//     verifyAuth();
//   }, []);

//   if (checkingAuth) {
//     return <SchoolLoadingSpinner />;
//   }

//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;



import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { GraduationCap, Users, Calendar } from 'lucide-react';

// Loading spinner component
const SchoolLoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center relative">
        {/* Rotating ring */}
        <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-8"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-0 top-[105px] flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
        </div>

        {/* Floating icons */}
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-8 animate-float-1">
            <GraduationCap className="w-6 h-6 text-indigo-400 opacity-70" />
          </div>
          <div className="absolute -top-2 -right-8 animate-float-2">
            <Users className="w-5 h-5 text-purple-400 opacity-60" />
          </div>
          <div className="absolute -bottom-2 left-0 animate-float-3">
            <Calendar className="w-5 h-5 text-blue-400 opacity-50" />
          </div>
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
          Al Khatem School
        </h2>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Floating animations */}
        <style>{`
          @keyframes float-1 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(-5deg); }
          }
          @keyframes float-3 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(3deg); }
          }
          .animate-float-1 {
            animation: float-1 3s ease-in-out infinite;
          }
          .animate-float-2 {
            animation: float-2 2.5s ease-in-out infinite;
          }
          .animate-float-3 {
            animation: float-3 4s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

// Protected route
const ProtectedRoute = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log("API URL:", import.meta.env.VITE_API_URL);
        console.log("Cookies:", document.cookie);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("Response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("Response data:", data);

          // Check if user data exists and has required fields
          // Your API returns the user object directly with id, name, email, role, etc.
          if (data && data.id && data.email && !data.isDeleted) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          // If response is not ok (401, 404, etc.)
          console.log("Auth failed with status:", res.status);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyAuth();
  }, []);

  if (checkingAuth) {
    return <SchoolLoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


export default ProtectedRoute;