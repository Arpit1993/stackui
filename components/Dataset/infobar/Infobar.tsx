import React from "react";
import { useState, useEffect } from "react";
import ItemChange from "../Items/ItemChange";
import HistoryPopup from "../popups/HistoryPopup";
import ReadmePopup from "../popups/ReadmePopup";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

const Infobar = (props) => {
    
    const [popup, setPopup] = useState(false)
    const [readmePopup, setReadmePopup] = useState(false)
    const [readme, setReadme] = useState('')

    useEffect(()=>{
        setReadme('')
        fetch('http://localhost:8000/get_readme/').
            then((res) => res.body.getReader()).then((reader) =>
            new ReadableStream({
                start(controller) {
                    return pump();
                    function pump() {
                        return reader.read().then(({ done, value }) => {
                            if (done) {
                            controller.close();
                            return;
                            }
                            
                            controller.enqueue(value);
                            return pump();
                        });
                    }
                }
            })).then((stream) => new Response(stream)).then((response) => response.blob())
            .then((blob) => blob.text()).then(setReadme)
    },[props.dataset])

    return (
        <div className='w-full h-full grow flex flex-col flew-col justify-between'>
            {
                popup ? <HistoryPopup setHistory={setPopup} history={popup} key={'hpp'}/> : <></>
            }
            {
                readmePopup ? <ReadmePopup key={'rmpp'} readme={readme} setPopup={setReadmePopup}/> : <></>
            }
            <div className="h-1/4">
                    <h1 className='text-center text-lg p-2'> Description </h1>

                {
                    (readme == '') ? 

                    <div className="">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[180px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    </div>

                    :

                    <div className="w-full p-2 h-[106px] overflow-clip">
                        <article className="text-xs dark:text-white">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {readme}
                            </ReactMarkdown>                  
                        </article>
                    </div>
                }

                <button className="flex justify-end mt-1 text-sm underline text-gray-600" onClick={() => { setReadmePopup(true) } }>
                    view more
                </button>
            </div>

            <div>
                
                <h2 className='text-center text-lg p-2 text-bold under'>
                    Recent Activity
                </h2>

                <ul className="text-xs font-body rounded-sm text-gray-900 dark:text-gray-400">
                    {props.commits.map((cmit: { source: any; comment: any; date: any; }, index: { toString: () => any; }) => <ItemChange key={index.toString()} author={cmit.source} comment={cmit.comment} date={cmit.date}/>)}
                    
                    <button className="flex justify-end mt-1 text-sm underline text-gray-600" onClick={() => setPopup(true)} >
                        view more
                    </button>
                </ul>
            </div>
        </div>
    )
}

export default Infobar;