import React from "react";
import { useState, useEffect, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from "react";
import ChangePopup from "../popups/ChangePopup";

const ItemChange = (props: { author: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; comment: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; date: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; }) => {

    const [popup, setPopup] = useState(0)
    var date = new Date(props.date.concat(' GMT')).toString();
    
    const ComponentPopup = popup ?     
    [<ChangePopup key={`change_popup${date}`} popup={popup} setPopup={setPopup} author={props.author} comment={props.comment} date={props.date}  key={`chg2${props.date}${props.author}${props.comment}`}/>] : [<></>]
    
    return (
        <div key={`change_element${date}`}>
            {ComponentPopup}
            <button onClick={() => setPopup(1)} className="text-start w-full">
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