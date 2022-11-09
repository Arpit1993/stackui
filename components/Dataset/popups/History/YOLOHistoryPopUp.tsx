import React from "react";
import { useState, useEffect } from "react";
import ItemFileVersion from "../../Items/ItemFileVersion";


function generateButtons(page, handleClick){
    var listofButtons: array<any> = []
    listofButtons.push(
        <div key="gs" className="flex">
            <button className=" bg-gray-200 flex flex-col justify-center rounded-full h-[25px] w-[25px] p-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => handleClick(page, Math.max(page-1,0))}>
                {'<'}
            </button>
        </div>
    )

    listofButtons.push(
        <div key="bgs">
            Page {page+1}
        </div>
    )

    listofButtons.push(
        <div key="bbgs" className="flex">
            <button className=" bg-gray-200 flex flex-col justify-center rounded-full h-[25px] w-[25px] p-2  shadow-sm dark: text-black hover:bg-gray-300" onClick={() => handleClick(page,page+1)}>
                {'>'}
            </button>
        </div>
    )

    return listofButtons
}

const YOLOHistoryPopUp = (props) => {

    const [changesImages, setChangesImages] = useState([])
    const [changesLabels, setChangesLabels] = useState([])
    const [page, setPage] = useState(0)
    const [maxPages, setMaxPages] = useState(0)
    const [labelname, setlabelName] = useState('')
    const max_commits = 3

    useEffect(() => {
        if (props.popup){
            const getChanges = async (page) =>  {
                const res = await fetch(('http://localhost:8000/key_versions?key='.concat(props.keyId).concat('&l=3&page=').concat(page)))
                const data = await res.json();
                setChangesImages(Object.values(data.commits))

                const res2 = await fetch('http://localhost:8000/label_versions?key='.concat(props.keyId).concat('&l=3&page=').concat(page))
                const data2 = await res2.json();
                setChangesLabels(Object.values(data2.commits))
                setlabelName(data2.keyId)
                setMaxPages(Math.max(data.len/max_commits,data2.len/max_commits))
            }
            getChanges(page)
        }
    }, [page, props])

    const handleClick = async (page, next_page) => {
        setPage(Math.min(next_page,maxPages-0.0001|0));
    }

    var buttons = generateButtons(page, handleClick)

    if (props.popup == 0) {
        return <div></div>
    } else {
    return (
    
    <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-900 w-[1100px]  h-[700px]">
        <div className="w-full justify-between flex">
            <div className="py-1 px-2">
                <button onClick={() => props.setPopup(0)} className='text-xs px-1 w-[15px] h-[15px] flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
            </div>
            <div className="place-self-center py-2 font-bold">
                Versions of file {props.keyId}
            </div>
            <div></div>
        </div>

        <div className="text-center text-lg">
            {'Image Versions'}
        </div>

        <ul className="text-xs h-[260px] font-medium rounded-lg border 
                text-gray-900 bg-white border-gray-200
                  dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {changesImages.map((data, index) => <ItemFileVersion key={'IFV'.concat(index.toString())} keyId={props.keyId} version={data.version} date={data.date} commit={data.commit}/>)}
        </ul>

        <div className="text-center text-lg">
            {'Label Versions'}
        </div>

        <ul className="text-xs h-[260px] font-medium rounded-lg border 
                text-gray-900 bg-white border-gray-200
                  dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {changesLabels.map((data, index) => <ItemFileVersion key={'IFV'.concat(index.toString())} keyId={labelname} version={data.version} date={data.date} commit={data.commit}/>)}
        </ul>

        <div className="flex justify-evenly mt-5">
            {buttons}
        </div>
    </div>)}
}

export default YOLOHistoryPopUp;