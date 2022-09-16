import { usePapaParse } from 'react-papaparse';
import React from 'react';

const CsvToHtmlTable = (props) => {
    
    const {readString} = usePapaParse()
    
    const array = readString(props.data).data  
    return (
        <div>
            {
                array.map( (row) =>
                    <tr className='border-2 border-black'> 
                        {
                            row.map(
                                (val) =>

                                <td className='border-[0.5px] h-[50px] w-[100px] overflow-scroll px-[5px] py-[5px] border-black'>
                                    {val}   
                                </td>
                            )
                        }            
                    </tr>
                )
            }
        </div>
    )
}

export default CsvToHtmlTable