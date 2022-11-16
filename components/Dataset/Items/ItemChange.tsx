import React from "react";
import { useState} from "react";
import ChangePopup from "../popups/ChangePopup";

const ItemChange = (props) => {

    const [popup, setPopup] = useState(false)
    var date = new Date(props.date.concat(' GMT')).toString();
    
    return (
        <div>
            {
                popup ? <ChangePopup popup={popup} setPopup={setPopup} author={props.author} comment={props.comment} date={props.date}  key={`chg2${date}${props.author}${props.comment}`}/> : <></>
            }
            <button onClick={() => setPopup(true)} className="text-start w-full">
                <li className=" py-4 px-4 justify-between rounded-lg flex-col w-full hover:bg-gray-100 border-[0.5px] mb-1 dark:hover:bg-gray-600 border-gray-500 dark:border-gray-600">
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
                        <div className="w-full truncate"> {date} </div>
                    </div>
                </li>
            </button>
        </div>
    )
}

export default ItemChange;