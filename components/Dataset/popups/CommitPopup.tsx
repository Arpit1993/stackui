import { useState, useEffect } from "react";
import ItemChange from "../infobar/ItemChange";


function generateButtons(page, handleClick){
    var listofButtons = []
    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-md p-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => handleClick(page, Math.max(page-1,0))}>
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
            <button className=" bg-gray-200 rounded-md px-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => handleClick(page,page+1)}>
                {'>'}
            </button>
        </div>
    )

    return listofButtons
}

const CommitPopup = (props) => {

    const [changes, setChanges] = useState([])
    const [page, setPage] = useState(0)
    const max_commits = 7

    useEffect(() => {
        if (props.popup){
            const getChanges = async (page) =>  {
                const res = await fetch('http://127.0.0.1:8000/commits_version?version='.concat(props.version).concat('&l=7&page=0'))
                const data = await res.json();
                setChanges(Object.values(data))
            }
            getChanges(page)
        }
    }, [])

    const fetchChanges = async (page) => {
        if (props.popup){
            const res = await fetch('http://127.0.0.1:8000/commits_version?version='.concat(props.version).concat('&l=7&page=').concat(page))        
            const data = await res.json();
            return data
        }
    }

    const handleClick = async (page, next_page) => {
        setPage(next_page);
        const newChanges = await fetchChanges(next_page);
        setChanges(Object.values(newChanges))
    }

    var buttons = generateButtons(page, handleClick)

    if (props.popup == 0) {
        return <div></div>
    } else {
    return (
    
    <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md bg-white dark:bg-gray-400 w-[1100px]  h-[700px]">
        <div className="w-full justify-between flex">
            <button onClick={() => props.setPopup(0)} className= 'place-self-center justify-self-start w-[50px] h-[30px] flex-col bg-red-200 hover:bg-red-400 p-2 rounded-br-md'> x </button> 
            <div className="place-self-center py-2 font-bold">
                Commit {props.version}
            </div>
            <div></div>
        </div>
        <ul className="text-xs h-[570px] font-medium rounded-lg border 
                text-gray-900 bg-white border-gray-200
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {changes.map((cmit) => <ItemChange author={cmit.source} comment={cmit.comment} date={cmit.date}/>)}
        </ul>
        <div className="flex justify-evenly mt-5">
            {buttons}
        </div>
    </div>)}
}

export default CommitPopup;