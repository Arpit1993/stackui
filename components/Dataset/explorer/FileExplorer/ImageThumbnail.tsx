import React, { useEffect, useState } from "react"
import Image from "next/image"

const addTag = (filename, tag, nullStr, setnullStr) => {
    fetch(`http://localhost:8000/add_tag?key=${filename}&tag=${tag}`)
    setnullStr(nullStr.concat('a'))
}

const removeTag = (filename, tag, nullStr, setnullStr) => {
    fetch(`http://localhost:8000/remove_tag?key=${filename}&tag=${tag}`)
    setnullStr(nullStr.concat('b'))
}

const ImageThumbnail = (props: {filename: string; waiting: boolean; thumbnail: any; max_view: number}) => {

    const [nullStr, setnullStr] = useState('')
    const [tags, setTags] = useState([])

    useEffect(() => {
        fetch(`http://localhost:8000/get_tags?key=${props.filename}`)
        .then((res) => res.json())
        .then(setTags)
    }, [nullStr])

    if (props.max_view == 36){
        return (
            <button className="h-[75px] w-[130px] bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black rounded-md border-[0.5px] border-gray-400 text-left text-xs" key={`${index.toString()}defg`} onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                <Image  
                    className="justify-self-center flex"
                    src={ props.waiting ? '/Icons/load_icon.png' : props.thumbnail} 
                    width={260}
                    height={props.waiting ? 40 : 145}
                    objectFit={'contain'}
                    alt='.'/>
            </button>
        )
    } else if (props.max_view == 25){
        return (
            <button className="h-[90px] w-[155px] bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black rounded-md border-[0.5px] border-gray-400 text-left text-xs" key={`${index.toString()}defg`} onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                <Image  
                    className="justify-self-center flex"
                    src={ props.waiting ? '/Icons/load_icon.png' : props.thumbnail} 
                    width={260}
                    height={props.waiting ? 40 : 145}
                    objectFit={'contain'}
                    alt='.'/>
            </button>
        )
    } else if (props.max_view == 16){
        return (
            <button className="h-[110px] w-[180px] bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black rounded-md border-[0.5px] border-gray-400 text-left text-xs" key={`${index.toString()}defg`} onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                <Image  
                    className="justify-self-center flex"
                    src={ props.waiting ? '/Icons/load_icon.png' : props.thumbnail} 
                    width={260}
                    height={props.waiting ? 40 : 145}
                    objectFit={'contain'}
                    alt='.'/>
            </button>
        )
    }
    
    return (
        <button className="h-[150px] w-[260px] bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black rounded-md border-[0.5px] border-gray-400 text-left text-xs" key={`${index.toString()}defg`} onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
            <Image  
                className="justify-self-center flex"
                src={ props.waiting ? '/Icons/load_icon.png' : props.thumbnail} 
                width={260}
                height={props.waiting ? 40 : 145}
                objectFit={'contain'}
                alt='.'/>
        </button>
    )
    
}

export default ImageThumbnail;