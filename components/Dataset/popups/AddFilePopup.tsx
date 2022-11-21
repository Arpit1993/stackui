import React from "react";
import posthog from 'posthog-js'
import { useState } from "react"
import LoadingScreen from "../../LoadingScreen"

const AddFilePopup = (props) => {
    const [loading, setLoading]= useState<Boolean>(false)

    const handleChange = async (e) => {
        const formData = new FormData();
        formData.append(
            "file",
            e.target.files[0],
            e.target.files[0].name
        )
        const reqOptions = {
            method: 'POST',
            body: formData
        }

        setLoading(true)
        
        const res1 = await fetch('http://localhost:8000/add_file/',reqOptions)
        const res2 = await fetch('http://localhost:8000/commit_req/')
        posthog.capture('Addded a file', { property: 'value' })
        props.setShortcuts(true)
        window.location.reload();
    }

    return (
        <div>
            <div key={'ppcc_ADFCPPP'} className="z-40 text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg border-[0.5px] border-gray-500 bg-white dark:bg-gray-900 w-[600px]  h-[300px]">
                <div className="w-full justify-between flex">
                    <div className="py-1 px-2">
                        <button onClick={() => {
                            props.setPopup(false)
                            props.setShortcuts(true)
                            }} className='text-xs px-1 w-[15px] h-[15px] flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                    </div> 
                    <div className="place-self-center text-md py-2 font-bold">
                        Add File
                    </div>
                    <div></div>
                </div>
                <div className="flex flex-col w-full justify-between">
                    <form className="flex justify-center p-2">
                        <label className="p-2 flex flex-col justify-center items-center w-full h-[200px] bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            </div>
                            <input onChange={handleChange} id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </form>
                </div>
            </div>
            {
                loading ? <LoadingScreen key={'ldsc_ADFFFPP'}/> : <></>
            }
        </div>
        
    )
}

export default AddFilePopup