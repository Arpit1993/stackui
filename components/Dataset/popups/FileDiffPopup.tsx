import React, { useRef } from "react";
import { useState, useEffect } from "react";
import DropdownVersion from "./Components/DropdownVersion";
import Image from "next/image";
import { CsvToHtmlTable } from "react-csv-to-table";

const fetchData = async (keyId, version, setD) => {

    const isImage = ['jpg','png','jpeg','tiff','bmp','eps'].includes(keyId.split('.').pop())
    const isCSV =['csv'].includes(keyId.split('.').pop())
    const isText = ['txt'].includes(keyId.split('.').pop())
    const isJSON = ['json'].includes(keyId.split('.').pop())

    const cmd = 'http://localhost:8000/pull_file_api?file='.concat(keyId).concat('&version=').concat(version)

    console.log(version)

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
        [<Image alt='' key="cmp1" className="w-full h-max" src={img} objectFit={'contain'}  width={100} height={5000}/>]).then(setD) 
    } 
    else if (isCSV) {
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
        .then((text) => [<div key="cmp2" className="flex font-thin overflow-scroll">
            <CsvToHtmlTable tableRowClassName='border-1 shadow-inner p-2 border-black' tableColumnClassName='border-[1.5px] shadow-inner p-2 border-black' tableClassName='table-auto overflow-auto' data={text} csvDelimiter=","/>
        </div>]).then(setD)
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
    const [v2, setV2] = useState(props.len)
    const [d1, setD1] = useState(null)
    const [d2, setD2] = useState(null)

    useEffect( () => {

        const fetchStuff = async (keyId, setD1, setD2, v1, v2) => {
            await fetchData(keyId,v1,setD1)
            await fetchData(keyId,v2,setD2)
        }
        fetchStuff(props.keyId, setD1, setD2, v1, v2)
    },[props, v1, v2, fetchData, setD1, setD2])

    if (props.popup == 0) {
        return <div></div>
    } else {
    return (
    
    <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md bg-white dark:bg-gray-400 w-[1100px]  h-[700px]">
        <div className="w-full justify-between flex">
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