import React, { useEffect, useRef, useState } from "react"
import BranchPopup from "./BranchPopup"
import posthog from 'posthog-js'
import LoadingScreen from "../../LoadingScreen"

const FileFilterPopup = (props) => {

    const [branch, setBranch] = useState(false)

    const [filtering, setFiltering] = useState(false)

    const [time, setTime] = useState(true)

    // weird hack to make the checkboxes actually change state, otherwise state remains the same
    // TODO
    const [nullStr, setnullStr] = useState('')

    useEffect( () => {
        if (time){
            setTime(false)
        } else {
        }
    }, [nullStr])


    const handleApplyFilter = async () => {
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
    }

    const handleResetFilter = async () => {
        await fetch('http://localhost:8000/reset_filter/')
        .then(() => props.setFiltering('w')).then(
            () =>{
                setnullStr('b')
            }
        )
    }

    const wait = filtering ? [<LoadingScreen/>] : [<></>]
    const branch_popup = branch ? [<BranchPopup key={'brpp'} setPopup={setBranch}/>] : [<></>]

    return (
        <>
            {wait}
            {branch_popup}
            <div key={"flterpp"} className="bg-whites rounded-lg dark:bg-slate-900 w-full h-[100px] border-[0.5px] border-gray-500">
                <div className="w-full justify-between flex h-[30px]">
                    <button onClick={() => props.setPopup(0)} className= 'flex justify-center rounded-tl-lg text-center w-[50px] h-[30px] flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
                </div>

                <div className="flex justify-around">
                    <div className="px-5 py-4 justify-start">
                        <button onClick={() => setBranch(true)} className=" bg-green-700 hover:bg-green-900 rounded-md shadow-inner p-1 px-5 text-sm text-white">
                            Branch
                        </button>
                    </div>
                    <div className="px-5 py-4 flex justify-end gap-2">
                        <button onClick={() => handleResetFilter()} className="bg-gray-300 hover:bg-gray-500 rounded-md shadow-inner p-1 px-5 text-sm text-black">
                            Reset
                        </button>
                        <button onClick={() => handleApplyFilter()} className="bg-black hover:bg-gray-500 rounded-md shadow-inner p-1  px-5 text-sm text-white">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FileFilterPopup