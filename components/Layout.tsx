import Navbar from "./Navbar/Navbar"
import React from "react";

const Layout = ({children}) => {
    
    return (
        <div className="h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
            <div className="h-fit">
                <Navbar/>
            </div>
            <div className="flex flex-col">
                {children}
            </div>
        </div>
    )
}

export default Layout;