import React, { useEffect, useRef, useState } from "react"

const BranchPopup = (props) => {

    const [copy, setCopy] = useState(true)
    const [name, setName] = useState('')

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleBranchButton = async () => {
        const data = JSON.stringify({branch_name: name, branch_type: 'copy'})
        const rest = await fetch('http://localhost:8000/set_branch/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
        )

        window.location.href='/Datasets';
    }

    return (
        <div key={"brnchpp"} className="relative bg-white rounded-lg dark:bg-slate-700 w-full h-[200px] border-[0.5px] border-gray-500">
            <div className="w-full justify-between flex h-[30px]">
                <button onClick={() => props.setPopup(false)} className= 'flex justify-center rounded-tl-lg text-center w-[50px] h-[30px] flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
            </div>
            <div className="flex justify-center h-[120px] gap-2">
                <div className="flex flex-col justify-center">
                    
                    <div>
                        <div className="mr-2"> Branch name: </div> 
                        <input onChange={handleNameChange} onInput={handleNameChange}
                        className= "appearance-none border border-gray-500 rounded w-[400px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="e.g. my_branch" type="text"/>
                    </div>  

                    <div className="flex mt-2">
                        <input key={Math.random()} type="checkbox" checked={copy} onClick={()=>setCopy(!copy)} className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Keep files
                        </label>
                    </div>
                </div>                
            </div>

            <div className="flex justify-around">
                <div className="px-5 flex justify-end gap-2">
                    <button onClick={() => handleBranchButton()} className="bg-green-700 hover:bg-green-900 rounded-md shadow-inner p-2 px-5 text-white">
                        Create branch
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BranchPopup