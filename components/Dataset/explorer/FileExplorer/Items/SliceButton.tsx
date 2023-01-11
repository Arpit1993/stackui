import AccountTreeIcon from '@mui/icons-material/AccountTree';
import React, { useEffect, useState } from "react"
import { Popover } from '@headlessui/react'
import CloseIcon from '@mui/icons-material/Close';
import MergeIcon from '@mui/icons-material/Merge';
import { Tooltip } from "@mui/material";
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckpointModal from './CheckpointModal';

const SliceButton = (props) => {
    const [nullStr, setNullStr] = useState<String>('')
    const [slice, setSlice] = useState<String>('')
    const [mode, setMode] = useState<number>(0)
    const [checkpoint, setCheckpoint] = useState<Boolean>(false)

    const [slices, setSlices] = useState<Object>({})
    const [branches, setBranches] = useState<Array<any>>([])
    const [versions, setVersions] = useState<Object>({})
    const [hierarchy, setHierarchy] = useState<any>({'parent': {'uri': '', 'name': ''}, 'children': Array(0)})

    useEffect(() => {
        fetch('http://localhost:8000/get_slices/').then((res) => res.json())
        .then(setSlices)

        fetch('http://localhost:8000/get_branches/').then((res) => res.json())
        .then(setBranches)

        fetch('http://localhost:8000/get_current_hierarchy/').then((res) => res.json())
        .then(setHierarchy)

        fetch('http://localhost:8000/get_versions/').then((res) => res.json())
        .then(setVersions)
    }, [props.dataset, mode, nullStr])

    const handleSelectVersion = (version) => {
        fetch(`http://localhost:8000/select_version?version=${version}`).then(() => {props.setFiltering(`SStver1${version}`);props.setFiltering(`SStver2${version}`)})
    }
    
    const handleResetVersion = () => {
        fetch(`http://localhost:8000/reset_version`).then(() => {window.location.reload()})
    }

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
        <>
            {
                checkpoint ? <CheckpointModal setPopup={setCheckpoint} setFiltering={props.setFiltering} setNullStr={setNullStr}/> : null
            }
            <Popover className="relative z-[30]">
                <Popover.Button className='w-full h-[50px] flex flex-col justify-center text-xs'>
                    <Tooltip title={'Dataset slices, branches, and versions'} placement="right">
                        <div className="w-full h-[50px] text-xs flex gap-2 items-center justify-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-body rounded-lg px-2 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                            <AccountTreeIcon className="fill-black dark:fill-white h-[20px]"/>
                            <div className='overflow-clip text-clip text-left dark:text-white text-black h-[16px]'>
                                {
                                    (slice == '') ? (hierarchy.parent['name'] == ''? 'main' : `branch`) : slice
                                }
                            </div>
                            <ArrowDropDownIcon className="fill-black dark:fill-white h-[20px]"/>
                        </div>
                    </Tooltip>
                </Popover.Button>

                <Popover.Panel className="absolute z-auto">
                    <div className="flex flex-col z-auto w-[290px] border border-gray-300 dark:border-gray-800 bg-white rounded divide-y divide-gray-300 shadow dark:bg-gray-900">
                        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                            <ul className="flex flex-wrap -mb-px">
                                <li className=":">
                                    <Tooltip title={'Lists all the subsets of the dataset (slices)'} placement="right">
                                        <button onClick={()=>{setMode(0)}} className={mode == 0 ? "inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"}>
                                            Slices
                                        </button>
                                    </Tooltip>
                                </li>
                                <li className="">
                                    <Tooltip title={'Lists all the branches (or parents) of this dataset'} placement="right">
                                        <button onClick={()=>{setMode(1)}} className={mode == 1 ? "inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"} aria-current="page">
                                            Branches
                                        </button>
                                    </Tooltip>
                                </li>
                                <li className="">
                                    <Tooltip title={'Preview previous versions of the dataset'} placement="right">
                                        <button onClick={()=>{setMode(2)}} className={mode == 2 ? "inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"} aria-current="page">
                                            Checkpoints
                                        </button>
                                    </Tooltip>
                                </li>
                            </ul>
                        </div>
                        {
                            (mode == 0) ? 
                            <>
                                <button onClick={()=>handleResetSliceClick()} className="flex w-full p-2 bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800">
                                    <div className="flex w-full justify-between gap-2 text-xs">
                                        <div>
                                            All data
                                        </div>
                                        <div>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">Default</span>
                                        </div>
                                    </div>
                                </button>
                                {
                                    Object.keys(slices).map(
                                        (slice_name) => 
                                            {
                                                return <div key={`slice component ${slice_name}`} className="flex items-center p-2">
                                                    <div className="flex items-center gap-1 justify-between w-full text-xs">
                                                        <button className='flex gap-1 justify-between w-full' onClick={() => handleSliceClick(slice_name)}>
                                                            <div>
                                                                {slice_name}
                                                            </div>
                                                            <div>
                                                                ({slices[slice_name]})
                                                            </div>
                                                        </button>
                                                        <Tooltip title={'Delete slice'} placement="right">
                                                            <button onClick={() => handleRemoveSliceClick(slice_name)}>
                                                                <CloseIcon className="hover:fill-gray-500"/>
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            }
                                    )
                                }   
                            </>
                            : null
                        }

                        {
                            (mode == 1) ? 
                            <>
                                <button onClick={()=>{if(hierarchy.parent['uri'] != ''){window.location.href='/dataset/'.concat(encodeURIComponent(hierarchy.parent['uri']));}}} className="flex justify-center p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800">
                                    <div className="flex items-center justify-between gap-2 text-xs">
                                        <Tooltip title={(hierarchy.parent['uri'] == '') ? '' : `URI: ${hierarchy.parent['uri']}`} placement="left">
                                            <div>
                                                {
                                                    hierarchy.parent['uri'] == '' ? 'main' : 
                                                    `branch of ${hierarchy.parent['name']}`
                                                }
                                            </div>
                                        </Tooltip>
                                        <div>
                                            {
                                                (
                                                    (hierarchy.parent['uri'] == '') ? null : 
                                                    <Tooltip title={`Merge to parent`} placement="right">
                                                        <button onClick={() => {handleMergeCurrent()}}>
                                                            <VerticalAlignTopIcon className="hover:fill-gray-500"/>
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
                                                return <div className="flex p-2">
                                                    <div className="flex gap-1 justify-between w-full text-xs">
                                                        <Tooltip title={`URI: ${child.uri}`} placement="left">
                                                            <button className='w-[80%] overflow-clip' onClick={() => {window.location.href='/dataset/'.concat(encodeURIComponent(child.uri));}} >
                                                                {child.name}
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip title={'Merge to main'} placement="right">
                                                            <button onClick={() => {handleMerge(child.uri)}}>
                                                                <MergeIcon className="hover:fill-gray-500"/>
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            }
                                    )
                                }   
                            </>
                            : null
                        }

                        {
                            (mode == 2) ? 
                            <>
                                <button onClick={()=>{handleResetVersion()}} className="flex w-full p-2 bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800">
                                    <div className="flex justify-between w-full gap-2 text-xs">
                                        <div>
                                            {'Latest version'}
                                        </div>
                                        <div>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">Default</span>
                                        </div>
                                    </div>
                                </button>
                                {
                                    Object.keys(versions).slice(0).reverse().map(
                                        (version) => 
                                            {
                                                // eslint-disable-next-line react/jsx-key 
                                                return version == "current_v" ? null : <div className="flex p-2 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800">
                                                    <Tooltip title={`Preview of dataset at ${versions[version].date}`} placement="right">
                                                        <button onClick={() => { handleSelectVersion(version) }} className="flex gap-1 justify-between w-full text-xs">
                                                            {versions[version].label.replace('Version','Checkpoint')}
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            }
                                    )
                                }
                                <div className="flex p-2 justify-center dark:bg-gray-900">
                                    <Tooltip title={`Create a new version tag with current data`} placement="right">
                                        <button onClick={() => {setCheckpoint(true)}} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                            {'New checkpoint'}
                                        </button>
                                    </Tooltip>
                                </div>   
                            </>
                            : null
                        }
                    </div>
                </Popover.Panel>
            </Popover>
        </>
    )
}

export default SliceButton