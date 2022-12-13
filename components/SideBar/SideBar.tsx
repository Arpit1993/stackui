import Image from "next/image"
import Link from "next/link"
import React from "react"

const Sidebar = () => {

    return (
        <div className='h-screen w-[17%] py-4 px-3 bg-gray-50 rounded dark:bg-gray-900'>
                <div className='flex flex-col justify-top h-full'>
                    <h1 className='py-5 w-full flex justify-center text-2xl font-bold text-center'>
                        <Image className="dark:invert" src="/stack-logo.png" width={'200'} height={'56'} objectFit={'contain'} alt=''></Image>
                    </h1>
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex justify-start w-56 mt-10">
                            <div className='mt-5 flex flex-col list-none font-thin gap-2'>
                                <Link href='/Home' passHref>
                                <button className="hover:invert py-3 w-56 dark:hover:invert-0 flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div className="flex grid-cols-2 gap-6">
                                            <Image className="dark:invert" src={'/../public/Icons/ExploreIcon.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                                            <div> Home </div>
                                        </div>
                                    </button>
                                </Link>
                                <Link href='/Datasets' passHref>
                                    <button className="hover:invert py-3 dark:hover:invert-0 flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div className="flex grid-cols-2 gap-6">
                                            <Image className="dark:invert" src={'/../public/Icons/DatasetIcon.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                                            <div> Datasets </div>
                                        </div>
                                    </button>
                                </Link>
                                <Link href='/' passHref>
                                    <button disabled={true} className="hover:invert py-3 dark:hover:invert-0 flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div className="flex grid-cols-2 gap-6">
                                            <Image className="dark:invert" src={'/../public/Icons/PullRequestIcon.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                                            <div> Pull Requests </div>
                                        </div>
                                    </button>
                                </Link>
                                <Link href='/' passHref>
                                    <button disabled={true} className="hover:invert py-3 dark:hover:invert-0 flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div className="flex grid-cols-2 gap-6">
                                            <Image className="dark:invert" src={'/../public/Icons/notification.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                                            <div> History </div>
                                        </div>
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex justify-start w-56 mb-10">
                            <Link href='/' passHref>
                                <button disabled={true} className="hover:invert w-full py-3 dark:hover:invert-0 flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div className="flex grid-cols-2 gap-6">
                                        <Image className="dark:invert" src={'/../public/Icons/logout.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
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