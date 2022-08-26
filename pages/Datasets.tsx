import Head from 'next/head'
import Sidebar from '../components/SideBar/SideBar'
import Navbar from '../components/Navbar/Navbar'
import Dataset from '../components/Dataset/Dataset'

export default function Datasets() {        
    return (
        <>
            <a href={'/dataset/test'} >
                <ul className=" text-start w-full mt-3 font-normal text-sm">
                    <li className="dark:hover:text-black py-4 px-4 justify-between flex-col w-full hover:bg-gray-300 border-b border-gray-200 dark:border-gray-600">
                        <div className="w-full flex truncate">
                            <div className="w-[100px]"> Dataset: </div>
                            <div className="w-full truncate"> Test </div>
                        </div>
                        <div className="w-full flex truncate">
                            <div className="w-[100px]"> Location</div> 
                            <div className="w-full truncate underline"> S3 </div>
                        </div>
                        <div className="w-full truncate flex">
                            <div className="w-[100px]"> Access</div>
                            <div className="w-full truncate underline"> Bernardo </div>
                        </div>
                    </li>
                </ul>
            </a>
        </>
    )
}