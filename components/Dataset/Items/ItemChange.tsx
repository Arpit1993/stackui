import { useState, useEffect, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from "react";
import ChangePopup from "../popups/ChangePopup";

const ItemChange = (props: { author: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; comment: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; date: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; }) => {

    const [popup, setPopup] = useState(0)

    const ComponentPopup = popup ? 
    [<ChangePopup popup={popup} setPopup={setPopup} author={props.author} comment={props.comment} date={props.date}  key={'chg'}/>] : [<></>]

    return (
        <div>
            {ComponentPopup}
            <button onClick={() => setPopup(1)} className=" text-start w-full">
                <li className=" py-4 px-4 justify-between flex-col w-full hover:bg-gray-300 border-b dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600">
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

export default ItemChange;