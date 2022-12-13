import React from "react";
import { useState} from "react";
import ChangePopup from "../popups/ChangePopup";

const ItemChange = (props) => {

    var date = new Date(props.date.concat(' GMT')).toString();
    
    return (
        <div>
            <div className="text-start w-full">
                <li className="py-3 px-4 justify-between rounded-lg flex-col w-full border-[0.5px] mb-1 border-gray-500 dark:border-gray-600">
                    <div className="w-full flex justify-start truncate">
                        <div className="w-[2/12]"> Author: </div>
                        <div className="w-[10/12] truncate"> {props.author} </div>
                    </div>
                    <div className="w-full flex justify-start truncate">
                        <div className="w-[2/12]"> Comment:</div> 
                        <div className="w-[10/12] truncate"> {props.comment} </div>
                    </div>
                    <div className="w-full flex justify-start truncate">
                        <div className="w-[2/12]"> Date:</div>
                        <div className="w-[10/12] truncate"> {date} </div>
                    </div>
                </li>
            </div>
        </div>
    )
}

export default ItemChange;