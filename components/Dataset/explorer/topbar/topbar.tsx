import React from "react";
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from "react";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddFilePopup from "../../popups/AddFilePopup";
import Image from "next/image";
import YOLOFilterPopup from "../../popups/YOLOFilterPopup";
import FileFilterPopup from "../../popups/FileFilterPopup";

function commit(comment: string){
    fetch('http://localhost:8000/commit_req?comment='.concat(comment))
    window.location.reload();
    return true
}

const TopBar = (props: {schema: string; props: { dataset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; URI: string; }; setFiltering: any}) => {

    const [filterPopup, setFilterPopup] = useState(false)
    const [addPopup, setAddPopup] = useState(false)
    const [txt, setText] = useState('')
    const [switch_, setSwitch] = useState(true)

    const handleChange = (event: React.ChangeEvent<any>) => {
        setText(event.target.value)
    }

    const handleSubmit = (event: React.ChangeEvent<any> ) => {
        event.preventDefault()
        setFilterPopup(true)
    }
    
    var SwitchLabels = [<></>]
    var FilterComponent = [<></>]

    if(props.schema == 'yolo' || props.schema == 'labelbox'){
        FilterComponent = filterPopup ? [<YOLOFilterPopup schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'yffp'}/>] : [<></>]
        SwitchLabels = [
            <div key={'csd'} className="py-2">
                <FormGroup>
                    <FormControlLabel control={
                    <Switch 
                    checked={switch_} size="small"
                    onChange={() => {
                        setSwitch(!switch_)
                        fetch('http://localhost:8000/set_bounding_boxes')
                        props.setFiltering(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
                        props.setFiltering(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                    />} label="annotations" />
                </FormGroup>
            </div>
        ]
    } else if (props.schema == 'files'){
        FilterComponent = filterPopup ? [<FileFilterPopup schema={props.schema} txt={txt} popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'fffp'}/>] : [<></>]
    }
    const PopupComponent = addPopup ? [<AddFilePopup popup={addPopup} setPopup={setAddPopup} key={'afpp'}/>] : [<></>]

    return (    
        <>
            <div className="flex w-full justify-between">
                <div className="pr-10 py-2 w-min">
                    <h1 className="px-2 py-2 w-40 h-8 overflow-scroll"> {props.props.dataset} </h1>
                    <h2 className="px-2 py-2 w-40 h-8 underline overflow-scroll hover:cursor-pointer"> 
                        {props.props.URI}
                    </h2>
                </div>
                <div className="flex">
                    <div className="flex gap-2 mt-6 w-full">

                        {SwitchLabels}

                        <button onClick={()=>commit('')} className="h-min text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> Refresh
                        </button>

                        <button onClick={()=>setAddPopup(!addPopup)} className="h-min text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" > Upload
                        </button>

                        <button onClick={()=>setFilterPopup(!filterPopup)} className="w-[60px] h-[40px] flex flex-col justify-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" > 
                            {<Image src={'/Icons/filter-search.png'} alt='' width={'40px'} height={'40px'} objectFit={'contain'} />}
                        </button>
                        
                    </div>
                    <div className="w-full py-6 text-black inline-block align-middle">
                        <form className="px-5" onSubmit={handleSubmit}>
                            <label className="flex justify-end gap-2"> 
                                <div className="dark:text-white">
                                    <input onChange={handleChange} placeholder="Filename search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <input className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit"/>
                                </div>
                            </label> 
                        </form> 
                        
                    </div>
                </div>
            </div>
            {PopupComponent}
            {FilterComponent}
        </>
    )
}

export default TopBar;