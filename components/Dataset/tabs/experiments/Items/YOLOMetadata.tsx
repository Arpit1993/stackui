import React, { useEffect, useState } from "react";
import Histogram from "../../statistics/Items/Histogram";
import Scatter from "../../statistics/Items/Scatter";

const YOLOMetadata = (props) => {
    
    return (
        <>
            {
                (props.mtdt) 
                ?
                <div className="w-full h-56 p-5 gap-2 justify-center flex items-center">
                    {
                        (props.mtdt) ?
                        <Scatter data={props.mtdt.size} title={`Embedding ${props.date}`} noDropdown={true}/> : <></>
                    }
                    {
                        (props.mtdt) ?
                        <Histogram data={props.mtdt.n_class} title={`Class distribution ${props.date}`}/> : <></>
                    }
                    {
                        (props.mtdt) ?
                        <Histogram data={props.mtdt.n_res} title={`Resolutions distribution ${props.date}`}/> : <></>
                    }
                </div>
                : 
                null
            }

        </>
    )
}

export default YOLOMetadata;