import Link from "next/link"
import React from "react"
import LoadingScreen from "../components/LoadingScreen"
import DatasetComponent from "../components/Datasets/DatasetComponent"
import { useState, useEffect } from 'react'
import { posthog } from "posthog-js"
import SwapVertIcon from '@mui/icons-material/SwapVert';
import BranchComponent from "../components/Datasets/BranchComponent"

export default function Main () {   
    const [loading , setLoading ] = useState<Boolean>(false)
    const [datasetsDict, setDatasetsDict] = useState<any>(null)
    const [datasets, setDatasets] = useState<Array<any>>(Array(0))
    const [hierarchy, setHierarchy] = useState<any>(null)
    const [sortMode, setSortMode] = useState<number>(0)
    const [sortOrder, setSortOrder] = useState<Boolean>(false)

    useEffect(() => {
        const POSTHOG_KEY: string = process.env.NEXT_PUBLIC_POSTHOG_KEY as string;
        posthog.init(POSTHOG_KEY, { api_host: 'https://app.posthog.com' })
        fetch(`http://localhost:8000/get_hierarchies/`)
        .then((response) => response.json()).then((res) => {setHierarchy(() => {return res}); console.log(res)}).then(
        () => {
            fetch(`http://localhost:8000/get_datasets/`)
             .then((response) => response.json()).then((data) => {setDatasets(() => {return Object.values(data)}); setDatasetsDict(() => {return data})})   
        }
        )
    }, [])

    const compare_fcn = (a,b) => {
        if(sortMode == 0){
            return 0
        } else if (sortMode == 1) {
            return (a.name.localeCompare(b.name))
        } else if (sortMode == 2) {
            return (a.storage.localeCompare(b.storage))
        } 
    }

    var data_array = ((datasets.length > 0) && datasetsDict && hierarchy) ? sortOrder ? [...datasets].sort(compare_fcn) : [...datasets].sort(compare_fcn).reverse() : null
    
    return (
        <div className="relative w-full h-full">
            <nav className="z-10 flex p-2 h-10" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <div className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                            <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                            Home
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="flex w-full">
                <div className="z-10 w-[40%] h-full flex flex-col items-center gap-20 justify-center">
                    <div className='p-8 text-5xl flex flex-col justify-center items-center font-bold h-max text-center'>
                        <h1 className=" mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Welcome to stack</h1>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="animate-pulse block xl:inline bg-gradient-to-r bg-clip-text text-transparent from-blue-400 to-blue-800 via-blue-400 animate-text">Supercharge </span>{' '}
                        <span className="block xl:inline dark:text-white">your datasets</span>{' '}
                    </h1>
                    </div>
                    <p className="text-lg font-normal text-center text-gray-500 lg:text-xl dark:text-gray-400 mb-6">
                        The AI-Powered Data Platform for AI Teams
                    </p>

                    <div className='px-20 flex h-max justify-center gap-2'> 
                        <Link href='https://stackai.gitbook.io/stack-beta-release/' passHref>
                            <button className="h-max block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Documentation</h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">Learn more about how to set up and use Stack.</p>
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="h-screen overflow-scroll w-[60%]">
                    {
                        loading ? <LoadingScreen msg={'Connecting...'}  key={'ld'}/> : <></>
                    }
                    <div className="p-2 flex flex-col items-center">
                        <div className="w-[90%] h-full">
                            <div className="w-full flex justify-between">
                                <Link href="/NewDataset" passHref>
                                    <button className="text-white h-fit bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> 
                                        Add a new dataset
                                    </button>
                                </Link>
                                <div className="flex w-[40%] justify-end">
                                    <button onClick={()=>{setSortMode(() => {
                                        if(sortMode == 2){
                                            return 0
                                        } else{
                                            return sortMode + 1
                                        }
                                    })}} className="py-2.5  h-fit w-max px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> 
                                        {`Order by ${sortMode == 0 ? 'date' : (sortMode == 1 ? 'name' : 'URI')}`}
                                    </button>
                                    <button onClick={()=>{setSortOrder(!sortOrder)}} className="flex h-fit w-36 items-center gap-2 py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> 
                                        <SwapVertIcon className="w-5 h-5" /> 
                                        {sortOrder ? 'descending' : 'ascending'}
                                    </button>
                                </div>
                            </div>
                            <div className="h-full mt-2 border border-gray-300 dark:border-gray-700 rounded-md overflow-y-scroll flex flex-col w-full overflow-clip">
                                {
                                    (data_array) ?
                                    data_array.filter((dataset) => (hierarchy[dataset.storage]) ? (hierarchy[dataset.storage]['parent'] == '') : true ).map( 
                                        (dataset) => 
                                            (dataset && dataset.name)
                                            ? 
                                            <>
                                                <DatasetComponent datasets={datasets} key={`dataset${dataset.name}`} dataset={dataset} setLoading={setLoading}/>
                                                {
                                                    (hierarchy && hierarchy[dataset.storage]) ? 
                                                    (hierarchy[dataset.storage]['children'].length > 0) 
                                                    ?
                                                    hierarchy[dataset.storage]['children'].map(
                                                        (dataset1) => 
                                                        (datasetsDict && datasetsDict[dataset1]) ?
                                                        <BranchComponent datasets={datasets} key={`dataset${datasetsDict[dataset1].name}`} dataset={datasetsDict[dataset1]} datasetsDict={datasetsDict}  hierarchy={hierarchy} setLoading={setLoading}/>
                                                        :
                                                        null
                                                    )
                                                    : null
                                                    : null

                                                }
                                            </>
                                            :
                                            null
                                        )  
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}