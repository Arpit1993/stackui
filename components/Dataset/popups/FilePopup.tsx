import React from "react";
import { useState, useEffect } from "react";
import LoadingScreen from "../../LoadingScreen";
import ItemFileVersion from "../Items/ItemFileVersion";
import FileHistoryPopUp from "./FileHistoryPopUp";

const FilePopup = (props) => {
    
    const [popup, setPopup] = useState(0)
    const [loading, setLoading] = useState(0)
    const [version, setVersions] = useState([{version: 'loading...', date: 'loading...',commit: 'loading...'}])

    const handleDelete = async () => {
        setLoading(1)
        await fetch('http://localhost:8000/remove_key?key='.concat(props.keyId))
        window.location.reload(true);
        return true
    }

    const handleFullDelete = async () => {
        setLoading(1)
        await fetch('http://localhost:8000/full_remove_key?key='.concat(props.keyId))
        window.location.reload(true);
        return true
    }

    useEffect(() => {
        if (props.popup) {
            fetch('http://localhost:8000/key_versions?key='.concat(props.keyId).concat('&l=4&page=').concat(0))
            .then((data) => data.json()).then((res) => setVersions(Object.values(res.commits)))
        }
    }, [props])

    const CloseComponent = [
        <button key={'ccb'} onClick={() => props.setPopup(0)} className="bg-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
        click to close
        </button>
    ]
    
    const Versionspopup =  popup ? [
        <>
            <FileHistoryPopUp keyId={props.keyId} setPopup={setPopup} popup={popup}/>
        </>
    ] : [<></>]

    const LoadingPopup = loading ? [<LoadingScreen  key={'lscpp'}/>] : [null]

    if (props.popup == 0) {
        return <div></div>
    } else {
    return (
        <>  
            {CloseComponent}
            <div className="text-sm dark:bg-slate-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md bg-white w-[1100px]  h-[700px]">
                <div className="w-full justify-between flex">
                    <button onClick={() => props.setPopup(0)} className= 'place-self-center justify-self-start w-[50px] h-[30px] flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
                    <div className="place-self-center py-2 font-bold">
                        File: {props.keyId}
                    </div>
                    <div></div>
                </div>
                <ul className="text-xs font-medium rounded-lg 
                        text-gray-900 bg-white
                        dark:bg-gray-700 dark:text-white">
                    <div className="flex h-[500px]">
                        <div className="w-[800px] dark:text-black border-2 text-center flex flex-col justify-center border-black bg-white">
                            Loading visualization...
                        </div>
                        <div className="w-[300px]">
                            <div className="flex py-5 h-[75px] justify-end px-5 gap-2"> 
                                <button onClick={() => handleDelete()} className="bg-black h-[30px] w-[100px] hover:bg-red-600 text-white font-thin text-lg px-5">
                                    Delete 
                                </button>

                                <button onClick={() => handleFullDelete()} className="bg-black h-[30px] w-[150px] hover:bg-red-600 text-white font-thin text-lg px-5">
                                    Delete Diffs
                                </button>
                            </div>
                            <div className="text-center py-5 font-light text-base flex flex-col">
                                Datapoint Versions
                            </div>
                            <div className="">
                                {
                                    version.map((data, index) => <ItemFileVersion  key={index.toString()} keyId={props.keyId} version={data.version} date={data.date} commit={data.commit}/>)
                                }
                            </div>
                            <div className="flex py-2 h-[25px] justify-center px-2"> 
                                <button onClick={() => setPopup(1)} className="bg-green-700 ring-2 ring-black rounded-md h-[50px] w-[200px] hover:bg-green-900 text-white font-thin text-lg px-5"> 
                                    See History 
                                </button>
                            </div>
                        </div>
                    </div>
                </ul>
            </div>
            {Versionspopup}
            {LoadingPopup}
        </>)}
}

export default FilePopup;