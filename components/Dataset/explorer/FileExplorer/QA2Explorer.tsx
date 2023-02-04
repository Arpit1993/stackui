import QA2Preview from "./Items/QA2Preview";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import SliceButton from "./Items/SliceButton";
import SelectionTagPopup from "./Popups/SelectionTagPopup";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import BugReportIcon from '@mui/icons-material/BugReport';
import RefreshIcon from '@mui/icons-material/Refresh';
import { posthog } from "posthog-js";
import QA2Popup from "../../Visualizers/QA2Popup";
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import ExportModal from "../../Modals/ExportModal";

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

const QA2Explorer = (props) => {
    const [addDP, setAddDP] = useState<Boolean>(false)
    const [keyVar, setKey] = useState<String>('');
    const [popup, setPopup] = useState<Boolean>(false)
    const [anomalies, setAnomalies] = useState<Boolean>(false)
    const [selected, setSelected] = useState<Array<Boolean>>([])
    const [pointer, setPointer] = useState<number>(-1)
    const [tagsPopup, setTagsPopup] = useState<Boolean>(false)
    const [export_, setExport] = useState<Boolean>(false)

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
            <div className="h-[450px]">
                <div className="z-10 flex text-xs w-full justify-between px-5">
                    <div className="w-min">
                        <SliceButton dataset={props.dataset} setFiltering={props.setFiltering}/>
                    </div>
                    <div className={!anomalies ? "invisible h-full w-full py-3" :"h-full w-full flex gap-2 justify-center text-sm py-3 items-center"}> 
                        <ErrorOutlineIcon className="w-1/10 h-1/10 shadow-sm fill-white rounded-full overflow-hidden bg-red-500 hover:bg-red-700"/>
                        {'3 anomalies detected'}
                    </div>
                    <button onClick={()=>commit('')} className=" flex h-fit items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        <RefreshIcon className="h-5 w-5 mr-2"/>
                        Refresh
                    </button>
                    
                    {/* <button onClick={()=>{posthog.capture('ask stack to label button', { property: 'value' })}} 
                        className="flex w-1/2 h-fit items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        <ClassIcon className="h-5 w-5 mr-2"/>
                        Outsource Labeling
                    </button> */}

                    <button onClick={()=>{posthog.capture('bug report button', { property: 'value' }); diagnose()}} 
                        className="flex h-fit items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        <BugReportIcon className="h-5 w-5 mr-2"/>
                        Diagnose
                    </button>

                    <button onClick={()=>{setExport(true); posthog.capture('train button', { property: 'value' }); }} //TODO 
                        className="flex h-fit items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        <ModelTrainingIcon className="h-5 w-5 mr-2"/>
                        Train
                    </button>
                    
                </div>
                <div className="z-0 h-full w-full flex justify-center p-1">
                    
                    <div className="relative w-full shadow-md sm:rounded-lg">
                        <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <div className="w-full grid grid-cols-12 text-xs font-medium text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <div className="col-span-2 w-full px-6 py-3">
                                    Title
                                </div>
                                <div className="col-span-4 w-full px-6 py-3">
                                    Paragraph
                                </div>
                                <div className="col-span-3 w-full px-6 py-3">
                                    Question
                                </div>
                                <div className="col-span-3 w-full px-6 py-3">
                                    Answer
                                </div>
                            </div>
                            <div className="w-full">
                                {
                                    files.map((file,index) =>
                                        <QA2Preview shortcuts={props.shortcuts} key={`thumb-${file['name']}`} setTagsPopup={setTagsPopup} selected={selected} setPointer={setPointer} setSelected={setSelected} dataset={props.dataset} max_view={props.max_view} file={file} index={index} waiting={props.waiting} handleObjectClick={handleObjectClick}/>
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
                    <button onClick={() => {setAddDP(true)}} className="mt-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                            {'Add Datapoint'}
                    </button>
                </div>
                {
                    addDP ? <AddDatapointModal setPopup={setAddDP} /> : null
                }
                {
                    popup ? <QA2Popup shortcuts={props.shortcuts} setFiltering={props.setFiltering} setPage={props.setPage} schema={props.schema} popup={popup} setPopup={setPopup} setKeyId={setKey} keyId={keyVar} key={'fcp'}/> : <></>
                }
                {
                    export_ ? <ExportModal setPopup={setExport}/> : <></>
                }
            </div>
        </>
    )
};

export default QA2Explorer;

const AddDatapointModal = (props) => {
    const [loading, setLoading] = useState(false)
    const [key, setKey] = useState('')

    const handleSubmit = () => {
        if (key.length > 0){
            setLoading(true)
            fetch(`http://localhost:8000/add_datapoint?key=${key}`).then(
                () => {
                    setLoading(false)
                    window.location.reload()
                }
            )
        }
    }

    return (
        <>
            {
                <button key={'ccb'} onClick={() => {
                    props.setPopup(false)
                    }} className=" bg-black/50 z-[48] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
                    click to close
                </button>
            }
            <div key={"brnchpp"} ref={props.ref_} className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative bg-white w-[700px] rounded-lg shadow dark:bg-gray-900">
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Add new datapoint
                            </h3>
                            <button onClick={() => {props.setPopup(false)}} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div className="mb-6 mt-6 w-full flex justify-center">
                            <div className="w-[60%]">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                <input onChange={(e) => {setKey(e.target.value)}} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Key title (e.g. New Book)" value={key} required/>
                            </div>
                        </div>
                        
                        <div className="flex justify-center items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button onClick={() => {handleSubmit()}}  className="text-white flex gap-2 items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Submit 
                                {
                                    (loading) ?
                                    <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    :
                                    null
                                }
                            </button>

                            <button onClick={() => {props.setPopup(false)}}  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
        </>
    )
}