import LoadingScreen from "../components/LoadingScreen"
import DatasetComponent from "../components/Datasets/DatasetComponent"
import { useState, useEffect } from 'react'
import React from "react"
import Link from "next/link"
import { posthog } from "posthog-js"

export default function Datasets() {   

    const [loading , setLoading ] = useState(0)
    const [datasets, setDatasets] = useState([])

    useEffect(() => {
        const POSTHOG_KEY: string = process.env.NEXT_PUBLIC_POSTHOG_KEY as string;
        posthog.init(POSTHOG_KEY, { api_host: 'https://app.posthog.com' })
        fetch(`http://localhost:8000/get_datasets/`)
         .then((response) => response.json()).then((data) => setDatasets(Object.values(data)));
    }, [])

    const LoadingComp = loading ? [<LoadingScreen msg={'Connecting...'}  key={'ld'}/>] : [<></>]

    return (
        <div className="mt-5 h-full">
            <Link href="/NewDataset" passHref>
                <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> 
                    Add a new dataset
                </button>
            </Link>
            <div className="">
                {datasets.map( (dataset) => <DatasetComponent key={`dataset${dataset.name}`} dataset={dataset} setLoading={setLoading}/>)}
            </div>
            {LoadingComp}
        </div>
    )
}