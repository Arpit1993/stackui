import AccountTreeIcon from '@mui/icons-material/AccountTree';
import React, { useEffect, useState } from "react"
import { Popover } from '@headlessui/react'
import CloseIcon from '@mui/icons-material/Close';
import MergeIcon from '@mui/icons-material/Merge';
import { Tooltip } from "@mui/material";
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';

const SliceButton = (props) => {
    const [slice, setSlice] = useState<String>('')
    const [mode, setMode] = useState<number>(0)

    const [slices, setSlices] = useState<Object>({})
    const [branches, setBranches] = useState<Array<any>>([])
    const [hierarchy, setHierarchy] = useState<any>({'parent': '', 'children': Array(0)})

    useEffect(() => {
        fetch('http://localhost:8000/get_slices/').then((res) => res.json())
        .then(setSlices)

        fetch('http://localhost:8000/get_branches/').then((res) => res.json())
        .then(setBranches)

        fetch('http://localhost:8000/get_current_hierarchy/').then((res) => res.json())
        .then(setHierarchy)
    }, [props.dataset])

    const handleMerge = (uri) => {
        fetch(`http://localhost:8000/merge_child_to_master?uri=${uri}`).then(() => {window.location.reload()})
    }

    const handleMergeCurrent = () => {
        fetch(`http://localhost:8000/merge_current_to_master`).then(() => {window.location.reload()})
    }
    
    const handleResetSliceClick = () => {
        fetch(`http://localhost:8000/reset_slices`).then(() => {
            props.setFiltering((Math.random() + 1).toString(36).substring(7))
        }).then(() => {
            setSlice('')
        })
    }

    const handleRemoveSliceClick = (slice_name) => {
        fetch(`http://localhost:8000/remove_slice/?slice_name=${slice_name}`).then(() => {
            fetch('http://localhost:8000/get_slices/').then((res) => res.json())
            .then(setSlices).then(() => handleResetSliceClick)
        })
        handleResetSliceClick()
    }
    
    const handleSliceClick = (slice_name) => {
        const data = JSON.stringify([slice_name])
        fetch(`http://localhost:8000/select_slice`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json" 
            }, 
            body: data}).then(() => {
            setSlice(slice_name)
        }).then(() => {
            props.setFiltering((Math.random() + 1).toString(36).substring(7))
        })
    }

    return (
        <Popover className="relative z-[30]">
            <Popover.Button className='w-full h-[50px] flex flex-col justify-center text-xs'>
                <div className="w-full h-[50px] text-xs flex gap-2 justify-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    <AccountTreeIcon className="fill-black dark:fill-white h-[20px]"/>
                    <div className='overflow-clip text-clip text-left text-black h-[16px]'>
                        {
                            (slice == '') ? (hierarchy.parent == ''? 'main' : `branch`) : slice
                        }
                    </div>
                </div>
            </Popover.Button>

            <Popover.Panel className="absolute z-auto">
                <div className="flex flex-col z-auto w-72 border border-gray-300 dark:border-gray-800 bg-white rounded divide-y divide-gray-300 shadow dark:bg-gray-900">
                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px">
                            <li className=":">
                                <button onClick={()=>{setMode(0)}} className={mode == 0 ? "inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"}>
                                    Slices
                                </button>
                            </li>
                            <li className="">
                                <button onClick={()=>{setMode(1)}} className={mode == 1 ? "inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"} aria-current="page">
                                    Branches
                                </button>
                            </li>
                            <li className="">
                                <button onClick={()=>{setMode(2)}} className={mode == 2 ? "inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"} aria-current="page">
                                    Versions
                                </button>
                            </li>
                        </ul>
                    </div>
                    {
                        (mode == 0) ? 
                        <>
                            <button onClick={()=>handleResetSliceClick()} className="flex justify-center p-2 bg-zinc-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-slate-800">
                                <div className="flex gap-2 text-xs">
                                    <div>
                                        All data
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </button>
                            {
                                Object.keys(slices).map(
                                    (slice_name) => 
                                        {
                                            // eslint-disable-next-line react/jsx-key
                                            return <button onClick={() => handleSliceClick(slice_name)} className="flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <div className="flex gap-1 justify-between w-full text-xs">
                                                    <div>
                                                        {slice_name}
                                                    </div>
                                                    <div>
                                                        ({slices[slice_name]})
                                                    </div>
                                                    <Tooltip title={'Delete slice'} placement="right">
                                                        <button onClick={() => handleRemoveSliceClick(slice_name)}>
                                                            <CloseIcon className="hover:fill-slate-500"/>
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </button>
                                        }
                                )
                            }   
                        </>
                        : null
                    }

{
                        (mode == 1) ? 
                        <>
                            <button onClick={()=>{}} className="flex justify-center p-2 bg-zinc-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-slate-800">
                                <div className="flex justify-between gap-2 text-xs">
                                    <div>
                                        {(hierarchy.parent == ''? 'main' : `branch of ${hierarchy.parent}`)}
                                    </div>
                                    <div>
                                        {
                                            (
                                                (hierarchy.parent == '') ? null : 
                                                <Tooltip title={'Merge to parent'} placement="right">
                                                    <button onClick={() => {handleMergeCurrent()}}>
                                                        <VerticalAlignTopIcon className="hover:fill-slate-500"/>
                                                    </button>
                                                </Tooltip>
                                            )
                                        }
                                    </div>
                                </div>
                            </button>
                            {
                                branches.map(
                                    (child) => 
                                        {
                                            // eslint-disable-next-line react/jsx-key
                                            return <button onClick={() => {window.location.href='/dataset/'.concat(encodeURIComponent(child));}} className="flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <div className="flex gap-1 justify-between w-full text-xs">
                                                    <div>
                                                        {child}
                                                    </div>
                                                    <Tooltip title={'Merge to main'} placement="right">
                                                        <button onClick={() => {handleMerge(child)}}>
                                                            <MergeIcon className="hover:fill-slate-500"/>
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </button>
                                        }
                                )
                            }   
                        </>
                        : null
                    }
                </div>
            </Popover.Panel>
        </Popover>
    )
}

export default SliceButton