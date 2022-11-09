import Link from "next/link"
import React from "react"

export default function Main () {    
    return (
        <div className="h-full">
            <div className='p-10 text-5xl flex flex-col justify-center items-center font-bold h-max text-center'>
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                    Welcome to stack!
                </h1>
            </div>
            <p className="mb-6 text-lg flex justify-center font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                Supercharge your ML datasets: version control, exploration, and collaboration.
            </p>
    
            <div className="p-10 flex justify-center gap-2">
                <Link href="/NewDataset" passHref>
                    <button className="flex focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> 
                        Add a new dataset
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </Link>
                <div className="flex flex-col justify-center">
                    <Link href="/Datasets" passHref>
                        <button className="flex text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"> 
                            See current datasets
                            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </Link>
                </div>
            </div>

            <div className='px-20 flex h-max justify-between gap-2'> 
                <Link href='https://stackai.gitbook.io/stack-beta-release/' passHref>
                    <button className="h-max block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Documentation</h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">Learn more about how to set up and use Stack.</p>
                    </button>
                </Link>
                
                <Link href ='/' passHref>
                    <button className="h-max block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">See your pull requests</h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">Area under construction... Coming soon!</p>
                    </button>
                </Link>
                
                <Link href ='https://www.getstack.ai/' passHref>
                    <button className="h-max block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">See your pull requests</h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">Area under construction... Coming soon!</p>
                    </button>
                </Link>
            </div>
        </div>
    )
}