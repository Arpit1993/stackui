import React from "react";
import Histogram from "../../statistics/Items/Histogram";
import Scatter from "../../statistics/Items/Scatter";

const QAMetadata = (props) => {
    
    return (
        <>
            {
                (props.mtdt) 
                ?
                <div className="w-max h-56 p-5 gap-2 justify-between flex items-center">
                    {
                        (props.mtdt) ?
                        <Histogram data={props.mtdt.n_p_len} title={`Paragraph lengths ${props.date}`}/> : <></>
                    }
                    {
                        (props.mtdt) ?
                        <Histogram data={props.mtdt.n_q_len} title={`Question Lenghts ${props.date}`}/> : <></>
                    }
                    {
                        (props.mtdt) ?
                        <Histogram data={props.mtdt.n_ans_len} title={`Answer Lenghts ${props.date}`}/> : <></>
                    }
                </div>
                : 
                null
            }

        </>
    )
}

export default QAMetadata;