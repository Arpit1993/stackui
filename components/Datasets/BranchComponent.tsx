
import posthog from 'posthog-js'
import React, { useState } from 'react'
import DatasetOptionsPopup from './Popups/DatasetOptionsPopup'
import SettingsIcon from '@mui/icons-material/Settings';
import { Tooltip } from '@mui/material';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import PowerOffIcon from '@mui/icons-material/PowerOff';

const BranchComponent = (props) => {
    const [popup, setPopup] = useState(false)
    const [disconnect, setDisconnect] = useState(false)

    const handleClick = async () => {
        props.setLoading(true)
        const POSTHOG_KEY: string = process.env.NEXT_PUBLIC_POSTHOG_KEY as string;
        posthog.init(POSTHOG_KEY, { api_host: 'https://app.posthog.com' })
        posthog.capture('Opened a dataset', { property: 'value' })
        window.location.href='/dataset/'.concat(encodeURIComponent(props.dataset.storage));
    }

    return (
        <>
            {
                disconnect ? 
                <DisconnectModal uri = {props.dataset.storage} setPopup={setDisconnect} setLoading={props.setLoading}/>
                : null        
            }
            <div className='w-full flex justify-end'>

                <div className='w-[10%] h-full flex flex-col justify-start items-end'>
                    <SubdirectoryArrowRightIcon className='w-10 h-10'/>
                </div>

                <div className="w-[90%] relative flex gap-2 z-0" key={'cp'}>
                    <button onClick={() => handleClick()} className='w-full'>
                        <div className="text-start font-body text-sm">
                            <div className="text-gray-900 bg-white border-b border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
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

                    <div className='absolute w-60 right-0 flex justify-end p-2 top-0 h-full z-10'>
                        <div className='w-full flex justify-end'>
                            <Tooltip placement='top' title={'options'}>
                                <button  onClick={() => setPopup(true)} className='w-1/3 overflow-clip text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
                                        <SettingsIcon className='w-5 h-5' />
                                </button>
                            </Tooltip>
                            <Tooltip placement='top' title={'disconnect'}>
                                <button  onClick={() => setDisconnect(true)} className='w-1/3 overflow-clip text-red-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-red-500 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
                                    <PowerOffIcon className='w-5 h-5' />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-end'>
                <div className='w-[90%]'>    
                    {
                        (props.hierarchy && props.hierarchy[props.dataset.storage]) ? 
                        (props.hierarchy[props.dataset.storage]['children'].length > 0) 
                        ?
                        props.hierarchy[props.dataset.storage]['children'].map(
                            (dataset1) => 
                            (props.datasetsDict && props.datasetsDict[dataset1]) ?
                            <BranchComponent datasets={props.datasets} key={`dataset${props.datasetsDict[dataset1].name}`} datasetsDict={props.datasetsDict} dataset={props.datasetsDict[dataset1]} hierarchy={props.hierarchy} setLoading={props.setLoading}/>
                            :
                            null
                        )
                        : null
                        : null

                    }
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

export default BranchComponent

const DisconnectModal = (props) => {
    const handleDisconnect = async () => {
        props.setLoading(true)
        fetch('http://localhost:8000/disconnect?uri='.concat(encodeURIComponent(props.uri))).then(
            () => {
                props.setLoading(false)
                posthog.capture('Disconneced a dataset', { property: 'value' })
                window.location.reload();   
            }
        )
    }
    return (
        <>
            <button key={'ccb'} onClick={() => {props.setPopup(false)}} className="z-[390] bg-black/60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
                click to close
            </button>
            
            <div className="z-[900] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-full h-full max-w-md md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button onClick={() => {props.setPopup(false)}} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                        <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to disconnect this dataset?</h3>
                        <button onClick={() => {handleDisconnect()}} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Yes, I am sure
                        </button>
                        <button onClick={() => {props.setPopup(false)}} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                    </div>
                </div>
            </div>
        </>
    )
}