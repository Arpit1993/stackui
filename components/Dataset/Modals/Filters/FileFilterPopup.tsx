import React, { useEffect, useRef, useState } from "react"
import BranchPopup from "../BranchPopup"
import posthog from 'posthog-js'
import LoadingScreen from "../../../LoadingScreen"

const FileFilterPopup = (props) => {

    const [branch, setBranch] = useState(false)
    const [filtering, setFiltering] = useState(false)
    const [time, setTime] = useState(true)
    const [loading, setLoading] = useState(false)

    // weird hack to make the checkboxes actually change state, otherwise state remains the same
    // TODO
    const [nullStr, setnullStr] = useState('')

    useEffect( () => {
        const calls = async () => {
            if(props.callFilter) {
                await handleApplyFilter()
                props.setCallFilter(false)
            }
        }
        calls()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time, props.callFilter])


    const handleApplyFilter = async () => {
        setLoading(true)
        props.setFiltering('y')

        var filters = {}
        var idx = 0

        filters[idx] = {
            'name': props.txt
        }

        const data = JSON.stringify(filters)

        await fetch('http://localhost:8000/set_filter/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
        )

        
        posthog.capture('Applied filter', { property: 'value' })
    
        props.setFiltering('z')
        props.setPage(0)
        setTime(!time)
        setLoading(false)
    }

    const handleResetFilter = async () => {
        setLoading(true)
        props.setFiltering('y')
        await fetch('http://localhost:8000/reset_filters')
        props.setFiltering('z')
        setTime(!time)
        setLoading(false)
    }

    return (
        <>
            {
                loading ? <LoadingScreen key={'ldscfileflterppp'} /> : <></>
            }
            {filtering ? <LoadingScreen key={'lds_fpp'}/> : <></>}
            {branch ? <BranchPopup key={'brpp'} setPopup={setBranch}/> : <></>}
            <div key={"flterpp"} className="bg-white absolute z-40 top-20 rounded-lg dark:bg-gray-900 w-full h-[100px] border-[0.5px] border-gray-500">
                <div className="w-full justify-between flex h-8">
                    <div className="px-2">
                        <button onClick={() => {
                        props.shortcuts.current = true
                        props.setPopup(false)
                        }} className='text-xs px-1 w-[15px] h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                    </div>
                </div>

                <div className="flex justify-around">
                    <div className="px-5 py-4 justify-start">
                        <button onClick={() => setBranch(true)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Branch
                        </button>
                    </div>
                    <div className="px-5 py-4 flex justify-end gap-2">
                        <button onClick={() => handleResetFilter()} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                            Reset
                        </button>
                        <button onClick={() => handleApplyFilter()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FileFilterPopup