import Sidebar from "./SideBar/SideBar"
import Navbar from "./Navbar/Navbar"
import React from "react";

const Layout = ({children}) => {
    
    return (
        <div className="font-body font-alef flex gap-3 h-max bg-white dark:bg-black text-black dark:text-white">
            <Sidebar/>
            <div className='p-2 flex-auto h-screen center'>
                <Navbar/>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout;