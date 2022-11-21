import React from "react";
import {  useState } from "react";
import { Tooltip } from "@mui/material";
import AddFilePopup from "../../popups/AddFilePopup";
import Image from "next/image";
import YOLOFilterPopup from "../../popups/YOLOFilterPopup";
import FileFilterPopup from "../../popups/FileFilterPopup";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Dvr } from "@mui/icons-material";

function commit(comment: string){
    fetch('http://localhost:8000/commit_req?comment='.concat(comment))
    window.location.reload();
    return true
}

const TopBar = (props) => {

    const [filterPopup, setFilterPopup] = useState(false)
    const [addPopup, setAddPopup] = useState(false)
    const [txt, setText] = useState('')
    const [callFilter, setCallFilter] = useState(false)

    const handleChange = (event: React.ChangeEvent<any>) => {
        setText(event.target.value)
    }

    const handleSubmit = (event: React.ChangeEvent<any> ) => {
        event.preventDefault()
        props.setShortcuts(false)
        setFilterPopup(true)
        setCallFilter(true)
    }
    
    return (    
        <>
            <div className="flex w-full justify-between relative">
               <div className="w-1/3 flex flex-col">
                    <div className="w-3/4 overflow-x-auto">
                    <h1 className="font-semibold text-lg px-2 py-2 w-max h-10"> {props.props.dataset} </h1>
                    </div>
                    <div className="w-3/4 overflow-x-auto">
                        <h2 className="px-2 py-2 w-max h-10 underline text-ellipsis hover:cursor-pointer"> 
                            {props.props.URI}
                        </h2>
                    </div>
               </div>
                <div className="flex w-2/3 text-ellipsis justify-end">
                    <div className="flex gap-2 mt-6 w-full">
                        <button onClick={()=>commit('')} className="h-min py-2.5 px-5 mr-2 mb-2 text-sm font-body text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> 
                            <div className="flex flex-col justify-center">
                                <div className="flex gap-2">
                                    <RefreshIcon className="h-5 w-5"/>
                                    {'Refresh'}
                                </div>
                            </div>
                        </button>

                        <button onClick={()=>
                            {
                                props.setShortcuts(addPopup)
                                setAddPopup(!addPopup)
                            }
                            } className="h-min text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" > 
                            <div className="flex gap-2">
                                    <CloudUploadIcon className="h-5 w-5"/>
                                    {'Upload'}
                                </div>
                        </button>

                        <button onClick={()=>
                            {
                                props.setShortcuts(filterPopup)
                                setFilterPopup(!filterPopup)
                            }
                            } className="w-[60px] h-[40px] flex flex-col justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" > 
                            {<Image className="invert" src={'/Icons/filter-search.png'} alt='' width={'40px'} height={'40px'} objectFit={'contain'} />}
                        </button>
                        
                    </div>
                    <div className="w-full py-6 text-black inline-block align-middle">
                        <form className="px-5" onSubmit={handleSubmit}>
                            <label className="flex justify-end gap-2"> 
                                <div className="dark:text-white">
                                    <input onChange={handleChange} placeholder="Filename search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                </div>
                                <Tooltip title={'Applies a search filter to the dataset'} placement="bottom">
                                    <div className="flex flex-col justify-center">
                                        <button className="p-2.5 ml-2 text-sm font-body text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </button>
                                    </div>
                                </Tooltip>
                            </label> 
                        </form> 
                        
                    </div>
                </div>
                {
                    (props.schema == 'yolo' || props.schema == 'labelbox') 
                    ? 
                        (filterPopup) 
                        ? 
                            <YOLOFilterPopup setShortcuts={props.setShortcuts} setPage={props.setPage} callFilter={callFilter} setCallFilter={setCallFilter} schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'yffp'}/> 
                        : 
                            <></>
                    :
                        (filterPopup) 
                        ? 
                            <FileFilterPopup setShortcuts={props.setShortcuts} setPage={props.setPage} callFilter={callFilter} setCallFilter={setCallFilter} schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'fffp'}/> 
                        : 
                            <></>

                }
            </div>
            { 
                addPopup ? <AddFilePopup popup={addPopup} setShortcuts={props.setShortcuts} setPopup={setAddPopup} key={'afpp'}/> : <></>
            }
        </>
    )
}

export default TopBar;