import React from "react";
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

const ReadmePopup = (props) => {

    const [edit, setEdit] = useState(false);

    useEffect(()=>{

    },[])
    
    const CloseComponent = [
        <button key={'ccrm'} onClick={() => props.setPopup(0)} className=" bg-black/50 z-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
        click to close
        </button>
    ]

    return (
    <>
        {CloseComponent}
        <div className="text-sm absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-900 w-[1100px]  h-[700px]">
            <div className="w-full justify-between flex">
                <div className="py-1 px-2">
                    <button onClick={() => props.setPopup(false)} className='text-xs px-1 w-[15px] h-[15px] flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                </div> 
                <div className="place-self-center py-2 font-bold">
                    readme file
                </div>
                <div></div>
            </div>
            <div className="w-full h-full p-2 overflow-y-scroll">
                <ReactMarkdown children={props.readme} remarkPlugins={[remarkGfm]}/>
            </div>
        </div>
    </>)
}

export default ReadmePopup;