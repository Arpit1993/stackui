import React, { useEffect, useState } from "react";

const FileTagPopup = (props) => {

    const [tags, setTags] = useState(props.file['tags'])
    const [newtag, setNewtag] = useState('')

    const CloseComponent = [
        <button onClick={() => props.setPopup(false)} key={'ctp1'} className="z-40 bg-white/20 backdrop-blur-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
            click to close
        </button>
    ]

    const handleChange = (e) => {
        setNewtag(e.target.value)
    }

    const handleDelete = async (tag) => {
        await fetch(`http://localhost:8000/remove_tag?file=${props.file['name']}&tag=${tag}`)
        props.file['tags'] = await fetch(`http://localhost:8000/get_tags?file=${props.file['name']}`).then((res) => res.json())
        setTags(await props.file['tags'])
        if(props.file['tags'].length == 0){
            props.setPopup(false)
        }
    }

    const handleAdd = async () => {
        await fetch(`http://localhost:8000/add_tag?file=${props.file['name']}&tag=${newtag}`)
        props.file['tags'] = await fetch(`http://localhost:8000/get_tags?file=${props.file['name']}`).then((res) => res.json())
        setTags(await props.file['tags'])
    }

    return (
        <>
            {CloseComponent}
            <div className="z-50 p-2 text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 bg-white dark:bg-gray-900 w-1/4 h-1/4">
                <div className="flex-col justify-between">
                    <div className="w-full justify-between flex">
                        <button onClick={() => props.setPopup(false)} className='text-xs px-1 w-[15px] h-[15px] flex-col bg-red-400 hover:bg-red-200 rounded-full'> 
                        </button> 
                        <div className="place-self-center text-md py-2 font-bold">
                            File tags
                        </div>
                        <div>

                        </div>
                    </div>
                    <div className="w-full">
                        {/* list of tags */}
                        <div className="border border-black overflow-scroll h-[40px] p-2 flex gap-2">
                            {
                                (tags.length > 0) ?
                                tags.map( (tag, idx) => 
                                    <div className="flex flex-col w-max h-[20px] justify-center">
                                        <button className="flex justify-between bg-gray-300 rounded-full" onClick={() => handleDelete(tag)}>  
                                            <div className="py-2 px-1 flex flex-col justify-center">
                                                <div className="rounded-full w-[10px] h-[10px] bg-red-500"> 
                                                </div>
                                            </div>
                                            <div className="text-xs px-1 pr-2 py-1 text-black"> 
                                                {tag}
                                            </div>
                                        </button>
                                    </div>
                                ) : <></>
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full">
                        <form className="px-5">
                            <label className="flex justify-center mt-2"> 
                                <input onChange={handleChange}
                                    className= "p-2 shadow-inner border rounded-dm border-gray-200 outline-2 bg-white dark:bg-gray-500" 
                                    placeholder="tag" type="text" />   
                                <div className="flex flex-col justify-center">
                                    <button onClick={handleAdd} className="bg-gray-300 hover:bg-gray-400 hover:shadow-lg text-black h-[40px] rounded-r-md text-sm px-2">
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