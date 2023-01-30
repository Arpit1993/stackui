import React from "react";
import { useState} from "react";
import ChangePopup from "../Modals/ChangePopup";

const ItemChange = (props) => {

    // var date = new Date(props.date.concat(' GMT')).toString();
    var date = new Date(props.date.concat(' GMT')).toLocaleString("en-US");
    
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
                        <div className="justify-start bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                            <svg aria-hidden="true" className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                            {date}
                        </div>
                    </div>
                </li>
            </div>
        </div>
    )
}

export default ItemChange;