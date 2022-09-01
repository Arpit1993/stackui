import Image from "next/image"
import Link from "next/link"
import React from "react"

const Sidebar = () => {

    return (
        <div className='p-2 h-screen w-[210px] shadow-lg'>
                <div className='flex flex-col justify-center'>
                    <h1 className='py-5 w-full flex justify-start text-2xl font-bold text-center'>
                        <Image className="dark:invert" src="/stack-logo.png" width={'200'} height={'50'} objectFit={'contain'} alt=''></Image>
                    </h1>
                    <div className="flex justify-start">
                        <div className='mt-5 w-full flex flex-col list-none font-thin'>
                            <Link href='/Home' passHref>
                                <button className="py-3 px-4 w-[200px] rounded-md hover:bg-black hover:text-white dark:hover:bg-gray-800">
                                    <div className="flex grid-cols-2 gap-6">
                                        <div> 🏠 </div>
                                        <div> Home </div>
                                    </div>
                                </button>
                            </Link>
                            <Link href='/Datasets' passHref>
                                <button className="py-3 px-4 w-[200px] rounded-md hover:bg-black hover:text-white dark:hover:bg-gray-800">
                                    <div className="flex grid-cols-2 gap-6">
                                        <div> 📚 </div>
                                        <div> Datasets </div>
                                    </div>
                                </button>
                            </Link>
                            <Link href='/Pulls' passHref>
                                <button className="py-3 px-4 w-[200px] rounded-md hover:bg-black hover:text-white  dark:hover:bg-gray-800">
                                    <div className="flex grid-cols-2 gap-6">
                                        <div> 🩺 </div>
                                        <div> Pull Requests </div>
                                    </div>
                                </button>
                            </Link>
                            <Link href='/' passHref>
                                <button className="py-3 px-4 w-[200px] rounded-md hover:bg-black hover:text-white dark:hover:bg-gray-800">
                                    <div className="flex grid-cols-2 gap-6">
                                        <div> 🚪 </div>
                                        <div> Logout </div>
                                    </div>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Sidebar