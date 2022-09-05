import React from "react";
import { useState, useEffect } from "react";
import ItemChange from "../Items/ItemChange";


function generateButtons(page, handleClick){
    var listofButtons = []
    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 flex flex-col justify-center rounded-full h-[25px] w-[25px] p-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => handleClick(page, Math.max(page-1,0))}>
                {'<'}
            </button>
        </div>
    )

    listofButtons.push(
        <div>
            Page {page}
        </div>
    )

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 flex flex-col justify-center rounded-full h-[25px] w-[25px] p-2  shadow-sm dark: text-black hover:bg-gray-300" onClick={() => handleClick(page,page+1)}>
                {'>'}
            </button>
        </div>
    )

    return listofButtons
}

const CommitPopup = (props) => {

    const [changes, setChanges] = useState([])
    const [page, setPage] = useState(0)
    const [maxPages, setMaxPages] = useState(0)
    const max_commits = 7

    useEffect(() => {
        if (props.popup){
            const getChanges = async (page) =>  {
                const res = await fetch('http://localhost:8000/commits_version?version='.concat(props.version).concat('&l=7&page=0'))
                const data = await res.json();
                setChanges(Object.values(data.commits))
                setMaxPages(data.len/max_commits)
            }
            getChanges(page)
        }
    }, [page, props])

    const fetchChanges = async (page) => {
        if (props.popup){
            const res = await fetch('http://localhost:8000/commits_version?version='.concat(props.version).concat('&l=7&page=').concat(page))        
            const data = await res.json();
            setMaxPages(data.len/max_commits)
            return data.commits
        }
    }

    const handleClick = async (page, next_page) => {
        setPage(Math.min(next_page,maxPages-0.0001|0));
        const newChanges = await fetchChanges(Math.min(next_page,maxPages-0.0001|0));
        setChanges(Object.values(newChanges))
    }

    var buttons = generateButtons(page, handleClick)

    if (props.popup == 0) {
        return <div></div>
    } else {
    return (
    
    <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md bg-white dark:bg-gray-400 w-[1100px]  h-[700px]">
        <div className="w-full justify-between flex">
            <button onClick={() => props.setPopup(0)} className= 'place-self-center justify-self-start w-[50px] h-[30px] flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
            <div className="place-self-center py-2 font-bold">
                Commit {props.version}
            </div>
            <div></div>
        </div>
        <ul className="text-xs h-[570px] font-medium rounded-lg border 
                text-gray-900 bg-white border-gray-200
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {changes.map((cmit,index) => <ItemChange key={index.toString()} author={cmit.source} comment={cmit.comment} date={cmit.date}/>)}
        </ul>
        <div className="flex justify-evenly mt-5">
            {buttons}
        </div>
    </div>)}
}

export default CommitPopup;