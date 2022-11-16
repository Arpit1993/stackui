import React from "react";
import { useState, useEffect } from "react";

const ChangePopup = (props) => {

    const [page, setPage] = useState(0)

    return (
    
    <div className="text-sm absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-900 w-[1100px]  h-[700px]">
        <div className="w-full justify-between flex">
            <div className="py-1 px-2">
                <button onClick={() => props.setPopup(0)} className='text-xs px-1 w-[15px] h-[15px] flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
            </div> 
            <div className="place-self-center py-2 font-bold">
                Change
            </div>
            <div></div>
        </div>
        <ul className="text-xs font-body rounded-lg border 
                text-gray-900 bg-white border-gray-200
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="dark:hover:text-black py-4 px-4 justify-between flex-col w-full border-b border-gray-200 dark:border-gray-600">
                <div className="w-full flex truncate">
                    <div className="w-[100px]"> Author: </div>
                    <div className="w-full truncate"> {props.author} </div>
                </div>
                <div className="w-full flex truncate">
                    <div className="w-[100px]"> Comment:</div> 
                    <div className="w-full truncate"> {props.comment} </div>
                </div>
                <div className="w-full truncate flex">
                    <div className="w-[100px]"> Date:</div>
                    <div className="w-full truncate underline"> {props.date} </div>
                </div>
            </li>
        </ul>
    </div>)
}

export default ChangePopup;