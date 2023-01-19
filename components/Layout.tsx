import Sidebar from "./SideBar/SideBar"
import Navbar from "./Navbar/Navbar"
import React from "react";

const Layout = ({children}) => {
    
    return (
        <div className=" gap-3 h-screen bg-white dark:bg-black text-black dark:text-white">
            <Navbar/>
            <div className="">
                {children}
            </div>
        </div>
    )
}

export default Layout;