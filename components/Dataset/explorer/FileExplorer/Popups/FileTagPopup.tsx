import React, { useEffect, useState } from "react";

const FileTagPopup = (props) => {

    const [tags, setTags] = useState(props.file['tags'])
    const [newtag, setNewtag] = useState('')

    const handleChange = (e) => {
        setNewtag(e.target.value)
    }

    const handleDelete = async (tag) => {
        await fetch(`http://localhost:8000/remove_tag?file=${props.file['name']}&tag=${tag}`)
        props.file['tags'] = await fetch(`http://localhost:8000/get_tags?file=${props.file['name']}`).then((res) => res.json())
        setTags(await props.file['tags'])
        if(props.file['tags'].length == 0){
            props.shortcuts.current = true
            props.setPopup(false)
        }
    }

    const handleAdd = async (event) => {
        event.preventDefault();
        await fetch(`http://localhost:8000/add_tag?file=${props.file['name']}&tag=${newtag}`)
        props.file['tags'] = await fetch(`http://localhost:8000/get_tags?file=${props.file['name']}`).then((res) => res.json())
        setTags(await props.file['tags'])
        props.shortcuts.current = true
        props.setPopup(false)
    }

    return (
        <>
            {
                <button onClick={() => {
                    props.shortcuts.current = true
                    props.setPopup(false)
                    }} key={'ctp1'} className="z-40 bg-white/20 backdrop-blur-sm  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
                    click to close
                </button>
            }
            <div className="z-50 p-2 text-sm rounded-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-300 bg-white dark:bg-gray-900 w-1/4 h-1/4">
                <div className="flex-col justify-between">
                    <div className="w-full justify-between flex">
                        <button onClick={() => {
                            props.shortcuts.current = true
                            props.setPopup(false)
                            }} className='text-xs px-1 w-[15px] h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'> 
                        </button> 
                        <div className="place-self-center text-md py-2 font-bold">
                            File comments
                        </div>
                        <div></div>
                    </div>
                    <div className="w-full">
                        <div className="border overflow-scroll border-gray-300 rounded-md items-center h-[50px] p-1 flex gap-2">
                            {
                                (tags.length > 0) ?
                                tags.map( (tag, idx) => 
                                    <span key={'tag'.concat(tag)} id="badge-dismiss-default" className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                                        {tag}
                                    <button onClick={() => handleDelete(tag)} className="inline-flex items-center p-0.5 ml-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                        <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                  </span>
                                ) : <></>
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full">
                        <form className="px-5" onSubmit={handleAdd} >
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
                    </div>
            </div>
        </>
    )

}

export default FileTagPopup;