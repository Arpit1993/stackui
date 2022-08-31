import { useState, useEffect, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from "react";
import ItemChange from "../Items/ItemChange";
import HistoryPopup from "../popups/HistoryPopup";

const Infobar = (props: { description: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; commits: { source: any; comment: any; date: any; }[]; }) => {
    
    const [popup, setPopup] = useState(0)

    const HistPopup = popup ? [<HistoryPopup setHistory={setPopup} history={popup} key={'hpp'}/>] : [<></>]

    return (
        <div className='p-2 w-80 grow flew-col shadow-lg'>
            {HistPopup}
            <div className="p-4">
                <h2 className='text-center p-4'>
                    Description
                </h2>
                <p className='text-xs p-4 '>
                    {props.description} 
                </p>
            </div>

            <div className="p-1">
                <h2 className='text-center p-4 text-bold under'>
                    Activity
                </h2>
                <ul className="text-xs font-medium rounded-sm border 
                text-gray-900 bg-white border-gray-200
                dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {props.commits.map((cmit: { source: any; comment: any; date: any; }, index: { toString: () => any; }) => <ItemChange key={index.toString()} author={cmit.source} comment={cmit.comment} date={cmit.date}/>)}
                    <button onClick={() => setPopup(1)} className="w-full">
                        <li className="text-center py-4 px-2 justify-between flex-col w-full 
                        hover:bg-green-800 bg-green-700 text-white font-medium ring-2 ring-black mt-2 rounded-lg border-b text-sm border-gray-200 dark:border-gray-600">
                            View History
                        </li>
                    </button>
                </ul>
            </div>
        </div>
    )
}

export default Infobar;