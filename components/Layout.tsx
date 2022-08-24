import Sidebar from "./SideBar/SideBar"
import Navbar from "./Navbar/Navbar"

const Layout = ({children}) => {
    return (
        <div className="font-sans:helvetica flex gap-3 h-max bg-white dark:bg-gray-700 text-black dark:text-white">
            <Sidebar/>
            <div className='p-2 flex-auto center'>
                <Navbar/>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout;