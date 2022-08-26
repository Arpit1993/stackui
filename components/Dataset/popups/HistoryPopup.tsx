import { useState, useEffect } from "react";
import ItemCommit from "../infobar/ItemCommit";

function generateButtons(page, max_pages, setPage){
    var listofButtons = []
    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-md p-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(Math.max(page-1,0))}>
                {'<'}
            </button>
        </div>
    )

    listofButtons.push(
        <div>
            Page {page} of {max_pages | 0}
        </div>
    )

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-md px-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(Math.min(page+1|0))}>
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
    const [buttons, setButtons] = useState([])
    const max_commits = 8
    const [max_pages, setMaxPages] = useState(0)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/history/`).then((response) => response.json()).then((data) => setHistory(data)).then(() => {
            setMaxPages(Object.keys(history).length/max_commits)
            setButtons(generateButtons(page, max_pages, setPage))
        });
    }, [])

    for(var i = Object.keys(history).length-1; i >= 0; i--){
        commits.push(
            {
                version: i, changes: Object.values(history)[(i).toString()].commits.length, date: Object.values(history)[i].date
            }
        )
    }

    if (props.history == 0) {
        return <div></div>
    } else {
    return (
    
        <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md bg-white dark:bg-gray-400 w-[1100px]  h-[700px]">
            <div className="flex-col justify-between">
                <div className="w-full justify-between flex">
                    <button onClick={() => props.setHistory(0)} className= 'place-self-center justify-self-start w-[50px] h-[30px] flex-col bg-red-200 hover:bg-red-400 p-2 rounded-br-md'> x </button> 
                    <div className="place-self-center text-md py-2 font-bold">
                        History of Commits
                    </div>
                    <div></div>
                </div>
                <ul className="text-xs w-full font-medium rounded-lg border 
                        text-gray-900 bg-white border-gray-200
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {commits.filter((item, index) => index < max_commits*(page+1) && index > max_commits*(page)).map((cmit) => <ItemCommit version={cmit.version} changes={cmit.changes} date={cmit.date}/>)}
                </ul>
            </div>
            <div className="flex justify-evenly mt-5">
                {buttons}
            </div>
        </div>)
    }
}

export default HistoryPopup;