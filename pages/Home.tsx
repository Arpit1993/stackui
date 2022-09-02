import Link from "next/link"
import React from "react"

export default function Main () {    
    return (
        <div>
            <div className='p-10 text-5xl flex flex-col justify-center items-center font-bold h-max text-center'>
                Welcome to stack! 👋 
            </div>
    
            <div className="p-10 flex justify-center gap-2">
                <Link href="/NewDataset" passHref>
                    <button className="px-5 h-[50px] flex flex-col font-base text-white justify-center bg-green-700 hover:bg-green-800 rounded-lg"> 
                        Add a new dataset
                    </button>
                </Link>
                <div className="flex flex-col justify-center">
                    <Link href="/Datasets" passHref>
                        <button className="px-5 h-[50px] flex flex-col font-base text-white justify-center bg-gray-700 hover:bg-gray-800 rounded-lg"> 
                            See current datasets
                        </button>
                    </Link>
                </div>
            </div>

            <div className='px-20 flex justify-between gap-2'> 
                <Link href='/dataset/test' passHref>
                    <button className='border-2 flex flex-col justify-center items-center border-blue-300 text-center rounded-3xl w-[300px] h-[300px] p-20'> 
                        See your dataset 
                    </button>
                </Link>
                
                <Link href ='/' passHref>
                    <button className='border-2 flex flex-col justify-center items-center border-blue-300 text-center rounded-3xl w-[300px] h-[300px] p-20'> 
                        See your pull requests
                    </button>
                </Link>
                
                <Link href ='https://www.getstack.ai/' passHref>
                    <button className='border-2 flex flex-col justify-center items-center border-blue-300 text-center rounded-3xl w-[300px] h-[300px] p-20'> 
                        Learn more about stack
                    </button>
                </Link>
            </div>
        </div>
    )
}