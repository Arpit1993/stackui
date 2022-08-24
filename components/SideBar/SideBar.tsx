const Sidebar = () => {
    return (
        <div className='p-2 h-screen flex-none w-60 shadow-lg'>
                <div className=''>
                    <h1 className='py-5 text-2xl font-bold text-center'>
                        Stack
                    </h1>
                    <div className='list-none '>
                        <li className="py-5  px-4 rounded-md hover:bg-gray-200  dark:hover:bg-gray-800">
                            <a href='/Home'>Home</a>
                        </li>
                        <li className="py-5 px-4 rounded-md hover:bg-gray-200  dark:hover:bg-gray-800">
                            <a href='/Datasets'>Datasets</a>
                        </li>
                        <li className="py-5 px-4 rounded-md hover:bg-gray-200  dark:hover:bg-gray-800">
                            <a href='/Pulls'>Pull Requests</a>
                        </li>
                        <li className="py-5 px-4 rounded-md hover:bg-gray-200  dark:hover:bg-gray-800">
                            <a href='/'>Logout</a>
                        </li>
                    </div>
                </div>
            </div>
    )
}

export default Sidebar