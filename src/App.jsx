// import * as React from 'react';
// import { Routes, Route, Outlet, NavLink } from 'react-router-dom';
// import ExcelData from './Screen/ExcelData';
// import HomeScreen from './Screen/Home/HomeScreen';

// const App = () => {
//   return (
//     <div>
//        <HomeScreen/>
//        <Routes>
//       <Route>
//         <Route index element={<HomeScreen />} />
//         <Route path="home" element={<HomeScreen />} />
//         {/* <Route path="about" element={<About />} /> */}
//         {/* <Route path="*" element={<p>There's nothing here: 404!</p>} /> */}
//       </Route>
//     </Routes>
//     </div>
   
//   );
// };

// const Layout = () => {
//   const style = ({ isActive }) => ({
//     fontWeight: isActive ? 'bold' : 'normal',
//   });

//   return (
//     <>

//       <nav
//         style={{
//           borderBottom: 'solid 1px',
//           paddingBottom: '1rem',
//         }}
//       >
//         <NavLink to="/home" style={style}>
//           Home
//         </NavLink>
//         {/* <NavLink to="/about" style={style}>
//           TEST
//         </NavLink> */}
//       </nav>

//       {/* <main style={{ padding: '1rem 0' }}>
//         <Outlet />
//       </main> */}
//     </>
//   );
// };

// const Home = () => {
//   return (
//     <>
//       <h2>Home</h2>
//     </>
//   );
// };

// const About = () => {
//   return (
//     <>
//       <h2>About</h2>
//     </>
//   );
// };

// export default App;

import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard.jsx';
import Analytics from './pages/Analytics.jsx';
import Comment from './pages/Comment.jsx';
import Product from './pages/Product.jsx';
import ProductList from './pages/ProductList.jsx';
import ExcelData from './pages/ExcelData';
import Data from './pages/Data';
import SidebarLayout from './components/SidebarLayout';
import Login from './pages/Login/Login';
import { UserAuthContextProvider } from './context/AuthContext';
const App = () => {
  return (

    <UserAuthContextProvider>
        <div>
      <Sidebar>
         <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exceldata" element={<ExcelData />} />
          <Route path="/data" element={<Data />} />
          {/* <Route path="/analytics" element={<Analytics />} />
         <Route path="/product" element={<Product />} />
          <Route path="/productList" element={<ProductList />} /> */}
         </Routes>
       </Sidebar>
     </div>
  </UserAuthContextProvider>



    // <div>
    //   <Sidebar>
    //     <Routes>
    //       <Route path="/" element={<Dashboard />} />
    //       <Route path="/dashboard" element={<Dashboard />} />
    //       <Route path="/exceldata" element={<ExcelData />} />
    //       <Route path="/data" element={<Data />} />
    //       {/* <Route path="/analytics" element={<Analytics />} />
    //       <Route path="/product" element={<Product />} />
    //       <Route path="/productList" element={<ProductList />} /> */}
    //     </Routes>
    //   </Sidebar>
    // </div>
  );
};

export default App;



