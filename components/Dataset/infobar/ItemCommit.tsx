import { useState } from "react";
import CommitPopup from "../popups/CommitPopup";

function revert(version: number) {
    fetch('http://127.0.0.1:8000/revert?version='.concat(version))
    return true
}

const ItemCommit = (props) => {

    const [popup, setPopup] = useState(0)
    
    if (popup) {
        return (
            <div>
                <CommitPopup version={props.version} setPopup={setPopup} popup={popup}/>
                <div className="flex">
                    <button onClick={() => setPopup(1)} className=" text-start w-full">
                        <li className="dark:hover:text-black py-4 px-4 justify-between flex-col w-full hover:bg-gray-300 border-b border-gray-200 dark:border-gray-600">
                            <div className="w-full flex truncate">
                                <div className="w-[100px]"> Version: </div>
                                <div className="w-full truncate"> {props.version} </div>
                            </div>
                            <div className="w-full flex truncate">
                                <div className="w-[100px]"> Changes:</div> 
                                <div className="w-full truncate underline"> {props.changes} </div>
                            </div>
                            <div className="w-full truncate flex">
                                <div className="w-[100px]"> Date:</div>
                                <div className="w-full truncate underline"> {props.date} </div>
                            </div>
                        </li>
                    </button>
                </div>
            </div>
        )
    } else{
        return (
            <div className="">
                <div className="flex justify-between w-[1800px]">
                        <button onClick={() => setPopup(1)} className=" text-start w-full">
                            <li className="dark:hover:text-black py-4 px-4 justify-between flex-col hover:bg-gray-300 border-b border-gray-200 dark:border-gray-600">
                                <div className="w-full flex truncate">
                                    <div className="w-[100px]"> Version: </div>
                                    <div className="w-full truncate"> {props.version} </div>
                                </div>
                                <div className="w-full flex truncate">
                                    <div className="w-[100px]"> Changes:</div> 
                                    <div className="w-full truncate underline"> {props.changes} </div>
                                </div>
                                <div className="w-full truncate flex">
                                    <div className="w-[100px]"> Date:</div>
                                    <div className="w-full truncate underline"> {props.date} </div>
                                </div>
                            </li>
                        </button>


                        <button onClick={() => revert(props.version)} className=" text-start w-full">
                            <li className="dark:hover:text-black font-medium text-center flex-col flex justify-center h-full py-4 px-4 w-[200px] hover:bg-red-200 border-b border-l border-gray-200 dark:border-gray-600">
                                revert
                            </li>
                        </button>
                    </div>
                </div>
        )
    }
}

export default ItemCommit