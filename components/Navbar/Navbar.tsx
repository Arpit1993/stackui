import Link from "next/link";

const Navbar = () => {
    return (
        <div className='flex'>
            <div className="w-full relative">
                <div className="absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"/>
                </div>
                <input type="search" id="search" className="block p-4 pl-10 w-full text-sm text-gray-900 
                    bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500
                    dark:focus:border-green-500" placeholder="Search datasets" required>
                    </input>
                <button type="submit" className="text-white absolute right-2.5 bottom-3.5 bg-green-700
                    hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium
                    rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700
                    dark:focus:ring-green-800">
                    Search
                </button>
            </div>
            
            <div className='py-2 px-10 w-full justify-between'> 
                <button type="submit" className="relative text-white bg-green-700 hover:bg-green-800 
                    focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg 
                    text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    New Dataset
                </button>
            </div>

            <div className='py-2 px-20 w-min flex gap-2'> 
                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png"/>
                <a href='/user/bernardo' className="relative top-2"> User </a>
            </div>
        </div>
    )
}

export default Navbar;