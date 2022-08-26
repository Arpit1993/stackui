import { useState } from "react";
import CommitPopup from "../popups/CommitPopup";

const ItemCommit = (props) => {

    const [popup, setPopup] = useState(0)
    
    if (popup) {
        return (
            <div>
                <CommitPopup version={props.version} setPopup={setPopup} popup={popup}/>
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
        )
    } else{
        return (
            <div>
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
        )
    }
}

export default ItemCommit