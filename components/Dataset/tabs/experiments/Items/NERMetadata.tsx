import React, { useEffect, useState } from "react";
import Histogram from "../../statistics/Items/Histogram";
import Scatter from "../../statistics/Items/Scatter";

const NERMetadata = (props) => {
    
    return (
        <>
            {
                (props.mtdt) 
                ?
                <div className="w-max h-56 p-5 gap-2 justify-between flex items-center">
                    {
                        (props.mtdt) ?
                        <Scatter data={props.mtdt.n_lm} title={`Embedding ${props.date}`} noDropdown={true}/> : <></>
                    }
                    {
                        (props.mtdt) ?
                        <Histogram data={props.mtdt.n_entity} title={`Entity distribution ${props.date}`}/> : <></>
                    }
                    {
                        (props.mtdt) ?
                        <Histogram data={props.mtdt.n_len} title={`Entity Lenghts ${props.date}`}/> : <></>
                    }
                </div>
                : 
                null
            }

        </>
    )
}

export default NERMetadata;