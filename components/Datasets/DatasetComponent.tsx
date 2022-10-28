
import posthog from 'posthog-js'
import React, { useState } from 'react'
import DatasetOptionsPopup from './Popups/DatasetOptionsPopup'

const DatasetComponent = (props) => {
    const [popup, setPopup] = useState(false)

    const handleClick = async () => {
        props.setLoading(1)
        const POSTHOG_KEY: string = process.env.NEXT_PUBLIC_POSTHOG_KEY as string;
        posthog.init(POSTHOG_KEY, { api_host: 'https://app.posthog.com' })
        const response = await fetch('http://localhost:8000/connect/?uri='.concat(encodeURIComponent(props.dataset.storage)))
        
        posthog.capture('Opened a dataset', { property: 'value' })
        window.location.href='/dataset/'.concat(encodeURIComponent(props.dataset.name));
    }

    const handleDisconnect = async () => {
        const response = await fetch('http://localhost:8000/disconnect?uri='.concat(encodeURIComponent(props.dataset.storage)))
        posthog.capture('Disconneced a dataset', { property: 'value' })
        window.location.reload(true);
    }

    const datasetOptions = popup ? [
        <DatasetOptionsPopup key={'dataset_options'} dataset={props.dataset} setPopup={setPopup} />
    ] : [<></>]

    return (
        <div className="w-full flex gap-2" key={'cp'}>
            <button onClick={() => handleClick()} className='w-4/6'>
                <ul className=" text-start mt-3 font-normal text-sm">
                    <li className="py-4 px-4 justify-between flex-col w-full hover:bg-gray-300 rounded-md border border-gray-400 dark:border-gray-600 dark:hover:bg-gray-800">
                        <div className="w-full flex truncate">
                            <div className="w-[100px]"> Dataset: </div>
                            <div className="w-full truncate"> {props.dataset.name} </div>
                        </div>
                        <div className="w-full flex truncate">
                            <div className="w-[100px]"> Location</div> 
                            <div className="w-full truncate underline"> {props.dataset.storage} </div>
                        </div>
                    </li>
                </ul>
            </button>
            <button  onClick={() => setPopup(true)} className='w-1/6 mt-3 rounded-md border text-black border-gray-400 bg-gray-200 hover:bg-gray-400 dark:border-gray-600'>
                Options
            </button>
            <button  onClick={() => handleDisconnect()} className='w-1/6 mt-3 rounded-md border text-red-400 border-gray-400 bg-gray-200 hover:bg-gray-400 dark:border-gray-600'>
                Disconnect
            </button>
            {datasetOptions}
        </div>
    )
}

export default DatasetComponent