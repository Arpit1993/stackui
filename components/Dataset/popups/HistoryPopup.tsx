import React from "react";
import { useState, useEffect } from "react";
import ItemCommit from "../Items/ItemCommit";

function generateButtons(page, handleClick){
    var listofButtons: Array<any> = []
    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 flex flex-col justify-center rounded-full h-[25px] w-[25px] p-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => handleClick(Math.max(page-1,0))}>
                {'<'}
            </button>
        </div>
    )

    listofButtons.push(
        <div>
            Page {page+1}
        </div>
    )

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 flex flex-col justify-center rounded-full h-[25px] w-[25px] p-2  shadow-sm dark: text-black hover:bg-gray-300" onClick={() => handleClick(page+1)}>
                {'>'}
            </button>
        </div>
    )

    return listofButtons
}

const HistoryPopup = (props) => {
    var commits = []
    const [history, setHistory] = useState([])
    const [page, setPage] = useState(0)
    const max_commits = 7
    const [max_pages, setMaxPages] = useState(0)

    useEffect(() => {
        if (props.history) {
            fetch(`http://localhost:8000/history/`).then((response) => response.json()).then((data) => { 
                setHistory(data)                
                setMaxPages(Object.keys(data).length/max_commits)
            });
        }
    }, [props])

    const handleClick = (next_page: number) => {
        setMaxPages(Object.keys(history).length/max_commits)
        setPage(Math.min(next_page,max_pages|0));
    }

    var buttons = generateButtons(page, handleClick)

    for(var i = Object.keys(history).length-1; i >= 0; i--){
        commits.push(
            {
                version: i+1, changes: Object.values(history)[(i).toString()].commits.length, date: Object.values(history)[i].date
            }
        )
    }
    
    const CloseComponent = [
        <button onClick={() => props.setHistory(0)} key={'ck1'} className="bg-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
        click to close
        </button>
    ]

    const HistComponent = props.history ? [
        <div key={'hc'}>
            {CloseComponent}
            <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-900 w-[1100px]  h-[700px]">
                <div className="flex-col justify-between">
                    <div className="w-full justify-between flex">
                        <button onClick={() => props.setHistory(0)} className= 'place-self-center justify-self-start w-[50px] h-[30px] flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
                        <div className="place-self-center text-md py-2 font-bold">
                            History of Commits
                        </div>
                        <div></div>
                    </div>
                    <ul className="text-xs h-[570px] w-full font-medium rounded-lg border 
                            text-gray-900 bg-white border-gray-200
                            dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                        {commits.filter((item, index) => index < max_commits*(page+1) && index >= max_commits*(page)).map((cmit, index) => <ItemCommit key={index.toString()} version={cmit.version} changes={cmit.changes} date={cmit.date}/>)}
                    </ul>
                </div>
                <div className="flex justify-evenly mt-5">
                    {buttons}
                </div>
            </div>
        </div>
    ] : [<></>]

    return (
        <>
            {HistComponent}
        </>
    )
}

export default HistoryPopup;