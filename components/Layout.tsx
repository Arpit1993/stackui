import Sidebar from "./SideBar/SideBar"
import Navbar from "./Navbar/Navbar"
import React from "react";

const Layout = ({children}) => {
    
    return (
        <div className="flex font-body gap-3 h-screen bg-white dark:bg-black text-black dark:text-white">
            <Sidebar/>
            <div className='p-2 flex-auto h-screen center overflow-y-scroll'>
                <Navbar/>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout;