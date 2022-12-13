import React from "react";
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from "react"
import LoadingScreen from "../../LoadingScreen";

const ItemFileVersion = (props) => {

    const [loading, setLoading] = useState<Boolean>(false)

    const revertKey = async (version: number, keyId: string) => {
        setLoading(true)
        await fetch('http://localhost:8000/revert_key_version?key='.concat(keyId).concat('&version=').concat(version.toString()))
        setLoading(false)
        window.location.reload();
        return true
    }

    const Loading_screen = loading ? [<LoadingScreen msg={'reverting...'}  key={'lds'}/>] : [<></>]
    var date = new Date(props.date.concat(' GMT')).toString();

    return (
        <div className="flex w-full mb-1 px-2 gap-2">
            <div className="text-start w-8/12">
                <li className=" py-4 px-4 justify-between flex-col w-full rounded-md border-[0.5px] border-gray-500 dark:border-gray-200">
                    <div className="w-full flex truncate">
                        <div className="w-[100px]"> Version: </div>
                        <div className="w-full truncate"> {props.version} </div>
                    </div>
                    <div className="w-full truncate flex">
                        <div className="w-[100px]"> Date:</div>
                        <div className="w-full truncate"> {date} </div>
                    </div>
                </li>
            </div>
            <button disabled={props.noClick} onClick={() => revertKey(props.version as number, props.keyId as string)} className=" text-start w-4/12">
                <li className={
                    props.noClick ? 
                    "w-full h-full flex text-center flex-col justify-center py-2.5 px-5 mr-2 mb-2 text-sm font-body text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:cursor-not-allowed hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    :
                    "w-full h-full flex text-center flex-col justify-center py-2.5 px-5 mr-2 mb-2 text-sm font-body text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }>
                    Revert to V{props.version}
                </li>
            </button>
            {Loading_screen}
        </div>
    )
}

export default ItemFileVersion