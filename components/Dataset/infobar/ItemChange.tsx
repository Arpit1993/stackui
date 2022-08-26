import { useState } from "react";
import ChangePopup from "../popups/ChangePopup";

const ItemChange = (props) => {

    const [popup, setPopup] = useState(0)

    if (popup) {
       return (
            <div>
                <ChangePopup popup={popup} setPopup={setPopup} author={props.author} comment={props.comment} date={props.date}/>
                <button onClick={() => setPopup(1)} className=" text-start w-full">
                    <li className="dark:hover:text-black py-4 px-4 justify-between flex-col w-full hover:bg-gray-300 border-b border-gray-200 dark:border-gray-600">
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
                </button>
            </div>
        )
    } else {
        return (
            <div>
                <button onClick={() => setPopup(1)} className=" text-start w-full">
                    <li className="dark:hover:text-black py-4 px-4 justify-between flex-col w-full hover:bg-gray-300 border-b border-gray-200 dark:border-gray-600">
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
                </button>
            </div>
        )    
    }
}

export default ItemChange;