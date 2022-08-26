import { useState, useEffect } from "react";
import ItemChange from "./ItemChange";
import HistoryPopup from "../popups/HistoryPopup";

const Infobar = (props) => {
    
    const [popup, setPopup] = useState(0)

    if (popup) {
        return (
            <div className='p-2 w-80 grow flew-col shadow-lg'>
                
                <HistoryPopup setHistory={setPopup} history={popup}/>
                
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
                        {props.commits.map((cmit) => <ItemChange author={cmit.source} comment={cmit.comment} date={cmit.date}/>)}
                        <button onClick={() => setPopup(1)} className="w-full">
                            <li className="text-center dark:hover:text-black py-4 px-4 justify-between flex-col w-full 
                            hover:bg-gray-300 rounded-b-lg border-b border-gray-200 dark:border-gray-600">
                                See more
                            </li>
                        </button>
                    </ul>
                </div>
            </div>
        ) 
    } else {
        return (
            <div className='p-2 w-80 grow flew-col shadow-lg'>
                
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
                        {props.commits.map((cmit) => <ItemChange author={cmit.source} comment={cmit.comment} date={cmit.date}/>)}
                        <button onClick={() => setPopup(1)} className="w-full">
                            <li className="text-center dark:hover:text-black py-4 px-4 justify-between flex-col w-full 
                            hover:bg-gray-300 rounded-b-lg border-b border-gray-200 dark:border-gray-600">
                                See more
                            </li>
                        </button>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Infobar;