import React, { useRef } from "react";
import { useState, useEffect } from "react";
import DropdownVersion from "./Components/DropdownVersion";
import ImageViz from "../Visualizers/ImageViz";
import CsvDiffViz from "../Visualizers/CsvDiffViz";

const fetchData = async (keyId, version, setD, version2, setD2) => {

    const isImage = ['jpg','png','jpeg','tiff','bmp','eps'].includes(keyId.split('.').pop())
    const isCSV =['csv'].includes(keyId.split('.').pop())
    const isText = ['txt'].includes(keyId.split('.').pop())
    const isJSON = ['json'].includes(keyId.split('.').pop())

    const cmd = 'http://localhost:8000/pull_file_api?file='.concat(keyId).concat('&version=').concat(version)

    if (isImage){
        fetch(cmd).then((res) => res.body.getReader()).then((reader) =>
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
        [<ImageViz key={'imdpp'} img={img} ww={500} wh={500} keyId={keyId} ox={0} oy={0} setSubmit={()=>{}} setnewLabels={()=>{}}/>]).then(setD) 
    } 
    else if (isCSV) {
        fetch(`http://localhost:8000/get_csv_diff_metadata?key=${keyId}&v1=${version}&v2=${version2}`)
        .then((res) => res.text())
        .then((text) => [
            <CsvDiffViz key={'csv_diff_viz_data'} data={text}/>
        ]).then(setD).then(setD2([]))
    } 
    else if (isText) {
        fetch(cmd).
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
        })).then((stream) => new Response(stream)).then((response) => response.blob()).then((blob) => blob.text())
        .then((text) => [
            <div key="cmp3" className="flex justify-center font-thin overflow-scroll">
                {text}
            </div>]).then(setD)
    }
    else if (isJSON) {
        fetch(cmd).
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
        })).then((stream) => new Response(stream)).then((response) => response.blob()).then((blob) => blob.text())
        .then((text) => [
            <div key="cmp5" className="flex font-thin w-[490px] overflow-scroll">
                <pre className="w-[1px] break-all"> <div className="w-[1px]">{text}</div></pre>
            </div>]).then(setD)
    }
}

const FileDiffPopup = (props) => {

    const [v1, setV1] = useState(props.len)
    const [v2, setV2] = useState(Math.max(props.len-1,1))
    const [d1, setD1] = useState(null)
    const [d2, setD2] = useState(null)

    useEffect( () => {

        const fetchStuff = async (keyId, setD1, setD2, v1, v2) => {
            await fetchData(keyId,v1,setD1, v2, setD2)
            await fetchData(keyId,v2,setD2, v2, setD2)
        }
        if(props.popup == 1){ 
            fetchStuff(props.keyId, setD1, setD2, v1, v2)
        }
    },[props.keyId, props.popup, v1, v2])

    if (props.popup == 0) {
        return <div></div>
    } else {
    return (
    
    <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-400 w-[1100px]  h-[700px]">
        <div className="w-full justify-between h-[30px] flex">
            <button onClick={() => props.setPopup(0)} className= 'place-self-center justify-self-start w-[50px] h-[30px] flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
            <div className="place-self-center py-2 font-bold">
                File: {props.keyId}
            </div>
            <div></div>
        </div>
        <div className="flex justify-center gap-2">
            <div className="mt-2">
                <DropdownVersion keyId={props.keyId} setV={setV1} len={props.len} v={v1} />
                <div className="w-[500px] h-[500px] rounded-md dark:text-black text-center border-2 flex flex-col justify-center border-black bg-white">
                    {d1}
                </div>
            </div>
            <div className="mt-2">
                <DropdownVersion keyId={props.keyId} setV={setV2} len={props.len} v={v2} />
                <div className="w-[500px] h-[500px] rounded-md dark:text-black text-center border-2 flex flex-col justify-center border-black bg-white">
                    {d2}
                </div>
            </div>
        </div>
    </div>)
    }
}

export default FileDiffPopup;