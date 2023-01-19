import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AuthModal from "./Modals/AuthModal";

const Navbar = () => {

    const [user, setUser] = useState('None')
    const [login, setLogin] = useState(false)

    useEffect(() => {
        fetch('http://localhost:8000/get_user')
        .then((res) => res.json())
        .then((res) => setUser(res['user']))
    }, [])

    return (
        <div className='flex w-full justify-between'>
            {
                (login || user == '') ? <AuthModal setPopup={setLogin}/> : null
            }
            <nav className="w-full p-2 bg-neutral-800">
                <div className="w-full container flex flex-wrap items-center justify-between mx-auto">
                    <a href="https://www.getstack.ai" className="flex items-center">
                        <Image className="invert" src="/stack-logo.png" width={'200'} height={'30'} objectFit={'contain'} alt=''></Image>
                    </a>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="flex px-2 items-center rounded-lg flex-row space-x-8 text-sm font-medium">
                            <li>
                                <a href="/Home" className="flex gap-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent border-0 hover:text-blue-700" aria-current="page">
                                    <Image className="invert" src={'/../public/Icons/ExploreIcon.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                                    <div> Home </div>
                                </a>
                            </li>
                            <li>
                                <a href="/Datasets" className="flex gap-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent border-0 hover:text-blue-700" aria-current="page">
                                    <Image className="invert" src={'/../public/Icons/DatasetIcon.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                                    <div> Datasets </div>
                                </a>
                            </li>
                            <li>
                                {
                                    (user != '') ? 
                                    <button onClick={()=>{setUser('')}} className="flex justify-center">
                                        <div className="flex justify-center items-center gap-2">
                                            {
                                                (user == 'admin') ?
                                                <div className="relative w-12">
                                                    <div>
                                                        {''}
                                                    </div>
                                                    <img className="w-10 h-10 rounded-full" src="/Icons/download.png" alt=""/>
                                                    <span className="top-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                                </div>
                                                :
                                                <div className="inline-flex mr-2 items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">{user.slice(0, 2)}</span>
                                                </div>
                                            }
                                            
                                            <div className="w-20 h-2.5 items-center flex rounded-full mr-3 text-gray-300">{'Logout'}</div>
                                        </div>
                                    </button>
                                    :
                                    <button onClick={()=>{setLogin(true)}} className="flex justify-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <svg className="mr-2 w-10 h-10 text-white dark:text-gray-700" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
                                            <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
                                        </div>
                                    </button>
                                } 
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;