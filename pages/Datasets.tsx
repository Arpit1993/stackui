import LoadingScreen from "../components/LoadingScreen"
import DatasetComponent from "../components/Datasets/DatasetComponent"
import { useState, useEffect } from 'react'
import React from "react"
import Link from "next/link"
import { posthog } from "posthog-js"
import SwapVertIcon from '@mui/icons-material/SwapVert';

export default function Datasets() {   

    const [loading , setLoading ] = useState<Boolean>(false)
    const [datasets, setDatasets] = useState([])
    const [sortMode, setSortMode] = useState<number>(0)
    const [sortOrder, setSortOrder] = useState<Boolean>(false)

    useEffect(() => {
        const POSTHOG_KEY: string = process.env.NEXT_PUBLIC_POSTHOG_KEY as string;
        posthog.init(POSTHOG_KEY, { api_host: 'https://app.posthog.com' })
        fetch(`http://localhost:8000/get_datasets/`)
         .then((response) => response.json()).then((data) => setDatasets(Object.values(data)));
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

    var data_array = sortOrder ? [...datasets].sort(compare_fcn) : [...datasets].sort(compare_fcn).reverse() 

    return (
        <div className="h-full p-10">
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
                    <button onClick={()=>{setSortOrder(!sortOrder)}} className="flex gap-2 py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> 
                        <SwapVertIcon className="w-5 h-5" /> 
                        {sortOrder ? 'descending' : 'ascending'}
                    </button>
                </div>
            </div>
            <div className="">
                {
                    data_array.map( (dataset) => <DatasetComponent datasets={datasets} key={`dataset${dataset.name}`} dataset={dataset} setLoading={setLoading}/>)  
                }
            </div>
            {
                loading ? <LoadingScreen msg={'Connecting...'}  key={'ld'}/> : <></>
            }
        </div>
    )
}