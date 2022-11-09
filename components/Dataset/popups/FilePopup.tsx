import React from "react";
import posthog from 'posthog-js'
import { useState, useEffect } from "react";
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

const FilePopup = (props) => {
    
    const [popup, setPopup] = useState(0)

    const [row, setRow] = useState(0)
    const [col, setCol] = useState(0)

    const [compare, setCompare] = useState(0)
    const [loading, setLoading] = useState(0)
    const [loadingViz, setLoadingViz] = useState(0)
    const [version, setVersions] = useState([{version: 'loading...', date: 'loading...',commit: 'loading...'}])
    const [Nversion, setNVersions] = useState(0)
    const [dataComp, setDataComp] = useState(null)

    const [submit, setSubmit] = useState(0)
    const [newLabels, setnewLabels] = useState({keyid: props.keyId})
    
    const isYOLO = ['jpg','png','jpeg','tiff','bmp','eps'].includes(props.keyId.split('.').pop()) && (props.schema == 'yolo' || props.schema == 'labelbox')
    const isImage = ['jpg','png','jpeg','tiff','bmp','eps'].includes(props.keyId.split('.').pop())
    const isCSV =['csv'].includes(props.keyId.split('.').pop())
    const isText = ['txt'].includes(props.keyId.split('.').pop())
    const isJSON = ['json'].includes(props.keyId.split('.').pop())

    const handleDelete = async () => {
        setLoading(1)
        await fetch('http://localhost:8000/remove_key?key='.concat(props.keyId))
        window.location.reload(true);
        return true
    }

    const handleFullDelete = async () => {
        setLoading(1)
        await fetch('http://localhost:8000/full_remove_key?key='.concat(props.keyId))
        window.location.reload(true);
        return true
    }

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
                    [<YOLOViz key={'imgvz'} label_version={'current'} img={img} keyId={props.keyId} ww={800} wh={500} ox={0} oy={0} setnewLabels={setnewLabels} setSubmit={setSubmit}/>])
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
    }, [props, setDataComp, row, col, setRow, setCol, submit])

    const CloseComponent = [
        <button key={'ccb'} onClick={() => props.setPopup(0)} className="bg-transparent backdrop-blur-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
        click to close
        </button>
    ]
    
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
            <YOLODiffPopup schema={props.schema} keyId={props.keyId} setPopup={setCompare} popup={compare} len={Nversion}/>
        </>
        : 
        <>
            <FileDiffPopup schema={props.schema} keyId={props.keyId} setPopup={setCompare} popup={compare} len={Nversion}/>
        </>
    ] : [<></>]


    const versions_list = isYOLO ? [<YOLOHistoryList key={'YOLOHiL'} keyId={props.keyId}/>] : [
        <FileHistoryList key={'FileHiL'} keyId={props.keyId}/>
    ]

    const LoadingPopup = loading ? [<LoadingScreen  key={'lscpp'}/>] : [null]
    const fileDisp = props.popup ? (loadingViz ? [null] : dataComp) : [null]

    const submitLabels = async () => {
        const data = JSON.stringify(newLabels)
        await fetch('http://localhost:8000/set_labels/', {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json" 
            }, 
            body: data}
        )
        setSubmit(0)
        await fetch('http://localhost:8000/commit_req?comment='.concat(`fixed annotation on ${newLabels['keyId']}`))
        setSubmit(0)
        posthog.capture('Submitted a commit', { property: 'value' })
    }

    const commit_button = submit ? 
    [<button key={'cmit_button_1'} onClick={() => submitLabels()} className="z-10 h-max focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
        Commit changes  
    </button>] 
    : 
    [<button key={'cmit_button_2'} className="z-10 h-max text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:border-gray-700 hover:cursor-not-allowed" disabled={true}>
        Commit changes
    </button>]

    if (props.popup == 0) {
        return <div></div>
    } else {
    return (
        <>  
            {CloseComponent}
            <div className="text-sm dark:bg-slate-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white w-[1100px]  h-[700px]">
                <div className="w-full justify-between flex h-[30px]">
                    <div className="py-1 px-2">
                        <button onClick={() => props.setPopup(0)} className='text-xs px-1 w-[15px] h-[15px] flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                    </div>
                     
                    <div className="place-self-center py-2 font-bold">
                        File: {props.keyId}
                    </div>
                    <div></div>
                </div>
                <ul className="text-xs font-medium rounded-lg 
                        text-gray-900 bg-white
                        dark:bg-gray-900 dark:text-white">
                    <div className="flex h-[500px] ">
                        <div className="w-[800px] rounded-md dark:text-black text-center border-2 flex flex-col justify-center border-black bg-white dark:bg-black">
                            {fileDisp}
                        </div>
                        <div className="w-[300px]">
                            <div className="flex justify-center">
                                <DropdownFileOptions setHistory={setPopup} handleDelete={handleDelete} handleFullDelete={handleFullDelete}/>
                            </div>
                            {versions_list}
                        </div>
                    </div>
                    <div className="flex justify-center mt-10 w-[800px]">
                        <button onClick={() => setPopup(1)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 h-[70px] w-[300px]"> 
                            See History 
                        </button>
                        <button onClick={() => setCompare(1)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 h-[70px] w-[300px]"> 
                            Compare versions
                        </button>
                    </div>
                    <div className="absolute w-full bottom-16 flex justify-end px-10 h-max"> 
                        {commit_button}
                    </div>
                </ul>
            </div>
            {Versionspopup}
            {Diffpopup}
            {LoadingPopup}
        </>)}
}

export default FilePopup;