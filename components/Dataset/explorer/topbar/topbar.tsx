import React from "react";
import {  useState } from "react";
import { Tooltip } from "@mui/material";
import AddFilePopup from "../../Modals/AddFilePopup";
import YOLOFilterPopup from "../../Modals/Filters/YOLOFilterPopup";
import FileFilterPopup from "../../Modals/Filters/FileFilterPopup";
import QAFilterPopup from "../../Modals/Filters/QAFilterPopup";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScienceIcon from '@mui/icons-material/Science';
import NERFilterPopup from "../../Modals/Filters/NERFilterPopup";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Seq2SeqFilterPopup from "../../Modals/Filters/Seq2SeqFilterPopup";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import Infobar from "./infobar/Infobar";

const TopBar = (props) => {

    const [filterPopup, setFilterPopup] = useState<Boolean>(false)
    const [addPopup, setAddPopup] = useState<Boolean>(false)
    const [txt, setText] = useState<String>('')
    const [callFilter, setCallFilter] = useState<Boolean>(false)
    const [infobar, setInfobar] = useState<Boolean>(false)

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
               <div className="w-[15%] flex h-max py-2 px-5 justify-center flex-col">
                    <div className="w-3/4 overflow-x-auto">
                        <h1 className="font-medium dark:text-white w-max"> {props.props.dataset} </h1>
                    </div>
                    <div className="w-3/4 overflow-x-auto">
                        <h2 className="w-max underline text-ellipsis text-sm text-gray-500 dark:text-gray-400"> 
                            {props.props.URI}
                        </h2>
                    </div>
               </div>
                <div className="w-[95%] flex text-ellipsis justify-end items-center">
                    
                    <div className="w-[65%] items-end">
                        <ul className="w-full flex items-end flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                            <li className="mr-2">
                                <button onClick={()=> {props.shortcuts.current = addPopup; setAddPopup(!addPopup)}} 
                                    className={addPopup ? "inline-flex p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" : "inline-flex p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}
                                    aria-current="page">
                                    <CloudUploadIcon className="h-5 w-5 mr-2"/>
                                    Upload
                                </button>
                            </li>
                            <li className="mr-2">
                                <button onClick={()=>{if(props.tab != 2){props.shortcuts.current = filterPopup; setFilterPopup(!filterPopup)}}} 
                                    className={filterPopup ? "inline-flex p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" : "inline-flex p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                                    <FilterAltIcon className="h-5 w-5 mr-2"/>
                                    Filter
                                </button>
                            </li>
                            <li className="mr-2">
                                <button onClick={()=>{props.shortcuts.current = true; props.setTab(0)}} 
                                    className={(props.tab == 0) ? "inline-flex p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" : "inline-flex p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                                    <DashboardIcon className="h-5 w-5 mr-2"/>
                                    Explorer
                                </button>
                            </li>
                            <li className="mr-2">
                                <button onClick={()=>{props.shortcuts.current = (props.tab == 2) ? true : false; props.setTab((props.tab == 2) ? 0 : 2)}} 
                                    className={(props.tab == 2) ? "inline-flex p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" : "inline-flex p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                                    <ScienceIcon className="h-5 w-5 mr-2"/>
                                    Experiments
                                </button>
                            </li>
                            <li className="mr-2">
                                <button onClick={()=>{props.shortcuts.current = (props.tab == 1) ? true : false; props.setTab((props.tab == 1) ? 0 : 1)}} 
                                    className={(props.tab == 1) ? "inline-flex p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group" : "inline-flex p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                                    <BarChartIcon className="h-5 w-5 mr-2"/>
                                    Statistics
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="w-[25%] py-2 text-black inline-block align-middle">
                        <form className="px-3" onSubmit={handleSubmit}>
                            <label className="flex justify-end gap-2"> 
                                <div className="dark:text-white">
                                    <input onChange={handleChange} placeholder="Key search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
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

                    <button type="button" onClick={()=>{setInfobar(!infobar)}} className="text-gray-900 bg-white border border-gray-300 focus:outline-none
                     hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
                      dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600
                       dark:focus:ring-gray-700">
                        <ReadMoreIcon className="w-5 h-5"/>
                    </button>

                </div>
                {
                    (infobar)
                    ?
                    <Infobar setPopup={setInfobar} shortcuts={props.shortcuts} commits={props.commits} dataset={props.dataset}/>
                    :
                    <></>
                }
                {
                    (props.schema == 'yolo' || props.schema == 'labelbox') 
                    ? 
                        (filterPopup && props.tab != 2) 
                        ? 
                            <YOLOFilterPopup shortcuts={props.shortcuts} setPage={props.setPage} callFilter={callFilter} setCallFilter={setCallFilter} schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'yffp'}/> 
                        : 
                            <></>
                    :
                    
                        (props.schema.includes('ner'))
                        ?
                            (filterPopup && props.tab != 2) 
                            ? 
                                <NERFilterPopup shortcuts={props.shortcuts} setPage={props.setPage} callFilter={callFilter} setCallFilter={setCallFilter} schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'yffp'}/> 
                            : 
                                <></>
                        :
                        (props.schema.includes('seq'))
                        ?
                            (filterPopup && props.tab != 2) 
                            ? 
                                <Seq2SeqFilterPopup shortcuts={props.shortcuts} setPage={props.setPage} callFilter={callFilter} setCallFilter={setCallFilter} schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'yffp'}/> 
                            : 
                                <></>
                        :
                        (props.schema.includes('qa'))
                        ?
                            (filterPopup && props.tab != 2) 
                            ? 
                                <QAFilterPopup shortcuts={props.shortcuts} setPage={props.setPage} callFilter={callFilter} setCallFilter={setCallFilter} schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'yffp'}/> 
                            : 
                                <></>
                            :
                            (filterPopup && props.tab != 2)  
                            ? 
                                <FileFilterPopup shortcuts={props.shortcuts} setPage={props.setPage} callFilter={callFilter} setCallFilter={setCallFilter} schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'fffp'}/> 
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