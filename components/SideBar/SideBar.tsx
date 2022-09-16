import Image from "next/image"
import Link from "next/link"
import React from "react"

const Sidebar = () => {

    return (
        <div className='p-2 h-screen flex flex-0 justify-center w-[250px] bg-gray-100'>
                <div className='flex flex-col justify-top'>
                    <h1 className='py-5 w-full flex justify-start text-2xl font-bold text-center'>
                        <Image className="dark:invert" src="/stack-logo.png" width={'200'} height={'50'} objectFit={'contain'} alt=''></Image>
                    </h1>
                    <div className="flex justify-start mt-10">
                        <div className='mt-5 w-full flex flex-col list-none font-thin'>
                            <Link href='/Home' passHref>
                            <button className="hover:invert py-3 px-4 w-[200px] rounded-md hover:bg-white hover:text-black dark:hover:bg-gray-200">
                                    <div className="flex grid-cols-2 gap-6">
                                        <Image src={'/../public/Icons/ExploreIcon.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                                        <div> Home </div>
                                    </div>
                                </button>
                            </Link>
                            <Link href='/Datasets' passHref>
                            <button className="hover:invert py-3 px-4 w-[200px] rounded-md hover:bg-white hover:text-black dark:hover:bg-gray-200">
                                    <div className="flex grid-cols-2 gap-6">
                                        <Image src={'/../public/Icons/DatasetIcon.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                                        <div> Datasets </div>
                                    </div>
                                </button>
                            </Link>
                            <Link href='/' passHref>
                            <button className="hover:invert py-3 px-4 w-[200px] rounded-md hover:bg-white hover:text-black dark:hover:bg-gray-200">
                                    <div className="flex grid-cols-2 gap-6">
                                        <Image src={'/../public/Icons/PullRequestIcon.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                                        <div> Pull Requests </div>
                                    </div>
                                </button>
                            </Link>
                            <Link href='/' passHref>
                            <button className="hover:invert py-3 px-4 w-[200px] rounded-md hover:bg-white hover:text-black dark:hover:bg-gray-200">
                                    <div className="flex grid-cols-2 gap-6">
                                        <Image src={'/../public/Icons/notification.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                                        <div> History </div>
                                    </div>
                                </button>
                            </Link>
                            <Link href='/' passHref>
                                <button className="hover:invert py-3 px-4 w-[200px] rounded-md hover:bg-white hover:text-black dark:hover:bg-gray-200">
                                    <div className="flex grid-cols-2 gap-6">
                                        <Image src={'/../public/Icons/logout.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
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