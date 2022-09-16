import { useState, useEffect, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from "react";
import CommitPopup from "../popups/CommitPopup";
import LoadingScreen from "../../LoadingScreen";
import React from "react";

const ItemCommit = (props: { version: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | null | undefined; changes: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; date: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }) => {

    const [popup, setPopup] = useState(0)
    const [loading, setLoading] = useState(0)
    const revert = async (version: number) => {
        setLoading(1)
        await fetch('http://localhost:8000/revert?version='.concat(version.toString()))
        setLoading(0)
        window.location.reload();
        return true
    }

    const Loading = loading ? [<LoadingScreen msg={'reverting...'}  key={'lds'}/>] : [<></>]
    const ComponentPopup = popup ? [<CommitPopup version={props.version} setPopup={setPopup} popup={popup}  key={'cmp'}/>] : [<></>]
    var date = new Date(props.date.concat(' GMT')).toString();

    return (
        <>
            {Loading}
            {ComponentPopup}
            <div className="">
                <div className="flex px-2 gap-2  mb-1 justify-between w-[1100px]">
                    <button onClick={() => setPopup(1)} className=" text-start w-[1100px]">
                        <li className="py-4 px-4 justify-between flex-col rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 border-[0.5px] border-gray-500 dark:border-gray-600">
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
                                <div className="w-full truncate underline"> {date} </div>
                            </div>
                        </li>
                    </button>


                    <button onClick={() => revert(props.version as number)} className=" text-start w-[100px]">
                        <li className="dark:hover:text-black rounded-lg bg-red-100 dark:text-black font-base text-center flex-col flex justify-center h-full py-4 px-4 w-[100px] hover:bg-red-400 border-[0.5px] border-gray-500 dark:border-gray-600">
                            revert to version {props.version}
                        </li>
                    </button>
                </div>
            </div>
        </>
    )
}

export default ItemCommit