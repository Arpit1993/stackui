import { useState, useEffect } from "react";

const FilePopup = (props) => {

    const [page, setPage] = useState(0)

    if (props.popup == 0) {
        return <div></div>
    } else {
    return (
    
    <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md bg-white dark:bg-gray-400 w-[1100px]  h-[700px]">
        <div className="w-full justify-between flex">
            <button onClick={() => props.setPopup(0)} className= 'place-self-center justify-self-start w-[50px] h-[30px] flex-col bg-red-200 hover:bg-red-400 p-2 rounded-br-md'> x </button> 
            <div className="place-self-center py-2 font-bold">
                File
            </div>
            <div></div>
        </div>
        <ul className="text-xs font-medium rounded-lg border 
                text-gray-900 bg-white border-gray-200
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    Content will be here
        </ul>
    </div>)}
}

export default FilePopup;