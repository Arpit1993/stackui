import React, { useEffect, useRef, useState } from "react"
import posthog from 'posthog-js'

const SlicePopup = (props) => {

    const [name, setName] = useState('')

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleSliceButton = async () => {
        fetch(`http://localhost:8000/add_slice/?slice_name=${name}`).then(
            () => {
                posthog.capture('Added a slice', { property: 'value' })
                window.location.reload()
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
                        <div className="block mb-2 text-sm font-body text-gray-900 dark:text-gray-300"> Slice name: </div> 
                        <input onChange={handleNameChange} onInput={handleNameChange}
                        className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="e.g. slice 1" type="text"/>
                    </div> 
                </div>                
            </div>

            <div className="flex justify-around">
                <div className="px-5 flex justify-end gap-2">
                    <button onClick={() => handleSliceButton()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Add slice
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SlicePopup