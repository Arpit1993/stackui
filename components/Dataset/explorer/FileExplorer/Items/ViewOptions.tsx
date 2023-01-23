import React from "react"
import { Popover } from '@headlessui/react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import TuneIcon from '@mui/icons-material/Tune';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';

const ViewOptions = (props) => {
    return (
        <Popover className="relative z-[30]">
            <Popover.Button className='w-fit h-fit'>
                <div className="w-fit h-fit p-2 items-center flex justify-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    <TuneIcon className="fill-black h-5 w-5 dark:fill-white"></TuneIcon>
                </div>
            </Popover.Button>

            <Popover.Panel className="absolute z-auto">
                <div className="flex flex-col z-auto w-44 border border-gray-300 dark:border-gray-800  bg-white rounded divide-y divide-gray-300 shadow dark:bg-gray-900">
                    <div className="flex justify-center p-2">
                        <button className="text-gray-900 w-max bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={() => {
                            if (props.view == 1) {
                                props.setMaxView(36)
                            } else {
                                props.setMaxView(10)
                            }
                            props.setView(1-props.view)
                            props.setPage(0)}}> 
                            
                            <div className="flex gap-2">
                                {
                                    !props.view ? 
                                    <ViewListIcon className="fill-black dark:fill-white"/> 
                                    :
                                    <ViewModuleIcon className="fill-black dark:fill-white"/>
                                }
                                <div className="flex flex-col justify-center">
                                    {   
                                        props.view_label
                                    }
                                </div>
                            </div>
                        </button>
                    </div>
                    <div className="flex justify-center p-2">
                        {
                            !props.view ?
                            <div key={'mmindiv'} className="h-min w-min flex">
                                <button className="py-2 px-4 text-sm font-body text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" onClick={() => {
                                    props.setMaxView(Math.min(Math.pow((Math.sqrt(props.max_view)+1),2),36))
                                    props.setPage(0)}}> 
                                    <ZoomOutIcon/>
                                </button>
                                <button className="py-2 px-4 text-sm font-body text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" onClick={() => {
                                    props.setMaxView(Math.max(Math.pow((Math.sqrt(props.max_view)-1),2),1))
                                    props.setPage(0)}}> 
                                    <ZoomInIcon/>
                                </button>
                            </div> 
                            : 
                            <></>
                        }
                    </div>
                    <div className="flex justify-center p-2">
                        { 
                            !props.view ?        
                            <div key={'csd1'} className="w-full p-2 flex gap-2">
                                <div className="w-1/4">
                                    <FormGroup>
                                        <FormControlLabel control={
                                        <Switch
                                        checked={props.thumbnailView} size="small"
                                        onChange={() => {props.setThumbnailView(!props.thumbnailView)}}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        />} label="" />
                                    </FormGroup>
                                </div>
                                <div className="w-3/4 flex-col flex justify-center"> 
                                    {"Fill thumbnail"}
                                </div>
                            </div>
                            :
                            <></>
                        }    
                    </div>
                    <div className="flex justify-center p-2">
                        { 
                            props.schema == 'yolo' || props.schema == 'labelbox' ?        
                            <div key={'csd2'} className="w-full p-2 flex gap-2">
                                <div className="w-1/4">
                                    <FormGroup>
                                        <FormControlLabel control={
                                        <Switch
                                        checked={props.switch_} size="small"
                                        onChange={() => {
                                            fetch(`http://localhost:8000/set_bounding_boxes?val=${props.switch_}`)
                                            props.setFiltering(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
                                            props.setFiltering(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
                                            props.setSwitch(!props.switch_)
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        />} label="" />
                                    </FormGroup>
                                </div>
                                <div className="w-3/4 flex-col flex justify-center"> 
                                    {'View annotations'}
                                </div>
                            </div>
                            :
                            <></>
                        }    
                    </div>
                </div>
            </Popover.Panel>
        </Popover>
    )
}

export default ViewOptions