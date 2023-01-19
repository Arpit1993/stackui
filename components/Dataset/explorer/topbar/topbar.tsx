import React from "react";
import {  useState } from "react";
import { Tooltip } from "@mui/material";
import AddFilePopup from "../../popups/AddFilePopup";
import { posthog } from "posthog-js";
import YOLOFilterPopup from "../../popups/YOLOFilterPopup";
import FileFilterPopup from "../../popups/FileFilterPopup";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScienceIcon from '@mui/icons-material/Science';
import YOLOStatistics from "../../tabs/statistics/YOLOStatistics";
import NERFilterPopup from "../../popups/NERFilterPopup";
import NERStatistics from "../../tabs/statistics/NERStatistics";
import Experiments from "../../tabs/experiments/Experiments";
import BugReportIcon from '@mui/icons-material/BugReport';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

function commit(comment: string){
    fetch('http://localhost:8000/commit_req?comment='.concat(comment))
    window.location.reload();
    return true
}

function diagnose(){
    fetch('http://localhost:8000/diagnose').then(
        () => {window.location.reload();}
    )
    return true
}

const TopBar = (props) => {

    const [filterPopup, setFilterPopup] = useState<Boolean>(false)
    const [addPopup, setAddPopup] = useState<Boolean>(false)
    const [txt, setText] = useState<String>('')
    const [callFilter, setCallFilter] = useState<Boolean>(false)
    const [tab, setTab] = useState<number>(0)

    const handleChange = (event: React.ChangeEvent<any>) => {
        setText(event.target.value)
    }

    const handleSubmit = (event: React.ChangeEvent<any> ) => {
        event.preventDefault()
        props.shortcuts.current = false
        setFilterPopup(true)
        setCallFilter(true)
    }
    
    return (    
        <>
            <div className="flex w-full h-full justify-between relative">
               <div className="w-[20%] flex h-max py-2 px-5 justify-center flex-col">
                    <div className="w-3/4 overflow-x-auto">
                        <h1 className="font-medium dark:text-white w-max"> {props.props.dataset} </h1>
                    </div>
                    <div className="w-3/4 overflow-x-auto">
                        <h2 className="w-max underline text-ellipsis text-sm text-gray-500 dark:text-gray-400"> 
                            {props.props.URI}
                        </h2>
                    </div>
               </div>
                <div className="w-[80%] flex text-ellipsis justify-end  items-center">
                    {/*

                        

                        <Tooltip title={'Filter'} placement="top">
                            <button onClick={()=>{if(tab != 2){props.shortcuts.current = filterPopup; setFilterPopup(!filterPopup)}}} className="w-[60px] h-[40px] flex flex-col justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" > 
                                {<Image className="invert" src={'/Icons/filter-search.png'} alt='' width={'40px'} height={'40px'} objectFit={'contain'} />}
                            </button>
                        </Tooltip>
                        
                    </div> */}
                    
                    <div className="w-3/4 items-center">
                        <ul className="w-full flex items-center flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                            <li className="mr-2">
                                <button onClick={()=> {props.shortcuts.current = addPopup; setAddPopup(!addPopup)}} 
                                    className={addPopup ? "inline-flex p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" : "inline-flex p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}
                                    aria-current="page">
                                    <CloudUploadIcon className="h-5 w-5 mr-2"/>
                                    Upload
                                </button>
                            </li>
                            <li className="mr-2">
                                <button onClick={()=>{if(tab != 2){props.shortcuts.current = filterPopup; setFilterPopup(!filterPopup)}}} 
                                    className={filterPopup ? "inline-flex p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" : "inline-flex p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                                    <FilterAltIcon className="h-5 w-5 mr-2"/>
                                    Filter
                                </button>
                            </li>
                            <li className="mr-2">
                                <button onClick={()=>{props.shortcuts.current = (tab == 2) ? true : false; setTab((tab == 2) ? 0 : 2)}} 
                                    className={(tab == 2) ? "inline-flex p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" : "inline-flex p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                                    <ScienceIcon className="h-5 w-5 mr-2"/>
                                    Experiments
                                </button>
                            </li>
                            <li className="mr-2">
                                <button onClick={()=>{props.shortcuts.current = (tab == 1) ? true : false; setTab((tab == 1) ? 0 : 1)}} 
                                    className={(tab == 1) ? "inline-flex p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" : "inline-flex p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                                    <BarChartIcon className="h-5 w-5 mr-2"/>
                                    Statistics
                                </button>
                            </li>
                            <li className="ml-2 mr-2">
                                <button onClick={()=>commit('')} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                    <RefreshIcon className="h-5 w-5 mr-2"/>
                                    Refresh
                                </button>
                            </li>
                            <li className="mr-2">
                                <button onClick={()=>{posthog.capture('bug report button', { property: 'value' }); diagnose()}} 
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                    <BugReportIcon className="h-5 w-5 mr-2"/>
                                    Diagnose
                                </button>
                            </li>
                        </ul>
                    </div>


                    <div className="w-1/4 py-2 text-black inline-block align-middle">
                        <form className="px-3" onSubmit={handleSubmit}>
                            <label className="flex justify-end gap-2"> 
                                <div className="dark:text-white">
                                    <input onChange={handleChange} placeholder="Filename search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                </div>
                                <Tooltip title={'Applies a search filter to the dataset'} placement="top">
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
                        (filterPopup && tab != 2) 
                        ? 
                            <YOLOFilterPopup shortcuts={props.shortcuts} setPage={props.setPage} callFilter={callFilter} setCallFilter={setCallFilter} schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'yffp'}/> 
                        : 
                            <></>
                    :
                    
                        (props.schema.includes('ner'))
                        ?
                            (filterPopup && tab != 2) 
                            ? 
                                <NERFilterPopup shortcuts={props.shortcuts} setPage={props.setPage} callFilter={callFilter} setCallFilter={setCallFilter} schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'yffp'}/> 
                            : 
                                <></>
                        :
                            (filterPopup && tab != 2)  
                            ? 
                                <FileFilterPopup shortcuts={props.shortcuts} setPage={props.setPage} callFilter={callFilter} setCallFilter={setCallFilter} schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'fffp'}/> 
                            : 
                                <></>

                }
                {
                    (props.schema == 'yolo' || props.schema == 'labelbox') 
                    ? 
                        (tab == 1) 
                        ? 
                            <YOLOStatistics schema={props.schema} filtering={props.filtering} shortcuts={props.shortcuts}  /> 
                        : 
                            <></>
                    :
                        (props.schema.includes('ner')) 
                        ? 
                            (tab == 1) 
                            ? 
                                <NERStatistics schema={props.schema} filtering={props.filtering} shortcuts={props.shortcuts}  /> 
                            : 
                                <></>
                        :
                                <></>
                }
                {
                    (tab == 2) 
                    ? 
                        <Experiments schema={props.schema} shortcuts={props.shortcuts}  />
                    : 
                        <></>
                }
            </div>
            { 
                addPopup ? <AddFilePopup popup={addPopup} shortcuts={props.shortcuts} setPopup={setAddPopup} key={'afpp'}/> : <></>
            }
        </>
    )
}

export default TopBar;