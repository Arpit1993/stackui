import React, { useRef } from "react";
import { useState, useEffect } from "react";
import DropdownVersion from "../Components/DropdownVersion";
import ImageViz from "../../Visualizers/ImageViz";
import CsvDiffViz from "../../Visualizers/CSVDiffViz";
import Image from "next/image";

const fetchData = async (keyId, version, setD, version2, format) => {

    const isImage = [keyId.includes('.jpg'),keyId.includes('.png'),keyId.includes('.jpeg'),keyId.includes('.tiff'),keyId.includes('.bmp'),keyId.includes('.eps')].includes(true)
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
        if(version == version2){
            setD([])
        } else {
            if (format == 'table'){
                fetch(`http://localhost:8000/get_csv_diff?key=${keyId}&v1=${version}&v2=${version2}`)
                .then((res) => res.json())
                .then((text) => [
                    <CsvDiffViz key={'csv_diff_viz_data'} data={text} format={format}/>
                ]).then(setD)
            } else {
                    fetch(`http://localhost:8000/get_csv_diff_metadata?key=${keyId}&v1=${version}&v2=${version2}`)
                .then((res) => res.json())
                .then((text) => [
                    <CsvDiffViz key={'csv_diff_viz_data'} data={text} format={format}/>
                ]).then(setD)
            }
        }
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

    const [format, setFormat] = useState('metadata')
    const [v1, setV1] = useState(props.len)
    const [v2, setV2] = useState(Math.max(props.len-1,1))
    const [d1, setD1] = useState(null)
    const [d2, setD2] = useState(null)

    const isCSV =['csv'].includes(props.keyId.split('.').pop())

    useEffect( () => {

        const fetchStuff = async (keyId, setD1, setD2, v1, v2) => {
            await fetchData(keyId,v1,setD1,v2, format)
            await fetchData(keyId,v2,setD2,v2, format)
        }
        if(props.popup == 1){ 
            fetchStuff(props.keyId, setD1, setD2, v1, v2)
        }
    },[props.keyId, props.popup, v1, v2, format])

    if (props.popup == 0) {
        return <div></div>
    } else {
        if(isCSV){
            return (
                <div className="text-sm absolute z-[500] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-900 w-[1100px]  h-[700px]">
                    <div className="w-full justify-between h-8 flex">
                        <div className="py-1 px-2">
                            <button onClick={() => {props.setPopup(false); props.enableLRshortcut.current = true}} className='text-xs px-1 w-[15px] h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                        </div> 
                        <div className="place-self-center py-2 font-bold">
                            File: {props.keyId}
                        </div>
                        <div></div>
                    </div>
                    <div className="flex justify-center">
                        <div className="mt-2">
                            <div className="flex gap-2">
                                <DropdownVersion keyId={props.keyId} setV={setV1} len={props.len} v={v1} />
                                <Image className="dark:invert" src={'/Icons/arrow-alt-left.webp'} width={40} height={2} objectFit={'contain'} alt='.'/>
                                <DropdownVersion keyId={props.keyId} setV={setV2} len={props.len} v={v2} />
                                <button className="dark:text-black rounded-lg px-5 py-2 mb-2 shadow-sm border border-gray-300 hover:shadow-md bg-gray-200 hover:bg-gray-300" onClick={()=>{
                                    if(format == 'metadata'){
                                        setFormat('table')
                                    } else {
                                        setFormat('metadata')
                                    }
                                }}>
                                    {format}
                                </button>
                            </div>
                            <div className="w-[500px] h-[500px] rounded-md dark:text-black text-center border-2 flex flex-col justify-center border-black bg-white">
                                {d1}
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="text-sm z-[500] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-400 w-[1100px]  h-[700px]">
                    <div className="w-full justify-between h-8 flex">
                        <button onClick={() => props.setPopup(false)} className= 'place-self-center justify-self-start w-[50px] h-8 flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
                        <div className="place-self-center py-2 font-bold">
                            File: {props.keyId}
                        </div>
                        <div></div>
                    </div>
                    <div className="flex justify-center gap-2">
                        <div className="mt-2">
                            <DropdownVersion label={'Version'} keyId={props.keyId} setV={setV1} len={props.len} v={v1} />
                            <div className="w-[500px] h-[500px] rounded-md dark:text-black text-center border-2 flex flex-col justify-center border-black bg-white">
                                {d1}
                            </div>
                        </div>
                        <div className="mt-2">
                            <DropdownVersion label={'Version'} keyId={props.keyId} setV={setV2} len={props.len} v={v2} />
                            <div className="w-[500px] h-[500px] rounded-md dark:text-black text-center border-2 flex flex-col justify-center border-black bg-white">
                                {d2}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    
    }
}

export default FileDiffPopup;