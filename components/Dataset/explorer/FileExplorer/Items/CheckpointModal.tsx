import React, { useEffect, useRef, useState } from "react"
import posthog from 'posthog-js'
import LoadingScreen from '../../../../LoadingScreen';

const CheckpointModal = (props) => {

    const [name, setName] = useState('')
    const [loading, setLoading] = useState<Boolean>(false)

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleCheckpointButton = async () => {
        setLoading(true)
        await fetch(`http://localhost:8000/add_version?label=${name}`).then(() => {props.setFiltering('Setver1');props.setFiltering('setver2');props.setNullStr((Math.random() + 1).toString(36).substring(7))})
        setLoading(false)
        posthog.capture('Added a checkpoint', { property: 'value' })
        props.setPopup(false)
    }

    return (
        <>
            {
                loading ? <LoadingScreen/> : null
            }
            {
                <button key={'ccb'} onClick={() => {
                    props.setPopup(false)
                    }} className=" bg-black/50 z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
                    click to close
                </button>
            }
            <div key={"brnchpp"} className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 ">
                <div className="relative bg-white w-[500px] rounded-lg shadow dark:bg-gray-900">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Add a checkpoint
                        </h3>
                        <button onClick={() => {props.setPopup(false)}} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-6 space-y-6 flex flex-col justify-center">
                        <div className="flex justify-center h-full gap-2">
                            <div>
                                <div>
                                    <div className="block mb-2 text-sm font-body text-gray-900 dark:text-gray-300"> Checkpoint name:</div> 
                                    <input onChange={handleNameChange} onInput={(handleNameChange)}
                                    className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="e.g. My checkpoint" type="text"/>
                                </div>
                            </div>         
                        </div>
                    </div>
                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button onClick={() => handleCheckpointButton()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add checkpoint</button>
                        <button onClick={() => {props.setPopup(false)}}  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                    </div>
                </div>        
            </div>
        </>
    )
}

export default CheckpointModal