import React from "react";
import { useState, useEffect } from "react";
import ItemChange from "../../../Items/ItemChange";
import HistoryPopup from "../../../Modals/HistoryPopup";
import ReadmePopup from "../../../Modals/ReadmePopup";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

const Infobar = (props) => {
    
    const [popup, setPopup] = useState(false)
    const [readmePopup, setReadmePopup] = useState(false)
    const [readme, setReadme] = useState('')
    const [inside, setIn] = useState(true)

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
        <>
            {
                popup ? <HistoryPopup setHistory={setPopup} history={popup} key={'hpp'}/> : <></>
            }
            {
                readmePopup ? <ReadmePopup key={'rmpp'} readme={readme} setPopup={setReadmePopup}/> : <></>
            }
            <div className='bg-white rounded-lg shadow dark:bg-gray-700 fixed right-0 bottom-0 p-2 border border-gray-300 w-[20%] z-[49] h-[80%] grow flex flex-col flew-col justify-between'>
                <div className="flex items-start justify-between p-2 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Information
                    </h3>
                    <button onClick={()=>{props.setPopup(false)}} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                
                <div className="h-1/4 transition-all ease-out duration-700">
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

                        <div className="w-full p-2 h-24 overflow-clip">
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
        </>
    )
}

export default Infobar;