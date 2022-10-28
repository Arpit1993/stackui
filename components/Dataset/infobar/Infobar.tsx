import React from "react";
import { useState, useEffect, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from "react";
import ItemChange from "../Items/ItemChange";
import HistoryPopup from "../popups/HistoryPopup";

const Infobar = (props: { description: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; commits: { source: any; comment: any; date: any; }[]; }) => {
    
    const [popup, setPopup] = useState(0)

    const HistPopup = popup ? [<HistoryPopup setHistory={setPopup} history={popup} key={'hpp'}/>] : [<></>]

    return (
        <div className='p-2 w-[250px] grow flew-col rounded-lg bg-white-50'>
            {HistPopup}
            <div className="p-4">
                {/* <h2 className='text-center text-lg p-4'>
                    Description
                </h2>
                <p className='text-xs'>
                    Dataset visualization and exploration. Custom descriptions coming up
                    {props.description} 
                </p> */}
            </div>

            <div className="p-1">
                <h2 className='text-center text-lg p-4 text-bold under'>
                    Recent Activity
                </h2>
                <ul className="text-xs font-medium rounded-sm
                text-gray-900 dark:text-gray-400">
                    {props.commits.map((cmit: { source: any; comment: any; date: any; }, index: { toString: () => any; }) => <ItemChange key={index.toString()} author={cmit.source} comment={cmit.comment} date={cmit.date}/>)}
                    <button onClick={() => setPopup(1)} className="w-full">
                        <li className="text-center py-4 px-2 justify-between flex-col w-full 
                        hover:bg-green-800 bg-green-700 text-white font-medium mt-2 rounded-lg border-b text-base border-gray-200 dark:border-gray-600">
                            View All Versions
                        </li>
                    </button>
                </ul>
            </div>
        </div>
    )
}

export default Infobar;