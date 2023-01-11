import FilePopup from "../../popups/FilePopup";
import ViewOptions from "./Items/ViewOptions";
import { useCallback, useEffect, useState } from "react";
import NERPreview from "./Items/NERPreview";
import React from "react";
import SliceButton from "./Items/SliceButton";
import SelectionTagPopup from "./Popups/SelectionTagPopup";
import { Tooltip } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NERExplorer = (props) => {
    const [keyVar, setKey] = useState<String>('');
    const [popup, setPopup] = useState<Boolean>(false)
    const [anomalies, setAnomalies] = useState<Boolean>(false)
    const [switch_, setSwitch] = useState<Boolean>(true)
    const [thumbnailView, setThumbnailView] = useState<Boolean>(true)
    const [selected, setSelected] = useState<Array<Boolean>>([])
    const [pointer, setPointer] = useState<number>(-1)
    const [tagsPopup, setTagsPopup] = useState<Boolean>(false)

    const files = props.files;

    var idx_min: number = 0;
    var idx_max: number = 0;

    const view_label = 'List view';
    
    const handleObjectClick = (key_in: String) => {
        props.shortcuts.current = false
        setPopup(true)
        setKey(key_in)
    }

    const max_files: number = 10;
    const max_pages =  props.len / max_files;

    const handleKeyPress = useCallback((event) => {
        if (props.shortcuts.current == true){
            if (event.shiftKey){
                if (event.key == '_'){
                    event.preventDefault();
                    props.setMaxView(Math.floor(Math.min(Math.pow((Math.sqrt(props.max_view)+1),2),36)));
                    props.setPage(0);
                } else if (event.key == '+'){
                    event.preventDefault();
                    props.setMaxView(Math.floor(Math.max(Math.pow((Math.sqrt(props.max_view)-1),2),1)));
                    props.setPage(0);
                }

                if (event.key == 'ArrowLeft') {
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
                } else if (event.key == 'ArrowRight'){
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
                } else if (event.key == 'ArrowDown'){
                    event.preventDefault();
                    var surr = selected
                    const sol = selected.findIndex(element => element)
                    if(sol == -1){
                        for(var i = 0; i < 6; i++){
                            surr.splice(i,1,true)
                        }
                        setSelected(surr)
                        setPointer(5)
                    } else {
                        if (pointer < props.files.length-1){
                            for(var i = 0; i < 6; i++){
                                surr.splice(Math.min(pointer+1+i,props.files.length-1),1,!surr[Math.min(pointer+1+i,props.files.length-1)])
                            }
                            setSelected(surr)   
                        }
                        setPointer(Math.min(pointer+7,props.files.length))
                    }
                } else if (event.key == 'ArrowUp'){
                    event.preventDefault();
                    var surr = selected;
                    const sol = selected.findIndex(element => element)
                    if(sol == -1){
                        for(var i = 0; i < 6; i++){
                            if (props.files.length-1-i >= 0){
                                surr.splice(props.files.length-1-i,1,true)
                            }
                        }
                        setSelected(surr)
                        setPointer(Math.max(props.files.length-7,-1))
                    } else {
                        if(pointer >= 6){
                            for(var i = 0; i < 6; i++){
                                if (pointer-1-i >= 0){
                                    surr.splice(pointer-1-i,1,!surr[Math.max(pointer-1-i,0)])
                                }
                            }
                            setSelected(surr)
                        }
                        setPointer(Math.max(pointer-7,-1))
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
                    setSelected(Array(props.files.length).fill(selected.includes(false)))
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
        <div key={`btn4${0}start`} className="flex">
            <button key={`subbtn4${0}start`} className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(Math.max(props.page-1,0))}>
                {'Previous'}
            </button>
        </div>
    )

    for (var i = props.page - 5; i < props.page + 5; i++){
        if(i > 0 && i < max_pages+1-0.0001){
            const x = i
            listofButtons.push(
                <button key={`btn4${x}`} className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(x-1)}>
                    {x | 0}
                </button>
            )
        }
    }

    listofButtons.push(
        <div key={`btn4${0}end`} className="flex">
            <button key={`subbtn4${0}end`} className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(Math.min(max_pages-0.001|0,props.page+1|0))}>
                {'Next'}
            </button>
        </div>
    )

    idx_min = 0;
    idx_max = max_files;

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
                        {'# anomalies detected'}
                    </div>
                    <Tooltip title={'Explorer options'} placement="left">
                        <div className="w-min">
                            <ViewOptions setMaxView={props.setMaxView} setView={props.setView} 
                                    setPage={props.setPage} max_view={props.max_view} view_label={view_label} view={props.view} 
                                    switch_={switch_} setPointer={setPointer} setSwitch={setSwitch} setFiltering={props.setFiltering}
                                    schema={props.schema} setThumbnailView={setThumbnailView} thumbnailView={thumbnailView}/>
                        </div>
                    </Tooltip>
                </div>
                <div className="z-0 h-[480px] w-full flex justify-center p-1">
                    <div key={'fctnr1'}>
                        <div className='grid w-full gap-1'>
                            <div className="grid grid-cols-2 gap-1">
                                <div> 
                                    Sentence
                                </div>
                                <div> 
                                    Last change
                                </div>
                            </div>

                            <div className="flex py-1">
                                <div className="flex-grow border-t border-gray-400"></div>
                            </div>
                        </div>

                        <div className='grid grid-rows-20 gap-1'>
                            {
                                files.filter((item, index) =>  index < idx_max && index >= idx_min ).map((file,index) =>
                                    <NERPreview shortcuts={props.shortcuts} key={`thumb-${file['name']}`} setTagsPopup={setTagsPopup} selected={selected} setPointer={setPointer} setSelected={setSelected} dataset={props.dataset} thumbnailView={thumbnailView} max_view={props.max_view} file={file} index={index} waiting={props.waiting} handleObjectClick={handleObjectClick}/>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="z-10 flex justify-between">
                    <div className="flex justify-left text-xs mt-2 mb-2 rounded-sm">
                        {listofButtons}
                    </div>
                    <div className="z-10 w-1/6 flex flex-col justify-center h-max text-sm py-2"> 
                        Page {props.page+1 | 0} of {max_pages-0.001+1 | 0}
                    </div>
                </div>
                {
                    popup ? <FilePopup shortcuts={props.shortcuts} schema={props.schema} popup={popup} setPopup={setPopup} setKeyId={setKey} keyId={keyVar} key={'fcp'}/> : <></>
                }
            </div>
        </>
    )
};

export default NERExplorer;