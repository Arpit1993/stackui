import React from "react";
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from "react"
import LoadingScreen from "../../LoadingScreen";

const ItemFileVersion = (props: { version: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; commit: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; date: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; keyId: any }) => {

    const [popup, setPopup] = useState(0)
    const [loading, setLoading] = useState(0)

    const revertKey = async (version: number, keyId: string) => {
        setLoading(1)
        await fetch('http://localhost:8000/revert_key_version?key='.concat(keyId).concat('&version=').concat(version.toString()))
        setLoading(0)
        window.location.reload();
        return true
    }

    const Loading_screen = loading ? [<LoadingScreen msg={'reverting...'}  key={'lds'}/>] : [<></>]
    var date = new Date(props.date.concat(' GMT')).toString();

    return (
        <div className="flex w-full mb-1 px-2 gap-2">
            <button onClick={() => setPopup(1)} className="text-start w-8/12">
                <li className=" py-4 px-4 justify-between flex-col w-full rounded-md hover:bg-gray-300 border-[0.5px] border-gray-500 dark:hover:bg-gray-600  dark:border-gray-600">
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
                        <div className="w-full truncate"> {date} </div>
                    </div>
                </li>
            </button>
            <button onClick={() => revertKey(props.version as number, props.keyId as string)} className=" text-start w-4/12">
                <li className="dark:hover:text-black w-full bg-red-200 dark:text-black rounded-md font-medium text-center flex-col flex justify-center h-full py-4 px-4 hover:bg-red-400 border-[0.5px] border-gray-500 dark:border-gray-600">
                    revert to V{props.version}
                </li>
            </button>
            {Loading_screen}
        </div>
    )
}

export default ItemFileVersion