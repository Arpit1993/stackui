import React from 'react';

const CsvDiffViz = (props) => {
    
    return (
        <div className="overflow-scroll h-[1000px]">
            <div key="cmp5" className="flex font-thin w-[490px] overflow-scroll">
                <pre className="w-[1px] break-all"> 
                    <div className="w-[1px]">
                        {props.data}
                    </div>
                </pre>
            </div>
        </div>
    )
}

export default CsvDiffViz