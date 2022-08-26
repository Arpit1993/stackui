import { useState, useEffect } from "react";

const ChangePopup = (props) => {

    const [page, setPage] = useState(0)

    return (
    
    <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md bg-white dark:bg-gray-400 w-[1100px]  h-[700px]">
        <div className="w-full justify-between flex">
            <button onClick={() => props.setPopup(0)} className= 'place-self-center justify-self-start w-[50px] h-[30px] flex-col bg-red-200 hover:bg-red-400 p-2 rounded-br-md'> x </button> 
            <div className="place-self-center py-2 font-bold">
                Change
            </div>
            <div></div>
        </div>
        <ul className="text-xs font-medium rounded-lg border 
                text-gray-900 bg-white border-gray-200
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="dark:hover:text-black py-4 px-4 justify-between flex-col w-full border-b border-gray-200 dark:border-gray-600">
                <div className="w-full flex truncate">
                    <div className="w-[100px]"> Author: </div>
                    <div className="w-full truncate"> {props.author} </div>
                </div>
                <div className="w-full flex truncate">
                    <div className="w-[100px]"> Comment:</div> 
                    <div className="w-full truncate underline"> {props.comment} </div>
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