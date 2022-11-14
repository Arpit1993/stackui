import React, { useState } from "react"
import Image from "next/image"
import DropdownFile from "./DropdownFile"
import FileTagPopup from "../Popups/FileTagPopup"
import SquareIcon from '@mui/icons-material/Square';

const ImageThumbnail = (props) => {

    const [popup, setPopup] = useState(false)
    const [nullStr, setNullStr] = useState('')

    const width = Math.ceil(750/Math.sqrt(props.max_view))
    const height = Math.ceil(450/Math.sqrt(props.max_view)) 

    const tags_popup = popup ? [
        <FileTagPopup key={`tfpp ${props.file['name']}`} setPopup={setPopup} file={props.file}/>
    ] : [<></>]

    return (
        <>
            {tags_popup}
            <div className={`h-[${height}px] w-[${width}px] flex relative z-10`}>
                <button className={`justify-center flex flex-col z-10 rounded-lg h-full w-full bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black border-[0.5px] border-gray-400 text-left text-xs`} key={`${props.index.toString()}defg`} onClick={() => props.handleObjectClick(props.file['name'].substring(props.dataset.length))}>
                    {
                        props.waiting ? 
                        <div className='relative h-full flex justify-center'>
                            <div className="absolute animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col">
                                <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                            </div>
                            <Image  
                                className="invisible z-20"
                                src={''} 
                                width={width}
                                height={height * 0.99}
                                objectFit={'contain'}
                                alt='.'
                            />
                        </div>
                        : 
                        <Image  
                            className={props.thumbnailView ? "rounded-lg z-20": "z-20"}
                            src={props.file.thumbnail} 
                            width={width}
                            height={height * 0.99}
                            objectFit={props.thumbnailView ? 'cover' : 'contain' }
                            alt='.'
                        />
                    }
                    {
                        <button className={props.selected[props.index] ? `absolute z-20 justify-center flex flex-col rounded-lg h-full w-full bg-blue-500/30 hover:bg-blue-500/50` : `absolute z-20 justify-center flex flex-col rounded-lg h-full w-full hover:bg-white/20`} key={`${props.index.toString()}defg`} onClick={() => props.handleObjectClick(props.file['name'].substring(props.dataset.length))}>
                        </button>
                    }
                </button>
                {
                    (props.file['tags'].length > 0) ? 
                    <button key={`tags-${props.file['name']}`} className="absolute border z-30 ml-1 mt-1 w-[15px] h-[15px] bg-red-500 rounded-full hover:bg-red-700" onClick={() => setPopup(true)}>
                    </button>
                    : [<></>]
                }

                {
                    (props.selected[props.index]) ? 
                    <button key={`selected-${props.file['name']}`} className="absolute z-30 right-0 bottom-0 mr-2 mb-1 w-[20px] h-[20px] bg-white/50 border-black border hover:bg-white/30 flex flex-col justify-center" onClick={() => {
                        var arr = props.selected
                        arr.splice(props.index,1,!props.selected[props.index])
                        props.setSelected(arr)
                        props.setPointer(props.index)
                        setNullStr(nullStr.concat('x'))
                    }}>
                        <div className="flex justify-center">
                            <SquareIcon className="w-[18px] h-[18px] fill-blue-500"/>
                        </div>
                    </button>
                    :
                    <button key={`nselected-${props.file['name']}`} className="absolute z-30 right-0 bottom-0 mr-2 mb-1 w-[20px] h-[20px] bg-white/50 border-black border hover:bg-white/30" onClick={() => {
                        var arr = props.selected
                        arr.splice(props.index,1,!props.selected[props.index])
                        props.setSelected(arr)
                        setNullStr(nullStr.concat('x'))
                    }}>
                    </button>
                }
                <div className="absolute z-[50] right-2">
                    <DropdownFile setPopup={setPopup}/>
                </div>
            </div>
        </>
    )
    
}

export default ImageThumbnail;