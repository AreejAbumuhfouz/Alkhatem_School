// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import axios from 'axios';

// import Home from './pages/Home';
// import Login from './pages/Login';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public Route */}
//         <Route path="/login" element={<Login />} />

        
//          <Route
//           path="/"
//           element={
//             <ProtectedRoute>
              
//               <Home />
//              </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// // import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // import axios from 'axios';

// // import Home from './pages/Home';
// // import Login from './pages/Login';

// // function App() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         {/* Public Login Route */}
// //         <Route path="/login" element={<Login />} />

// //         {/* Home is now public (no ProtectedRoute) */}
// //         <Route path="/" element={<Home />} />
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;