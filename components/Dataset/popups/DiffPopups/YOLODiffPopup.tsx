import React, { useRef } from "react";
import { useState, useEffect } from "react";
import DropdownVersion from "../Components/DropdownVersion";
import YOLOViz from "../../Visualizers/YOLOViz";
import DropdownVersionCoupled from "../Components/DropdownVersionCoupled";
import { timeLog } from "console";

const fetchData = async (keyId, version, setD, label_v) => {

    const cmd = 'http://localhost:8000/pull_file_api?file='.concat(keyId).concat('&version=').concat(version)

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
    [<YOLOViz key={'imdpp'} diff={true} label_version={label_v} img={img} ww={500} wh={500} keyId={keyId} ox={0} oy={0} setSubmit={()=>{}} setnewLabels={()=>{}}/>]).then(setD)
}

const YOLODiffPopup = (props) => {
    const [v1, setV1] = useState<number>(props.len)
    const [v2, setV2] = useState<number>(Math.max(props.len-1,1))
    const [d1, setD1] = useState(null)
    const [d2, setD2] = useState(null)

    const [first, setFirst] = useState<Boolean>(true)

    const [timeLabels, setTimeLabels] = useState<Array<string>>([])
    
    const [l1, setL1] = useState<number>(-1)
    const [l2, setL2] = useState<number>(-1)

    useEffect( () => {

        const fetchStuff = async (keyId, setD1, setD2, v1, v2, l1, l2) => {
            setD1(null)
            setD2(null)
            await fetchData(keyId,v1,setD1, l1)
            await fetchData(keyId,v2,setD2, l2)
        }
        if(props.popup == 1){ 
            if (first){
                fetch('http://localhost:8000/label_versions?key='.concat(props.keyId).concat('&l=10&page=0'))
                .then((data) => data.json()).then((res) => {
                    if(first){
                        setTimeLabels(Object.values(res.commits).map( (cm) => cm.date))
                        setL1(res.len)
                        setL2(Math.max(res.len-1,1))
                        setFirst(false)
                        fetchStuff(props.keyId, setD1, setD2, v1, v2, res.len, Math.max(res.len-1,1))
                    }
                })
            } else { 
                fetchStuff(props.keyId, setD1, setD2, v1, v2, l1, l2)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.keyId, v1, v2, l1, l2])
    
    return (
        <div className="text-sm z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-900 w-[1100px]  h-[700px]">
            <div className="w-full justify-between h-8 flex">
                <div className="py-1 px-2">
                    <button onClick={() => props.setPopup(false)} className='text-xs px-1 w-[15px] h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                </div> 
                <div className="place-self-center py-2 font-bold">
                    File: {props.keyId}
                </div>
                <div></div>
            </div>
            <div className="flex justify-center gap-2">
                <div className="mt-2 gap-2">
                    <DropdownVersionCoupled className="z-10" label={'Datapoint Version'} setD={setV1} setL={setL1} vD={v1} vL={l1} imageDate={props.dates} labelDate={timeLabels} />
                    <div className="z-auto w-[500px] h-[505px] rounded-md dark:text-black text-center border-2 flex flex-col justify-center border-black bg-white dark:bg-black">
                        {d1}
                    </div>
                </div>
                <div className="mt-2  gap-2">
                    <DropdownVersionCoupled className="z-10" label={'Datapoint Version'} setD={setV2} setL={setL2} vD={v2} vL={l2} imageDate={props.dates} labelDate={timeLabels} />
                    <div className="z-auto w-[500px] h-[506px] rounded-md dark:text-black text-center border-2 flex flex-col justify-center border-black bg-white dark:bg-black">
                        {d2}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default YOLODiffPopup;