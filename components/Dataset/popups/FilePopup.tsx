import React from "react";
import posthog from 'posthog-js'
import { useState, useEffect, useCallback } from "react";
import LoadingScreen from "../../LoadingScreen";
import FileHistoryPopUp from "./History/FileHistoryPopUp";
import YOLOHistoryPopUp from "./History/YOLOHistoryPopUp";
import ImageViz from "../Visualizers/ImageViz";
import YOLOViz from "../Visualizers/YOLOViz";
import CsvViz from "../Visualizers/CSVViz";
import FileDiffPopup from "./DiffPopups/FileDiffPopup";
import YOLODiffPopup from "./DiffPopups/YOLODiffPopup";
import DropdownFileOptions from "./Components/DropdownFileOptions";
import FileHistoryList from "./History/FileHistoryList";
import YOLOHistoryList from "./History/YOLOHistoryList";
import path from 'path'
import CloseIcon from '@mui/icons-material/Close';

const FilePopup = (props) => {
    
    const [popup, setPopup] = useState<Boolean>(false)

    const [row, setRow] = useState<number>(0)
    const [col, setCol] = useState<number>(0)

    const [compare, setCompare] = useState<Boolean>(false)
    const [loading, setLoading] = useState<Boolean>(false)
    const [loadingViz, setLoadingViz] = useState<Boolean>(false)
    const [version, setVersions] = useState([{version: 'loading...', date: 'loading...',commit: 'loading...'}])
    const [Nversion, setNVersions] = useState<number>(0)
    const [dataComp, setDataComp] = useState(null)

    const [submit, setSubmit] = useState<Boolean>(false)
    const [newLabels, setnewLabels] = useState({keyid: props.keyId})
    

    const isImage = [props.keyId.includes('.jpg'),props.keyId.includes('.png'),props.keyId.includes('.jpeg'),props.keyId.includes('.tiff'),props.keyId.includes('.bmp'),props.keyId.includes('.eps')].includes(true)
    const isYOLO = isImage && (props.schema == 'yolo' || props.schema == 'labelbox')
    
    const isCSV =['csv'].includes(props.keyId.split('.').pop())
    const isText = ['txt'].includes(props.keyId.split('.').pop())
    const isJSON = ['json'].includes(props.keyId.split('.').pop())

    const handleDelete = async () => {
        setLoading(true)
        await fetch('http://localhost:8000/remove_key?key='.concat(props.keyId))
        window.location.reload();
        return true
    }

    const handleFullDelete = async () => {
        setLoading(true)
        await fetch('http://localhost:8000/full_remove_key?key='.concat(props.keyId))
        window.location.reload();
        return true
    }

    const submitLabels = async () => {
        setLoading(true)
        const data = JSON.stringify(newLabels)
        await fetch('http://localhost:8000/set_labels/', {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json" 
            }, 
            body: data}
        )
        setSubmit(false)
        await fetch('http://localhost:8000/commit_req?comment='.concat(`fixed annotation on ${newLabels['keyId']}`))
        setSubmit(false)
        posthog.capture('Submitted a commit', { property: 'value' })
        setLoading(false)
    }


    const handleKeyPress = useCallback((event) => {
        if(!event.shiftKey){
            if (event.key == 'ArrowLeft') {
                fetch('http://localhost:8000/get_prev_key?key='.concat(props.keyId))
                .then((res) => res.json()).then(
                    (res) => props.setKeyId(res.key)
                )
            } else if (event.key == 'ArrowRight') {
                fetch('http://localhost:8000/get_next_key?key='.concat(props.keyId))
                .then((res) => res.json()).then(
                    (res) => props.setKeyId(res.key)
                )
            }
        }

        if(event.ctrlKey){
            if(submit && event.key == 's'){
                submitLabels()
            }
        }
    }, [props])

    useEffect(() => {
        const fetchData = async () => {
            setDataComp(null)
            if (props.popup) {
                if (isYOLO) {
                    fetch('http://localhost:8000/pull_file_api?file='.concat(props.keyId)).
                    then((res) => res.body.getReader()).then((reader) =>
                    new ReadableStream({
                        start(controller) {
                            return pump();
                            function pump() {
                                return reader.read().then(({ done, value }) => {
                                    if (done) {
                                        controller.close();
                                        return;
                                    }
                                    controller.enqueue(value);
                                    return pump();
                                });
                            }
                        }
                    })).then((stream) => new Response(stream)).then((response) => response.blob())
                    .then((blob) => URL.createObjectURL(blob)).then((img) => 
                    [<YOLOViz key={'imgvz'}  diff={false} label_version={'current'} img={img} keyId={props.keyId} ww={800} wh={500} ox={0} oy={0} setnewLabels={setnewLabels} setSubmit={setSubmit}/>])
                    .then(setDataComp)
                }
                else if (isImage) {
                    fetch('http://localhost:8000/pull_file_api?file='.concat(props.keyId)).
                    then((res) => res.body.getReader()).then((reader) =>
                    new ReadableStream({
                        start(controller) {
                            return pump();
                            function pump() {
                                return reader.read().then(({ done, value }) => {
                                    if (done) {
                                    controller.close();
                                    return;
                                    }
                                    
                                    controller.enqueue(value);
                                    return pump();
                                });
                            }
                        }
                    })).then((stream) => new Response(stream)).then((response) => response.blob())
                    .then((blob) => URL.createObjectURL(blob)).then((img) => 
                    [<ImageViz key={'imgvz'} img={img} keyId={props.keyId} ww={800} wh={500} ox={0} oy={0} setnewLabels={setnewLabels} setSubmit={setSubmit}/>])
                    .then(setDataComp)
                } 
                else if (isCSV) {
                    const csv_metadata = await fetch('http://localhost:8000/pull_csv_metadata_api?file='.concat(props.keyId)).then((res) => res.json())
                    setDataComp('')
                    fetch('http://localhost:8000/pull_csv_api?file='.concat(props.keyId).concat('&row_p=').concat(row).concat('&col_p=').concat(col)).
                    then((res) => res.body.getReader()).then((reader) =>
                    new ReadableStream({
                        start(controller) {
                            return pump();
                            function pump() {
                                return reader.read().then(({ done, value }) => {
                                    if (done) {
                                    controller.close();
                                    return;
                                    }
                                    
                                    controller.enqueue(value);
                                    return pump();
                                });
                            }
                        }
                    })).then((stream) => new Response(stream)).then((response) => response.blob())
                    .then((blob) => blob.text()).then((data) =>
                    [
                        <CsvViz key={'csvvizzz'} data={data} setRow={setRow} setCol={setCol} row={row} col={col} csv_metadata={csv_metadata} />
                    ]).then(setDataComp)
                } 
                else if (isText) {
                    fetch('http://localhost:8000/pull_file_api?file='.concat(props.keyId)).
                    then((res) => res.body.getReader()).then((reader) =>
                    new ReadableStream({
                        start(controller) {
                            return pump();
                            function pump() {
                                return reader.read().then(({ done, value }) => {
                                    if (done) {
                                    controller.close();
                                    return;
                                    }
                                    
                                    controller.enqueue(value);
                                    return pump();
                                });
                            }
                        }
                    })).then((stream) => new Response(stream)).then((response) => response.blob())
                    .then((blob) => blob.text()).then( (data) =>  [
                        <div key="cmp3" className="flex justify-center font-thin dark:text-white overflow-scroll">
                            {data}
                        </div>]).then(setDataComp)
                }
                else if (isJSON) {
                    fetch('http://localhost:8000/pull_file_api?file='.concat(props.keyId)).
                    then((res) => res.body.getReader()).then((reader) =>
                    new ReadableStream({
                        start(controller) {
                            return pump();
                            function pump() {
                                return reader.read().then(({ done, value }) => {
                                    if (done) {
                                    controller.close();
                                    return;
                                    }
                                    
                                    controller.enqueue(value);
                                    return pump();
                                });
                            }
                        }
                    })).then((stream) => new Response(stream)).then((response) => response.blob())
                    .then((blob) => blob.text()).then( (data) =>  [
                        <div key="cmp3" className="flex font-thin w-full overflow-scroll">
                            <pre className="w-[1px] break-all dark:text-white"> 
                                <div className="w-[1px]">
                                    {data}
                                </div>
                            </pre>
                        </div>]).then(setDataComp)
                }
            }
        }

        const fetchVersions = () => {
            if (props.popup) {
                fetch('http://localhost:8000/key_versions?key='.concat(props.keyId).concat('&l=4&page=0'))
                .then((data) => data.json()).then((res) => {
                    setVersions(Object.values(res.commits))
                    setNVersions(res.len)
                })
            }
        }

        const fetchStuff = async () => {
            await fetchData()
            fetchVersions()
        }
        if (props.popup) {
            fetchStuff()
        }

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        }

    }, [props, row, col, isYOLO, isImage, isCSV, isText, isJSON, handleKeyPress])
    
    const Versionspopup = popup ? [
        isYOLO ? 
        <>
            <YOLOHistoryPopUp schema={props.schema} keyId={props.keyId} setPopup={setPopup} popup={popup}/>
        </> 
        :
        <>
            <FileHistoryPopUp schema={props.schema} keyId={props.keyId} setPopup={setPopup} popup={popup}/>
        </>
    ] : [<></>]

    const Diffpopup =  compare ? [
        isYOLO ? 
        <>
            <YOLODiffPopup schema={props.schema} keyId={props.keyId} setPopup={setCompare} popup={compare} dates={version.map((cm)=>cm.date)} len={Nversion}/>
        </>
        : 
        <>
            <FileDiffPopup schema={props.schema} keyId={props.keyId} setPopup={setCompare} popup={compare} dates={version} len={Nversion}/>
        </>
    ] : [<></>]

    return (
        <>  
            {
                <button key={'ccb'} onClick={() => {
                    props.shortcuts.current = true
                    props.setPopup(false)
                    }} className="z-[39] bg-black/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
                    click to close
                </button>
            }
            <div className="text-sm z-40 dark:bg-gray-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white w-[1100px]  h-[600px]">
                <div className="w-full justify-between flex h-8">
                    <div className="py-1 px-2">
                        <button onClick={() => {
                            props.shortcuts.current = true
                            props.setPopup(false)
                            }} className='text-xs items-center flex justify-center text-gray-800 w-4 h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'>
                            <CloseIcon className="invisible hover:visible w-3 h-3"/>
                        </button>
                    </div>
                     
                    <div className="place-self-center py-2 font-bold">
                        File: {path.basename(props.keyId)}
                    </div>
                    <div></div>
                </div>
                <ul className="text-xs font-body rounded-lg 
                        text-gray-900 bg-white
                        dark:bg-gray-900 dark:text-white px-1">
                    <div className="flex h-[500px] ">
                        <div className="w-[800px] relative rounded-md dark:text-black text-center flex flex-col justify-center bg-white dark:bg-black">
                            {
                                props.popup ? (loadingViz ? null : dataComp) : null
                            }
                        </div>
                        <div className="w-[300px]">
                            <div className="flex justify-center">
                                <DropdownFileOptions setHistory={setPopup} handleDelete={handleDelete} handleFullDelete={handleFullDelete}/>
                            </div>
                            {
                                isYOLO ? <YOLOHistoryList key={'YOLOHist'} keyId={props.keyId}/> : <FileHistoryList key={'FileHist'} keyId={props.keyId}/>  
                            }
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="flex justify-center mt-4 w-[800px]">
                            <button onClick={() => setPopup(true)} className="h-min text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> 
                                See History 
                            </button>
                            <button onClick={() => setCompare(true)} className="h-min text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> 
                                Compare versions
                            </button>
                            {/* <button onClick={()=>{}} className={"h-min focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"}>
                                Auto annotate
                            </button> */}
                        </div>
                        <div className="w-[300px] flex justify-center mt-4"> 
                            {
                                submit ? 
                                <button key={'cmit_button_1'} onClick={() => submitLabels()} className="z-10 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Commit changes  
                                </button>
                                : 
                                <button key={'cmit_button_2'} className="z-10 text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:border-gray-700 hover:cursor-not-allowed" disabled={true}>
                                    Commit changes
                                </button>
                            }
                        </div>
                    </div>
                </ul>
            </div>
            {Versionspopup}
            {Diffpopup}
            {
                loading ? <LoadingScreen  key={'lscpp'}/> : null
            }
        </>)
}

export default FilePopup;