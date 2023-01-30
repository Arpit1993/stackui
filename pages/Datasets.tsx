import LoadingScreen from "../components/LoadingScreen"
import DatasetComponent from "../components/Datasets/DatasetComponent"
import { useState, useEffect } from 'react'
import React from "react"
import Link from "next/link"
import { posthog } from "posthog-js"
import SwapVertIcon from '@mui/icons-material/SwapVert';
import BranchComponent from "../components/Datasets/BranchComponent"

export default function Datasets() {   

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
        <div className="h-full">
            {
                loading ? <LoadingScreen msg={'Connecting...'}  key={'ld'}/> : <></>
            }
            <nav className="flex p-2 h-10" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link href="/">
                            <button className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                                Home
                            </button>
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                            <span className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                                Datasets
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="p-2 flex flex-col items-center">
                <div className="w-3/4 h-full">
                    <div className="w-full flex justify-between">
                        <Link href="/NewDataset" passHref>
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> 
                                Add a new dataset
                            </button>
                        </Link>
                        <div className="flex w-[30%] justify-end">
                            <button onClick={()=>{setSortMode(() => {
                                if(sortMode == 2){
                                    return 0
                                } else{
                                    return sortMode + 1
                                }
                            })}} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> 
                                {`Order by ${sortMode == 0 ? 'date' : (sortMode == 1 ? 'name' : 'URI')}`}
                            </button>
                            <button onClick={()=>{setSortOrder(!sortOrder)}} className="flex w-36 items-center gap-2 py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> 
                                <SwapVertIcon className="w-5 h-5" /> 
                                {sortOrder ? 'descending' : 'ascending'}
                            </button>
                        </div>
                    </div>
                    <div className="h-[550px] mt-2 border border-gray-300 dark:border-gray-700 rounded-md overflow-y-scroll flex flex-col w-full overflow-clip">
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
    )
}