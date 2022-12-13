import { useState, useEffect, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from "react";
import CommitPopup from "../popups/CommitPopup";
import LoadingScreen from "../../LoadingScreen";
import React from "react";

const ItemCommit = (props) => {

    const [popup, setPopup] = useState<Boolean>(false)
    const [loading, setLoading] = useState<Boolean>(false)
    const revert = async (version: number) => {
        setLoading(true)
        await fetch('http://localhost:8000/revert?version='.concat(version.toString()))
        setLoading(false)
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
            <div className="w-full h-1/6">
                <div className="flex px-2 gap-2  mb-1 justify-between w-full">
                    <button onClick={() => setPopup(true)} className=" text-start w-4/5">
                        <div className="py-4 px-4 justify-between flex-col rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 border-[0.5px] border-gray-500 dark:border-gray-600">
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
                        </div>
                    </button>


                    <button disabled={props.noClick} onClick={() => revert(props.version as number)} className={props.noClick ? "cursor-not-allowed text-start w-1/5" : "text-start w-1/5"}>
                        <div className={
                            props.noClick ?
                            "w-full h-full flex text-center flex-col justify-center py-2.5 px-5 mr-2 mb-2 text-sm font-body text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            :
                            "w-full h-full flex text-center flex-col justify-center py-2.5 px-5 mr-2 mb-2 text-sm font-body text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        }>
                            revert to version {props.version}
                        </div>
                    </button>
                </div>
            </div>
        </>
    )
}

export default ItemCommit