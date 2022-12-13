
import posthog from 'posthog-js'
import React, { useState } from 'react'
import DatasetOptionsPopup from './Popups/DatasetOptionsPopup'

const DatasetComponent = (props) => {
    const [popup, setPopup] = useState(false)

    const handleClick = async () => {
        props.setLoading(1)
        const POSTHOG_KEY: string = process.env.NEXT_PUBLIC_POSTHOG_KEY as string;
        posthog.init(POSTHOG_KEY, { api_host: 'https://app.posthog.com' })
        posthog.capture('Opened a dataset', { property: 'value' })
        window.location.href='/dataset/'.concat(encodeURIComponent(props.dataset.storage));
    }

    const handleDisconnect = async () => {
        const response = await fetch('http://localhost:8000/disconnect?uri='.concat(encodeURIComponent(props.dataset.storage)))
        posthog.capture('Disconneced a dataset', { property: 'value' })
        window.location.reload();
    }

    return (
        <>
            <div className="relative w-full flex gap-2 z-0" key={'cp'}>
                <button onClick={() => handleClick()} className='w-full'>
                    <div className="text-start font-body text-sm">
                        <div className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                            <div className="w-full flex truncate">
                                <div className="w-[100px]"> Dataset: </div>
                                <div className="w-full truncate"> {props.dataset.name} </div>
                            </div>
                            <div className="w-full flex truncate">
                                <div className="w-[100px]"> Location</div> 
                                <div className="w-full truncate underline"> {props.dataset.storage} </div>
                            </div>
                        </div>
                    </div>
                </button>

                <div className='absolute w-1/3 right-0 flex justify-end p-2 top-0 h-full z-10'>
                    <div className='w-full flex justify-end'>
                        <button  onClick={() => setPopup(true)} className='w-1/3 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
                            Options
                        </button>
                        <button  onClick={() => handleDisconnect()} className='w-1/3 text-red-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-red-500 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
                            Disconnect
                        </button>
                    </div>
                </div>
            </div>
             
            {
                popup 
                    ? 
                        <DatasetOptionsPopup datasets={props.datasets} key={'dataset_options'} dataset={props.dataset} setPopup={setPopup} />
                    : 
                        <></>
            }
        </>
    )
}

export default DatasetComponent