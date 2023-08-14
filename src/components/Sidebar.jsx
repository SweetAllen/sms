import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList
}from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png'
import './sidebar.css'
const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        // {
        //     path:"/dashboard",
        //     name:"Dashboard",
        //     icon:<FaTh/>
        // },
        {
            path:"/dashboard/exceldata",
            name:"Send SMS",
            icon:<FaCommentAlt/>
        },
        {
            path:"/dashboard/data",
            name:"Data",
            icon:<FaThList/>
        },
        // {
        //     path:"/comment",
        //     name:"Comment",
        //     icon:<FaCommentAlt/>
        // },
        // {
        //     path:"/product",
        //     name:"Product",
        //     icon:<FaShoppingBag/>
        // },
        // {
        //     path:"/productList",
        //     name:"Product List",
        //     icon:<FaThList/>
        // }
    ]
    return (
        <div className="container">
           <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
               <div className="top_section">

               {/* <img src={logo} alt='' style={{display: isOpen ? "block" : "none"}} className="logo" >
              </img> */}
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo"></h1>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
           </div>
           <main>{children}</main>
        </div>
    );
};

export default Sidebar;