import React, { useEffect, useState } from "react";
import Histogram from "./Items/Histogram";
import Scatter from "./Items/Scatter";

const YOLOStatistics = (props) => {
    const [metadata, setMetadata]= useState<any>(null)
    useEffect(()=>{
        fetch('http://localhost:8000/schema_metadata').then((res) => res.json()).then((res) => {
            setMetadata(res); console.log(res);
        })
    },[props.filtering])

    return (
        <div className="w-full h-full bg-white dark:bg-black">
            <div className="w-full h-full px-5">
                {
                    (metadata) ?
                    <Scatter data={metadata.size} title={'Embedding'}/> : <></>
                }
                {
                    (metadata) ?
                    <Histogram data={metadata.n_class} title={'Class distribution'}/> : <></>
                }
                {
                    (metadata) ?
                    <Histogram data={metadata.n_res} title={'Image resolutions distribution'}/> : <></>
                }
                {
                    (metadata) ?
                    <Histogram 
                        data={
                            Object.keys(metadata.n_lm)
                            .sort(
                                (a,b) => {
                                    const d1 = new Date(b)
                                    const d2 = new Date(a)
                                    if (d2 > d1){
                                        return 1
                                    } else if (d1 > d2){
                                        return -1
                                    } else {
                                        return 0
                                    }
                                }
                            ).reduce((obj, key) => {
                                    obj[key] = metadata.n_lm[key]; 
                                    return obj;
                            }, {})
                        } 
                        title={'Date of changes distribution'}
                    /> 
                    : 
                    <></>
                }
            </div>
        </div>
    )
}

export default YOLOStatistics;