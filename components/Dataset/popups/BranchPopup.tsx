import React, { useEffect, useRef, useState } from "react"
import posthog from 'posthog-js'

const BranchPopup = (props) => {

    const [copy, setCopy] = useState(true)
    const [name, setName] = useState('')

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleBranchButton = async () => {

        var data

        if (copy){
            data = JSON.stringify({branch_name: name, branch_type: 'copy'})
        } else {
            data = JSON.stringify({branch_name: name, branch_type: 'move'})
        }
        
        const res = await fetch('http://localhost:8000/set_branch/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
        ).then(
            () => {
                posthog.capture('Added a branch', { property: 'value' })
                window.location.reload();
            }
        )
    }

    return (
        <div key={"brnchpp"} className="absolute z-50 top-20 bg-white rounded-lg dark:bg-slate-900 w-full h-[250px] border-[0.5px] border-gray-500">
            <div className="w-full justify-between flex h-[30px]">
                <div className="px-2">
                    <button onClick={() => props.setPopup(false)} className='text-xs px-1 w-[15px] h-[15px] flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                </div>
            </div>
            <div className="flex justify-center h-[120px] gap-2">
                <div className="flex flex-col justify-center">
                    <div>
                        <div className="block mb-2 text-sm font-body text-gray-900 dark:text-gray-300"> Branch name: </div> 
                        <input onChange={handleNameChange} onInput={handleNameChange}
                        className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="e.g. my_branch" type="text"/>
                    </div>  

                    <div className="flex mt-2">
                        <input key={Math.random()} type="checkbox" checked={copy} onChange={()=>{}} onClick={()=>setCopy(!copy)} className="-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"/>
                        <label className="ml-2 text-sm font-body text-gray-900 dark:text-gray-300">
                            Keep files
                        </label>
                    </div>
                </div>                
            </div>

            <div className="flex justify-around">
                <div className="px-5 flex justify-end gap-2">
                    <button onClick={() => handleBranchButton()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Create branch
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BranchPopup