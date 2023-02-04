import React from "react";
import Histogram from "../../statistics/Items/Histogram";
import Scatter from "../../statistics/Items/Scatter";

const Seq2SeqMetadata = (props) => {
    
    return (
        <>
            {
                (props.mtdt) 
                ?
                <div className="w-max h-56 p-5 gap-2 justify-between flex items-center">
                    {
                        (props.mtdt) ?
                        <Scatter data={props.mtdt.in_len} title={`Embedding ${props.date}`} noDropdown={true}/> : <></>
                    }
                    {
                        (props.mtdt) ?
                        <Histogram data={props.mtdt.n_in_len} title={`Input lengths ${props.date}`}/> : <></>
                    }
                    {
                        (props.mtdt) ?
                        <Histogram data={props.mtdt.n_out_len} title={`Output lengths ${props.date}`}/> : <></>
                    }
                </div>
                : 
                null
            }

        </>
    )
}

export default Seq2SeqMetadata;