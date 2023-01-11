import React from "react";
import { useState, useEffect } from "react";
import ItemCommit from "../Items/ItemCommit";
import posthog from 'posthog-js'

function generateButtons(page, handleClick){
    var listofButtons: Array<any> = []
    listofButtons.push(
        <div className="h-10 flex items-center">
            <button className="h-10 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={() => handleClick(Math.max(page-1,0))}>
                {'Previous'}
            </button>
        </div>
    )

    listofButtons.push(
        <div className="h-10 flex items-center">
            {`Page ${page+1}`}
        </div>
    )

    listofButtons.push(
        <div  className="h-10 flex items-center">
            <button className="h-10 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={() => handleClick(page+1)}>
                {'Next'}
            </button>
        </div>
    )

    return listofButtons
}

const HistoryPopup = (props) => {
    var commits: Array<any> = []
    const [history, setHistory] = useState([])
    const [page, setPage] = useState<number>(0)
    const max_commits = 6
    const [max_pages, setMaxPages] = useState<number>(0)

    useEffect(() => {
        fetch(`http://localhost:8000/history/`).then((response) => response.json()).then((data) => { 
            setHistory(data)                
            setMaxPages(Object.keys(data).length/max_commits)
            posthog.capture('Viewed history popup', { property: 'value' })
        });
    }, [props.history])

    const handleClick = (next_page: number) => {
        setMaxPages(Object.keys(history).length/max_commits)
        setPage(Math.min(next_page,max_pages|0));
    }

    const buttons = generateButtons(page, handleClick)

    for(var i = Object.keys(history).length-1; i >= 0; i--){
        commits.push(
            {
                version: i+1, changes: Object.values(history)[(i).toString()].commits.length, date: Object.values(history)[i].date
            }
        )
    }

    return (
        <div key={'hc'}>
            {
                <button onClick={() => props.setHistory(false)} key={'ck1'} className="bg-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
                    click to close
                </button>
            }
            <div className="text-sm z-40 flex flex-col justify-between absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-900 w-[75%]  h-[90%]">
                <div className="w-full h-full flex flex-col justify-between">
                    <div className="w-full h-[5%]  justify-between flex">
                        <div className="py-1 px-2">
                            <button onClick={() => props.setHistory(false)} className='text-xs px-1 w-4 h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                        </div> 
                        <div className="place-self-center text-md py-2 font-bold">
                            History of Commits
                        </div>
                        <div></div>
                    </div>
                    <div className="text-xs h-[80%] w-full">
                        {commits.filter((item, index) => index < max_commits*(page+1) && index >= max_commits*(page)).map((cmit, index) => <ItemCommit noClick={index ==0 && page==0} key={index.toString()} version={cmit.version} changes={cmit.changes} date={cmit.date}/>)}
                    </div>
                    <div className="h-[10%] flex w-full items-center justify-evenly">
                        {buttons}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistoryPopup;