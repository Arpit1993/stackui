import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from "react";
import AddFilePopup from "../../popups/AddFilePopup";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import FilterPopup from "../../popups/FilterPopup";

function commit(comment: string){
    fetch('http://localhost:8000/commit_req?comment='.concat(comment))
    return refresh()
}

function refresh(){
    window.location.reload();
    return true
}

function partition(){
    window.location.reload();
    return true
}

const TopBar = (props: { fcn: (arg0: string) => void; props: { dataset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; URI: string; }; setFiltering: any}) => {

    const [filterPopup, setFilterPopup] = useState(0)
    const [addPopup, setAddPopup] = useState(0)
    const [txt, setText] = useState('')

    const handleChange = (event: React.ChangeEvent<any>) => {
        setText(event.target.value)
    }

    const handleSubmit = (event: React.ChangeEvent<any> ) => {
        event.preventDefault()
        props.fcn(txt)
    }
    
    const FilterComponent = filterPopup ? [<FilterPopup popup={filterPopup} setFiltering={props.setFiltering} setPopup={setFilterPopup} key={'fffp'}/>] : [<></>]
    const PopupComponent = addPopup ? [<AddFilePopup popup={addPopup} setPopup={setAddPopup} key={'afpp'}/>] : [<></>]

    return (    
        <>
            <div className="flex w-full justify-between ">
                <div className="pr-10 py-2 w-min">
                    <div className="px-2 py-2 text-lg text-bolder"> {props.props.dataset} </div>
                    <div className="px-2 py-2 text-sm underline"> 
                        {props.props.URI}
                    </div>
                </div>
                <div className="flex">
                    <div className="flex gap-2 mt-6 w-full">
                        <button onClick={()=>commit('')} className="h-[40px] w-max flex text-white flex-col rounded-md justify-center bg-green-700 text-sm px-2 hover:bg-green-900" > Refresh
                        </button>

                        <button onClick={()=>setAddPopup(1-addPopup)} className="h-[40px] flex flex-col rounded-md justify-center text-white bg-gray-500 text-sm px-2 hover:bg-gray-700" > Upload
                        </button>

                        <button onClick={()=>setFilterPopup(1-filterPopup)} className="h-[40px] flex flex-col rounded-md justify-center text-white bg-gray-200 text-sm px-2 hover:bg-gray-300" > 
                            {<Image src={'/Icons/filter-search.png'} alt='' width={'40px'} height={'20px'} objectFit={'contain'} />}
                        </button>
                    </div>
                    <div className="w-full py-6 text-black inline-block align-middle">
                        <form className="px-5" onSubmit={handleSubmit}>
                            <label className="flex justify-end gap-2"> 
                                <div className="">
                                    <input onChange={handleChange}
                                    className= "p-2 shadow-inner border rounded-dm border-gray-200 outline-2 bg-white dark:bg-gray-500" 
                                    placeholder="Search" type="text" />   
                                </div>
                                <div className="flex flex-col justify-center">
                                    <input className="bg-black text-white h-[40px]  rounded-md text-sm px-2 hover:bg-gray-400" type="submit"/>
                                </div>
                            </label> 
                        </form> 
                        
                    </div>
                </div>
            </div>
            {PopupComponent}
            {FilterComponent}
        </>
    )
}

export default TopBar;