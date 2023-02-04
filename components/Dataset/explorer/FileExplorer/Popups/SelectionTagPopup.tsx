import React, { useEffect, useState } from "react";
import LoadingScreen from "../../../../LoadingScreen";

const SelectionTagPopup = (props) => {

    const [newtag, setNewtag] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setNewtag(e.target.value)
    }

    const handleAdd = async (event) => {
        setLoading(true)
        event.preventDefault();
        var arr: Array<string> = []
        
        for(var i = 0; i < props.selected.length; i++){
            if (props.selected[i]){
                arr.push(props.files[i]['name'])
            }
        }

        arr.push(newtag)

        await fetch(`http://localhost:8000/selection_add_tag`, {
            method: "POST",
            body: JSON.stringify(arr),
            headers: {                             
                "Content-Type": "application/json" 
            } 
        })
        
        for(var i = 0; i < props.selected.length; i++){
            if (props.selected[i]){
                props.files[i]['tags'] = await fetch(`http://localhost:8000/get_tags?file=${props.files[i]['name']}`).then((res) => res.json())
            }
        }
        setLoading(false)
        props.setSelected(Array(props.files.length).fill(false))
        props.shortcuts.current = true
        props.setPopup(false)
    }

    const handleRemove = async () => {
        var arr: Array<string> = []
        setLoading(true)
        for(var i = 0; i < props.selected.length; i++){
            if (props.selected[i]){
                arr.push(props.files[i]['name'])
            }
        }

        await fetch(`http://localhost:8000/selection_remove_all_tags`, {
            method: "POST",
            body: JSON.stringify(arr),
            headers: {                             
                "Content-Type": "application/json" 
            } 
        })
        
        for(var i = 0; i < props.selected.length; i++){
            if (props.selected[i]){
                props.files[i]['tags'] = await fetch(`http://localhost:8000/get_tags?file=${props.files[i]['name']}`).then((res) => res.json())
            }
        }
        setLoading(false)

        props.setSelected(Array(props.files.length).fill(false))
        props.shortcuts.current = true
        props.setPopup(false)
    }

    return (
        <>
            {
                <button onClick={() => {
                    props.shortcuts.current = true
                    props.setPopup(false)}
                    } key={'ctp1'} className="z-40 bg-white/20 backdrop-blur-sm fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
                    click to close
                </button>
            }
            <div className="z-50 p-2 text-sm fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 bg-white dark:bg-gray-900 w-1/4 h-1/4">
                <div className="flex-col justify-between">
                    <div className="w-full justify-between flex">
                        <button onClick={() => {
                            props.shortcuts.current = true
                            props.setPopup(false)
                        }} className='text-xs px-1 w-[15px] h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'> 
                        </button> 
                        <div className="place-self-center text-md py-2 font-bold">
                            Comments on selected files
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
                <div className="w-full">
                        <div className="text-center">
                            Add a comment to selected files
                        </div>
                        <form className="px-5" onSubmit={handleAdd}>
                            <label className="flex justify-center mt-2 gap-1"> 
                                <input onChange={handleChange}
                                    className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="comment" type="text" />   
                                <div className="flex flex-col justify-center">
                                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-body rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        +
                                    </button>
                                </div>
                            </label> 
                        </form>
                        <div className="flex justify-center p-2">
                            <button onClick={handleRemove} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-body rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                Remove all comments
                            </button>
                        </div> 
                    </div>
            </div>
            {
                loading ? <LoadingScreen key={'sltpp_ADFFFPP'}/> : <></>
            }
        </>
    )

}

export default SelectionTagPopup;