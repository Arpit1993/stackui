import NERPopup from "../../popups/NERPopup";
import { useCallback, useEffect, useState } from "react";
import NERPreview from "./Items/NERPreview";
import React from "react";
import SliceButton from "./Items/SliceButton";
import SelectionTagPopup from "./Popups/SelectionTagPopup";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import BugReportIcon from '@mui/icons-material/BugReport';
import RefreshIcon from '@mui/icons-material/Refresh';
import { posthog } from "posthog-js";

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

const NERExplorer = (props) => {
    const [keyVar, setKey] = useState<String>('');
    const [popup, setPopup] = useState<Boolean>(false)
    const [anomalies, setAnomalies] = useState<Boolean>(false)
    const [thumbnailView, setThumbnailView] = useState<Boolean>(true)
    const [selected, setSelected] = useState<Array<Boolean>>([])
    const [pointer, setPointer] = useState<number>(-1)
    const [tagsPopup, setTagsPopup] = useState<Boolean>(false)

    const files = props.files;
    console.log(files)
    
    const handleObjectClick = (key_in: String) => {
        props.shortcuts.current = false
        setPopup(true)
        setKey(key_in)
    }

    const max_files: number = 7;
    const max_pages =  props.len / max_files;

    const handleKeyPress = useCallback((event) => {
        if (props.shortcuts.current == true){
            if (event.shiftKey){
                if (event.key == 'ArrowUp') {
                    event.preventDefault();
                    var surr = selected
                    const sol = selected.findIndex(element => element)
                    if(sol == -1){
                        surr.splice(props.files.length-1,1,true)
                        setSelected(surr)
                        setPointer(props.files.length-1)
                    } else {
                        if(pointer >= 1){
                            surr.splice(Math.max(pointer-1,0),1,!surr[Math.max(pointer-1,0)])
                            setSelected(surr)
                        }
                        setPointer(Math.max(pointer-1,-1))
                    }
                } else if (event.key == 'ArrowDown'){
                    event.preventDefault();
                    var surr = selected
                    const sol = selected.findIndex(element => element)
                    if(sol == -1){
                        surr.splice(0,1,true)
                        setSelected(surr)
                        setPointer(0)
                    } else {
                        if (pointer < props.files.length-1){
                            surr.splice(Math.min(pointer+1,props.files.length-1),1,!surr[Math.min(pointer+1,props.files.length-1)])
                            setSelected(surr)   
                        }
                        setPointer(Math.min(pointer+1,props.files.length))
                    }
                }
            } else {
                if (event.key == 'ArrowLeft' && !props.waiting) {
                    event.preventDefault();
                    props.setPage(Math.max(props.page-1,0))
                } else if (event.key == 'ArrowRight' && !props.waiting){
                    event.preventDefault();
                    props.setPage(Math.min(max_pages-0.001|0,props.page+1|0))
                }
            }

            if (event.ctrlKey){
                if (event.key == 'a'){
                    event.preventDefault();
                    setSelected(() => {return Array(props.files.length).fill(selected.includes(false))})
                    setPointer(selected.includes(false) ? props.files.length : -1)
                }

                if (event.key == 't' && selected.includes(true)){
                    event.preventDefault();
                    props.shortcuts.current = false;
                    setTagsPopup(true);
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, selected, pointer, max_pages, props.shortcuts.current])

    useEffect(() => {
        const checkSelected = async () => {
            if(selected.length < await props.files.length){
                setSelected(Array(await props.files.length).fill(false))
            }   
        }
        checkSelected()
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.files, props.page, props.view, props.max_view, props.shortcuts.current, pointer, selected, handleKeyPress])
    
    var listofButtons: Array<any> = [];

    listofButtons.push(
        <div key={`btn4${0}head`} className="flex">
            <button key={`subbtn4${0}head`} className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(0)}>
                {'First'}
            </button>
        </div>
    )

    listofButtons.push(
        <div key={`btn4${0}start`} className="flex">
            <button key={`subbtn4${0}start`} className="py-2 px-3 flex items-center leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(Math.max(props.page-1,0))}>
                <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
                {'Previous'}
            </button>
        </div>
    )

    for (var i = props.page - 2; i < props.page + 5 + Math.max(0, 3 - props.page); i++){
        if(i > 0 && i < max_pages+1-0.0001){
            const x = i
            if ( (x | 0)  == props.page + 1){
                listofButtons.push(
                    <button key={`btn4${x}`} className="px-3 py-2 w-12 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white" onClick={() => props.setPage(x-1)}>
                        {x | 0}
                    </button>
                )
            } else {
                listofButtons.push(
                    <button key={`btn4${x}`} className="py-2 px-3 w-12 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(x-1)}>
                        {x | 0}
                    </button>
                )
            }
            
        }
    }

    listofButtons.push(
        <div key={`btn4${0}end`} className="flex">
            <button key={`subbtn4${0}end`} className="flex items-center py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(Math.min(max_pages-0.001|0,props.page+1|0))}>
                {'Next'}
                <svg aria-hidden="true" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </div>
    )

    listofButtons.push(
        <div key={`btn4${0}last`} className="flex">
            <button key={`subbtn4${0}end`} className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(Math.floor(max_pages - 0.001))}>
                {'Last'}
            </button>
        </div>
    )

    return (
        <>
            {
                tagsPopup  ? 
                <SelectionTagPopup shortcuts={props.shortcuts} setMaxView={props.setMaxView} max_view={props.max_view} files={files} selected={selected} setSelected={setSelected} setPopup={setTagsPopup}/>
                : 
                <></>
            }
            <div className="h-full">
                <div className="z-10 flex text-xs w-full justify-between px-5">
                    <div className="w-min">
                        <SliceButton dataset={props.dataset} setFiltering={props.setFiltering}/>
                    </div>
                    <div className={!anomalies ? "invisible h-full w-full py-3" :"h-full w-full flex gap-2 justify-center text-sm py-3 items-center"}> 
                        <ErrorOutlineIcon className="w-1/10 h-1/10 shadow-sm fill-white rounded-full overflow-hidden bg-red-500 hover:bg-red-700"/>
                        {'3 anomalies detected'}
                    </div>
                    <button onClick={()=>commit('')} className=" flex h-fit items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        <RefreshIcon className="h-5 w-5 mr-2"/>
                        Refresh
                    </button>
                    
                    <button onClick={()=>{posthog.capture('bug report button', { property: 'value' }); diagnose()}} 
                        className="text-white flex h-fit items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        <BugReportIcon className="h-5 w-5 mr-2"/>
                        Diagnose
                    </button>
                    
                </div>
                <div className="z-0 h-fit w-full flex justify-center p-1">
                    
                    <div className="relative w-full shadow-md sm:rounded-lg">
                        <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <div className="w-full grid grid-cols-3 text-xs font-medium text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <div className="w-full px-6 py-3">
                                    Text
                                </div>
                                <div className="w-full px-6 py-3">
                                    Tokens
                                </div>
                                <div className="w-full px-6 py-3">
                                    Entities
                                </div>
                            </div>
                            <div className="w-full">
                                {
                                    files.map((file,index) =>
                                        <NERPreview shortcuts={props.shortcuts} key={`thumb-${file['name']}`} setTagsPopup={setTagsPopup} selected={selected} setPointer={setPointer} setSelected={setSelected} dataset={props.dataset} thumbnailView={thumbnailView} max_view={props.max_view} file={file} index={index} waiting={props.waiting} handleObjectClick={handleObjectClick}/>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="z-10 flex justify-between items-center">
                    <div className="flex justify-left text-xs mt-2 mb-2 rounded-sm">
                        {listofButtons}
                    </div>
                    <div className="z-10 w-1/6 flex flex-col justify-center h-max text-sm py-2"> 
                        Page {props.page+1 | 0} of {max_pages-0.001+1 | 0}
                    </div>
                </div>
                {
                    popup ? <NERPopup shortcuts={props.shortcuts} schema={props.schema} popup={popup} setPopup={setPopup} setKeyId={setKey} keyId={keyVar} key={'fcp'}/> : <></>
                }
            </div>
        </>
    )
};

export default NERExplorer;