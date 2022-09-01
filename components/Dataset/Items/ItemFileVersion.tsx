import React from "react";
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from "react"


const ItemFileVersion = (props: { version: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; commit: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; date: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; keyId: any }) => {

    const [popup, setPopup] = useState(0)
    
    const revertKey = (version: number, keyId: number) => {
    }

    return (
        <div className="flex w-full">
            <button onClick={() => setPopup(1)} className="text-start w-3/4">
                <li className=" py-4 px-4 justify-between flex-col w-full hover:bg-gray-300 border-b dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600">
                    <div className="w-full flex truncate">
                        <div className="w-[100px]"> Version: </div>
                        <div className="w-full truncate"> {props.version} </div>
                    </div>
                    <div className="w-full flex truncate">
                        <div className="w-[100px]"> Commit:</div> 
                        <div className="w-full truncate"> {props.commit} </div>
                    </div>
                    <div className="w-full truncate flex">
                        <div className="w-[100px]"> Date:</div>
                        <div className="w-full truncate"> {props.date} </div>
                    </div>
                </li>
            </button>
            <button onClick={() => revertKey(props.version as number, props.keyId as number)} className=" text-start w-1/4">
                <li className="dark:hover:text-black w-full bg-red-200 dark:text-black font-medium text-center flex-col flex justify-center h-full py-4 px-4 hover:bg-red-400 border-b border-l border-gray-200 dark:border-gray-600">
                    revert
                </li>
            </button>
        </div>
    )
}

export default ItemFileVersion