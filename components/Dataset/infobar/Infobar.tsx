import React from "react";
import { useState, useEffect, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from "react";
import ItemChange from "../Items/ItemChange";
import HistoryPopup from "../popups/HistoryPopup";
import ReadmePopup from "../popups/readmePopup";

const Infobar = (props) => {
    
    const [popup, setPopup] = useState(false)
    const [readmePopup, setReadmePopup] = useState(false)

    return (
        <div className='p-2 w-[250px] grow flex flex-col flew-col justify-between rounded-lg bg-white-50'>
            {
                popup ? <HistoryPopup setHistory={setPopup} history={popup} key={'hpp'}/> : <></>
            }
            {
                readmePopup ? <ReadmePopup key={'rmpp'} setPopup={setReadmePopup}/> : <></>
            }
            <div className="p-4">
                    <h1 className='text-center text-lg p-4'> Description </h1>
                <button  className=" text-sm underline text-gray-600" onClick={() => { setReadmePopup(true) } }>
                    view more
                </button>

                <div className="">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[180px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                </div>
            </div>

            <div className="p-2">
                
                <h2 className='text-center text-lg p-4 text-bold under'>
                    Recent Activity
                </h2>

                <ul className="text-xs font-body rounded-sm
                text-gray-900 dark:text-gray-400">
                    {props.commits.map((cmit: { source: any; comment: any; date: any; }, index: { toString: () => any; }) => <ItemChange key={index.toString()} author={cmit.source} comment={cmit.comment} date={cmit.date}/>)}
                    <button onClick={() => setPopup(true)} className="w-full py-3 px-5 text-base font-body text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        View All Versions
                    </button>
                </ul>
            </div>
        </div>
    )
}

export default Infobar;