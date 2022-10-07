import { usePapaParse } from 'react-papaparse';
import React from 'react';

const CsvViz = (props) => {
    const {readString} = usePapaParse()
    const array = readString(props.data).data
    array.pop()

    return (
        <div className="overflow-scroll h-[1000px]">
            <div className="p-1 flex border border-black gap-2">
                <button className="p-1 rounded-full bg-gray-300" onClick={() => props.setRow(Math.max(0,props.row-1))}> {' U '} </button>
                <div className="p-1"> {props.row+1}-{Math.round(props.csv_metadata.rows)+1} </div>
                <button className="p-1 rounded-full bg-gray-300" onClick={() => props.setRow(Math.min(Math.round(props.csv_metadata.rows),props.row+1))}> {' D '} </button>
                
                <button className="p-1 rounded-full bg-gray-300" onClick={() => props.setCol(Math.max(0,props.col-1))}> {' L '} </button>
                <div className="p-1"> {props.col+1}-{Math.round(props.csv_metadata.cols)+1} </div>
                <button className="p-1 rounded-full bg-gray-300" onClick={() => props.setCol(Math.min(Math.round(props.csv_metadata.cols),props.col+1))}> {' R '} </button>
            </div>
            <div className="font-thin overflow-scroll">
                {
                    array.map( (row) =>
                        <tr key={`rw-${row}`}> 
                            {
                                row.map(
                                    (val) =>
                                    <td key={`rw-${row}-cl-${val}`} className='border-[0.5px] h-[35px] w-[68.5px] px-[5px] py-[5px] border-black shadow-inner'>
                                        <div className='overflow-scroll h-[35px] w-[68.5px]'>
                                            {val}
                                        </div>   
                                    </td>
                                )
                            }            
                        </tr>
                    )
                }
            </div>
        </div>
    )
}

export default CsvViz