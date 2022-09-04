import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from "react";
import AddFilePopup from "../../popups/AddFilePopup";
import Link from "next/link";
import React from "react";

function commit(comment: string){
    fetch('http://localhost:8000/commit_req?comment='.concat(comment))
    return refresh()
}

function refresh(){
    window.location.reload();
    return true
}

const TopBar = (props: { fcn: (arg0: string) => void; props: { dataset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; URI: string; }; }) => {

    const [addPopup, setAddPopup] = useState(0)
    const [txt, setText] = useState('')

    const handleChange = (event: React.ChangeEvent<any>) => {
        setText(event.target.value)
    }

    const handleSubmit = (event: React.ChangeEvent<any> ) => {
        event.preventDefault()
        props.fcn(txt)
    }
    
    const PopupComponent = addPopup ? [<AddFilePopup popup={addPopup} setPopup={setAddPopup} key={'afp'}/>] : [<></>]

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
                    <div className="flex grid-cols-3 gap-2 mt-6">
                        <button onClick={()=>refresh()} className="h-10 w-max flex text-white flex-col justify-center bg-black text-sm px-2 hover:bg-gray-400" > refresh 🔄
                        </button>

                        <button onClick={()=>commit('')} className="h-10 flex text-white flex-col justify-center bg-black text-sm px-2 hover:bg-gray-400" > sync
                        </button>
                        
                        <button onClick={()=>setAddPopup(1)} className="h-10 flex flex-col justify-center text-white bg-black text-sm px-2 hover:bg-gray-400" > add
                        </button>
                    </div>
                    <div className="w-full py-6 text-black inline-block align-middle">
                        <form className="px-5" onSubmit={handleSubmit}>
                            <label className="flex justify-end gap-2"> 
                                <div className="">
                                    <input onChange={handleChange}
                                    className= "p-2 shadow-inner border rounded-dm border-gray-200 outline-2 bg-white dark:bg-gray-500" 
                                    placeholder="Filter" type="text" />   
                                </div>
                                <input className="bg-black text-white h-[30px] text-sm px-2 hover:bg-gray-400" type="submit"/>
                            </label> 
                        </form> 
                    </div>
                </div>
            </div>
            {PopupComponent}
        </>
    )
}

export default TopBar;