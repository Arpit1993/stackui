import LoadingScreen from "../components/LoadingScreen"
import DatasetComponent from "../components/Datasets/DatasetComponent"
import { useState, useEffect } from 'react'
import React from "react"
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
        <div className="overflow-scroll">
            {datasets.map( (dataset) => <DatasetComponent key={`dataset${dataset.name}`} dataset={dataset} setLoading={setLoading}/>)}
            {LoadingComp}
        </div>
    )
}