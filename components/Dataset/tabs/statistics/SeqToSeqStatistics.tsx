import React, { useEffect, useState } from "react";
import Histogram from "./Items/Histogram";
import Scatter from "./Items/Scatter";

const SeqToSeqStatistics = (props) => {
    const [metadata, setMetadata]= useState<any>(null)
    useEffect(()=>{
        fetch('http://localhost:8000/schema_metadata').then((res) => res.json()).then((res) => {
            setMetadata(res); console.log(res);
        })
    },[props.filtering])

    return (
        <div className="w-full h-full p-4 bg-white dark:bg-black">
            <div className="w-full">
                {
                    (metadata) ?
                    <Scatter data={metadata.in_len} title={'Embedding'}/> : <></>
                }
                {
                    (metadata) ?
                    <Histogram data={metadata.n_in_len} title={'Input Length'}/> : <></>
                }
                {
                    (metadata) ?
                    <Histogram data={metadata.n_out_len} title={'Output Length'}/> : <></>
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

export default SeqToSeqStatistics;