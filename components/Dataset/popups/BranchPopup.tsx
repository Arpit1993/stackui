import React, { useEffect, useRef, useState } from "react"
import posthog from 'posthog-js'
import LoadingScreen from "../../LoadingScreen"

const BranchPopup = (props) => {

    const [copy, setCopy] = useState(true)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [uri, setURI] = useState('')

    const handleNameChange = (e) => {
        setName(e.target.value)
    }
    
    const handleURIChange = (e) => {
        setURI(e.target.value)
    }

    const handleBranchButton = async () => {

        setLoading(true)
        var data

        if (copy){
            data = JSON.stringify({branch_name: uri, branch_title: name, branch_type: 'copy'})
        } else {
            data = JSON.stringify({branch_name: uri, branch_title: name, branch_type: 'move'})
        }
        
        const res = await fetch('http://localhost:8000/set_branch/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
        ).then(
            () => {
                setLoading(false)
                posthog.capture('Added a branch', { property: 'value' })
                window.location.reload();
            }
        )
    }

    return (
        <>
            {
                loading 
                ?
                <div className="z-[100]">
                    <LoadingScreen/>
                </div>
                :
                null
            }
            {
                <button key={'ccb'} onClick={() => {
                    props.setPopup(false)
                    }} className=" bg-black/50 z-[48] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
                    click to close
                </button>
            }
            <div key={"brnchpp"} ref={props.ref_} className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative bg-white w-[500px] rounded-lg shadow dark:bg-gray-900">
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Add a branch
                            </h3>
                            <button onClick={() => {props.setPopup(false)}} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6 flex flex-col justify-center">
                            <div>
                                <div>
                                    <div className="block mb-2 text-sm font-body text-gray-900 dark:text-gray-300"> Branch name:</div> 
                                    <input onChange={handleNameChange} onInput={(handleNameChange)}
                                    className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="e.g. My branch" type="text"/>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <div>
                                    <div className="block mb-2 text-sm font-body text-gray-900 dark:text-gray-300"> Branch URI: </div> 
                                    <input onChange={handleURIChange} onInput={handleURIChange}
                                    className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="e.g. path/to/my/branch" type="text"/>
                                </div>  
                            </div>
                        </div>
                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button onClick={() => handleBranchButton()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Branch</button>
                            <button onClick={() => {props.setPopup(false)}}  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default BranchPopup