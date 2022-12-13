import React, { useEffect, useState } from "react";
import Histogram from "./Items/Histogram";
import Scatter from "./Items/Scatter";

const YOLOStatistics = (props) => {
    const [metadata, setMetadata]= useState<any>(null)
    useEffect(()=>{
        fetch('http://localhost:8000/schema_metadata').then((res) => res.json()).then((res) => {setMetadata(res); console.log(res)})
    },[props.filtering])
    
    return (
        <button disabled={true} onClick={()=>{props.shortcuts.current = props.statisticsPopup; props.setStatisticsPopup(!props.statisticsPopup)}} className="fixed z-[30] left-[20%] bottom-0 w-[60%] h-[70%] bg-gray-50 dark:bg-gray-900">
            <div className="w-full h-full overflow-scroll justify-between flex flex-col items-center">
                {/* {
                    (metadata) ?
                    <Scatter data={metadata.size} title={'T-SNE embedding'}/> : <></>
                } */}
                {
                    (metadata) ?
                    <Histogram data={metadata.n_class} title={'Class distribution'}/> : <></>
                }
                {
                    (metadata) ?
                    <Histogram data={metadata.n_res} title={'Image resolutions'}/> : <></>
                }
                {
                    (metadata) ?
                    <Histogram data={metadata.n_lm} title={'date of changes'}/> : <></>
                }
            </div>
        </button>
    )
}

export default YOLOStatistics;