import React from 'react';

const CsvDiffViz = (props) => {
    if (props.format == 'table'){
        return (
            <div className="h-full flex w-full justify-center dark:bg-gray-800 dark:text-white">
                <div key="cmp5" className="w-max flex flex-col justify-center">
                    <div className='flex gap-1'>
                        <div className='w-40 border border-gray-500 py-2 px-5 flex flex-col justify-center rounded-sm'>
                            Added rows
                        </div>
                        <div className='w-[300px] text-sm overflow-scroll border border-gray-500'>
                                {
                                    props.data.added.map((row) => 
                                    <tr key={`rw-${0}`}> 
                                        {
                                            Object.values(row).map(
                                                (val) =>
                                                <td key={`rw-${0}-cl-${val}`} className='overflow-scroll hover:cursor-text border-[0.5px] h-[35px] w-[68.5px] px-[5px] py-[5px] border-gray-500 shadow-inner'>
                                                    <div className='overflow-scroll h-[35px] w-[68.5px]'>
                                                        {val}
                                                    </div>   
                                                </td>
                                            )
                                        }
                                    </tr>)
                                }
                        </div>
                    </div>

                    <div className='flex gap-1 mt-1'>
                        <div className='text-sm w-40 border border-gray-500 rounded-sm py-2 px-5 flex flex-col justify-center'>
                            Deleted rows
                        </div>
                        <div className='w-[300px] overflow-scroll border border-gray-500'>
                                {
                                    props.data.removed.map((row) => 
                                    <tr key={`rw-${0}`}> 
                                        {
                                            Object.values(row).map(
                                                (val) =>
                                                <td key={`rw-${0}-cl-${val}`} className='overflow-scroll hover:cursor-text border-[0.5px] h-[35px] w-[68.5px] px-[5px] py-[5px] border-gray-500 shadow-inner'>
                                                    <div className='overflow-scroll h-[35px] w-[68.5px]'>
                                                        {val}
                                                    </div>   
                                                </td>
                                            )
                                        }
                                    </tr>)
                                }
                        </div>
                    </div>

                    <div className='flex gap-1 mt-1'>
                        <div className='w-40 border border-gray-500 rounded-sm py-2 px-5 flex flex-col justify-center'>
                            Changed rows
                        </div>
                        <div className='w-[300px] overflow-scroll  border border-gray-500'>
                                {
                                    props.data.changed.map((row) => 
                                    <tr key={`rw-${0}`}> 
                                        {
                                            Object.values(row).map(
                                                (val) =>
                                                <td key={`rw-${0}-cl-${val}`} className='overflow-scroll hover:cursor-text border-[0.5px] h-[35px] w-[68.5px] px-[5px] py-[5px] border-gray-500 shadow-inner'>
                                                    <div className='overflow-scroll h-[35px] w-[68.5px]'>
                                                        {val}
                                                    </div>   
                                                </td>
                                            )
                                        }
                                    </tr>)
                                }
                        </div>
                    </div>

                    <div className='flex  gap-1 mt-1'>
                        <div className='w-40 border rounded-sm border-gray-500 py-2 px-5 flex flex-col justify-center'>
                            Added columns
                        </div>
                        <div className='w-[300px] overflow-scroll border border-gray-500'>
                                {
                                    props.data.columns_added.map((row) => 
                                    <tr key={`rw-${0}`}> 
                                        {
                                            Object.values(row).map(
                                                (val) =>
                                                <td key={`rw-${0}-cl-${val}`} className='overflow-scroll hover:cursor-text border-[0.5px] h-[35px] w-[68.5px] px-[5px] py-[5px] border-gray-500 shadow-inner'>
                                                    <div className='overflow-scroll h-[35px] w-[68.5px]'>
                                                        {val}
                                                    </div>   
                                                </td>
                                            )
                                        }
                                    </tr>)
                                }
                        </div>
                    </div>

                    <div className='flex gap-1 mt-1'>
                        <div className='w-40 border rounded-sm border-gray-500 py-2 px-5 flex flex-col justify-center'>
                            Deleted columns
                        </div>
                        <div className='w-[300px] overflow-scroll border border-gray-500'>
                                {
                                    props.data.columns_removed.map((row) => 
                                    <tr key={`rw-${0}`}> 
                                        {
                                            Object.values(row).map(
                                                (val) =>
                                                <td key={`rw-${0}-cl-${val}`} className='overflow-scroll hover:cursor-text border-[0.5px] h-[35px] w-[68.5px] px-[5px] py-[5px] border-gray-500 shadow-inner'>
                                                    <div className='overflow-scroll h-[35px] w-[68.5px]'>
                                                        {val}
                                                    </div>   
                                                </td>
                                            )
                                        }
                                    </tr>)
                                }
                        </div>
                    </div>

                </div>
            </div>
        )
    } else {
        return (
            <div className="h-full flex w-full justify-center dark:bg-slate-800 dark:text-white">
                <div key="cmp5" className="w-max flex flex-col justify-center">
                    <div className='flex'>
                        <div className='text-green-500 w-40 border-2 border-blue py-2 px-5'>
                            Added rows:
                        </div>
                        <div className='text-green-500 border-2 border-blue py-2 px-5'>
                            {props.data.additions}
                        </div>
                    </div>
    
                    <div className='flex'>
                        <div className='text-red-500 w-40 border-2 border-blue py-2 px-5'>
                            Deleted rows:
                        </div>
                        <div className='text-red-500 border-2 border-blue py-2 px-5'>
                            {props.data.deletions}
                        </div>
                    </div>
    
                    <div className='flex'>
                        <div className='w-40 border-2 border-blue py-2 px-5'>
                            Modified rows:
                        </div>
                        <div className='border-2 border-blue py-2 px-5'>
                            {props.data.modifications}
                        </div>
                    </div>
    
                    <div className='flex'>
                        <div className='w-40 border-2 border-blue py-2 px-5'>
                            Modified columns:
                        </div>
                        <div className='border-2 border-blue py-2 px-5'>
                            {props.data.new_cols}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CsvDiffViz