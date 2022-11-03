import FilePopup from "../../popups/FilePopup";
import Image from "next/image";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import ImageThumbnail from "./ImageThumbnail";
import React from "react";

const FileExplorer = (props: { schema: String; files: any[]; dataset: string | any[]; page: number; setPage: any; view: any; setView: any; len: number; waiting: any; max_view: any; setMaxView: any}) => {
    const [keyVar, setKey] = useState('');
    const [popup, setPopup] = useState(0)
    
    const files = props.files;

    var idx_min: number = 0;
    var idx_max: number = 0;

    const view_label = props.view ? 'Grid View' : 'List view';
    
    var container_var: Array<any> = []
    var max_min_div: Array<any> = []

    const handleObjectClick = (key_in: String) => {
        setPopup(1)
        setKey(key_in as SetStateAction<string>)
    }

    var listofButtons: Array<any> = [];

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-full w-[25px] h-[25px] shadow-sm dark: text-black hover:bg-gray-300" onClick={() => props.setPage(Math.max(props.page-1,0))}>
                {'<'}
            </button>
        </div>
    )

    const max_files: number = 10;
    const max_images: number = props.max_view;
    const max_pages =  props.view ? props.len / max_files : props.len / max_images;

    for (var i = props.page - 5; i < props.page + 5; i++){
        if(i > 0 && i < max_pages+1-0.0001){
            const x = i
            listofButtons.push(
                <button className=" bg-gray-200 rounded-full w-[25px] h-[25px] shadow-sm dark: text-black hover:bg-gray-300" onClick={() => props.setPage(x-1)}>
                    {x | 0}
                </button>
            )
        }
    }

    if (props.view) {
        idx_min = 0;
        idx_max = max_files;

        max_min_div = []

        container_var.push(
            <div key={'fctnr1'}>
                <div className='grid  w-[800px] grid-rows-20 gap-1'>
                    <div className="grid grid-cols-2 gap-1">
                        <div> 
                            Filename
                        </div>
                        <div> 
                            Time of last change
                        </div>
                    </div>

                    <div className="flex py-1">
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                </div>

                <div className='grid grid-rows-20 gap-1'>
                    {
                        files.filter((item, index) =>  index < idx_max && index >= idx_min ).map((file,index) =>
                            <button className="w-full text-left"  key={`${index.toString()}abc`}  onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                                <div className="grid grid-cols-2 gap-1 text-xs py-2 px-4 bg-white dark:bg-gray-800 rounded-lg dark:hover:bg-black justify-between w-full hover:bg-gray-300 border-b border-gray-200 dark:border-gray-600">
                                    <div className="h-5 truncate"> 
                                        {file['name'].substring(props.dataset.length)}
                                    </div>
                                    <div> 
                                        {new Date(file['last_modified'].concat(' GMT')).toString()}
                                    </div>
                                </div>
                            </button>
                        )
                    }
                </div>
            </div>
        );
    } 
    else {
        idx_min = 0;
        idx_max = max_images;

        max_min_div = [
            <div key={'mmindiv'} className="w-[100px] flex gap-2">
                <button className="px-2 py-2 w-[40px] hover:bg-gray-300 rounded-sm bg-gray-200 dark:text-black" onClick={() => {
                    props.setMaxView(Math.min(Math.pow((Math.sqrt(props.max_view)+1),2),36))
                    props.setPage(0)}}> 
                    - 
                </button>
                <button className="px-2 py-2 w-[40px] hover:bg-gray-300 rounded-sm bg-gray-200 dark:text-black" onClick={() => {
                    props.setMaxView(Math.max(Math.pow((Math.sqrt(props.max_view)-1),2),9))
                    props.setPage(0)}}> 
                    +
                </button>
            </div>
        ]

        if(props.max_view == 36){
            container_var.push(
                <div key={'fctnr2'}>
                    <div className='grid grid-cols-6 w-[800px] grid-rows-6 gap-1'>
                        {
                            files.filter((data, idx) => idx < idx_max ).map( (file, index) =>
                                <button className="h-[75px] w-[130px] bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black rounded-md border-[0.5px] border-gray-400 text-left text-xs" key={`${index.toString()}defg`} onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                                    <Image  
                                        className="justify-self-center flex"
                                        src={ props.waiting ? '/Icons/load_icon.png' : file.thumbnail} 
                                        width={260}
                                        height={props.waiting ? 40 : 145}
                                        objectFit={'contain'}
                                        alt='.'/>
                                </button>
                                // <ImageThumbnail key={`thumb-${file.filename}`} filename={file.filename} thumbnail={file.thumbnail} max_view={props.max_view} waiting={props.waiting} />
                            )
                        }
                    </div>
                </div>
            );   
        } else if(props.max_view == 25){
            container_var.push(
                <div key={'fctnr2'}>
                    <div className='grid grid-cols-5 w-[800px] grid-rows-5 gap-1'>
                        {
                            files.filter((data, idx) => idx < idx_max ).map( (file, index) =>
                                <button className="h-[90px] w-[155px] bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black rounded-md border-[0.5px] border-gray-400 text-left text-xs" key={`${index.toString()}defg`} onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                                    <Image  
                                        className="justify-self-center flex"
                                        src={ props.waiting ? '/Icons/load_icon.png' : file.thumbnail} 
                                        width={260}
                                        height={props.waiting ? 40 : 145}
                                        objectFit={'contain'}
                                        alt='.'/>
                                </button>
                                // <ImageThumbnail key={`thumb-${file.filename}`} filename={file.filename} thumbnail={file.thumbnail} max_view={props.max_view} waiting={props.waiting} />
                            )
                        }
                    </div>
                </div>
            );   
        } else if(props.max_view == 16){
            container_var.push(
                <div key={'fctnr2'}>
                    <div className='grid grid-cols-4 w-[800px] grid-rows-4 gap-1'>
                        {
                            files.filter((data, idx) => idx < idx_max ).map( (file, index) =>
                                <button className="h-[110px] w-[180px] bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black rounded-md border-[0.5px] border-gray-400 text-left text-xs" key={`${index.toString()}defg`} onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                                    <Image  
                                        className="justify-self-center flex"
                                        src={ props.waiting ? '/Icons/load_icon.png' : file.thumbnail} 
                                        width={260}
                                        height={props.waiting ? 40 : 145}
                                        objectFit={'contain'}
                                        alt='.'/>
                                </button>
                                // <ImageThumbnail key={`thumb-${file.filename}`} filename={file.filename} thumbnail={file.thumbnail} max_view={props.max_view} waiting={props.waiting} />
                            )
                        }
                    </div>
                </div>
            );   
        } else {
            props.setMaxView(9)
            container_var.push(
                <div key={'fctnr2'}>
                    <div className='grid grid-cols-3 w-[800px] grid-rows-3 gap-1'>
                        {
                            files.filter((data, idx) => idx < idx_max ).map( (file, index) =>
                                <button className="h-[150px] w-[260px] bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black rounded-md border-[0.5px] border-gray-400 text-left text-xs" key={`${index.toString()}defg`} onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                                    <Image  
                                        className="justify-self-center flex"
                                        src={ props.waiting ? '/Icons/load_icon.png' : file.thumbnail} 
                                        width={260}
                                        height={props.waiting ? 40 : 145}
                                        objectFit={'contain'}
                                        alt='.'/>
                                </button>
                                // <ImageThumbnail key={`thumb-${file.filename}`} filename={file.filename} thumbnail={file.thumbnail} max_view={props.max_view} waiting={props.waiting} />
                            )
                        }
                    </div>
                </div>
            );   
        }
    }

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-full w-[25px] h-[25px] shadow-sm dark: text-black hover:bg-gray-300" onClick={() => props.setPage(Math.min(max_pages-0.001|0,props.page+1|0))}>
                {'>'}
            </button>
        </div>
    )

    const FileComponent = popup ? [<FilePopup schema={props.schema} popup={popup} setPopup={setPopup} keyId={keyVar} key={'fcp'}/>] : [<></>]

    var pressed_s: Array<number> = [0, 0]

    const handleKeyPress = useCallback((event) => {
        if (event.key == 'ArrowLeft') {
            props.setPage(Math.max(props.page-1,0))
            pressed_s[0] = pressed_s[0] + 1
        } else if (event.key == 'ArrowRight'){
            props.setPage(Math.min(max_pages-0.001|0,props.page+1|0))
            pressed_s[1] = pressed_s[1] + 1
        } else if (event.key == 'Shift') {
            pressed_s[0] = pressed_s[0] + 1
            pressed_s[1] = pressed_s[1] + 1
        }

        if (pressed_s[0]==2){
            console.log('gs0')
        }
        if (pressed_s[1]==2){
            console.log('gs1')
        }

    }, [props.page, props.view])

    const handleKeyRelease = useCallback((event) => {
        if (event.key == 'ArrowLeft') {
            pressed_s[0] = pressed_s[0] - 1
        } else if (event.key == 'ArrowRight'){
            pressed_s[1] = pressed_s[1] - 1
        } else if (event.key == 'Shift') {
            pressed_s[0] = pressed_s[0] - 1
            pressed_s[1] = pressed_s[1] - 1
        }
    }, [props.page, props.view])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('keyup', handleKeyRelease);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            document.removeEventListener('keyup', handleKeyRelease);
        }
    },[props.page, props.view])

    return (
        <div className="h-full">
            <div className="flex text-xs justify-between py-3">
                <div> 
                    Page {props.page+1 | 0} of {max_pages-0.001+1 | 0}
                </div>
                
                {max_min_div}
                
                <button className="px-2 py-2 w-[80px] hover:bg-gray-300 rounded-sm bg-gray-200 dark:text-black" onClick={() => {
                    if(props.view == 1) {
                        props.setMaxView(36)
                    } else {
                        props.setMaxView(10)
                    }
                    props.setView(1-props.view)
                    props.setPage(0)}}> 
                    {view_label} 
                </button>
            </div>
            <div className="h-[480px] flex justify-center">
                {container_var}
            </div>
            <div className="">
                <div className="flex justify-left pt-2 pb-2 gap-2 rounded-sm">
                    {listofButtons}
                </div>
            </div>
            {FileComponent}
        </div>
    )
};

export default FileExplorer;