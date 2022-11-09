import FilePopup from "../../popups/FilePopup";
import Image from "next/image";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import ImageThumbnail from "./Items/ImageThumbnail";
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


    const max_files: number = 10;
    const max_images: number = props.max_view;
    const max_pages =  props.view ? props.len / max_files : props.len / max_images;
    var listofButtons: Array<any> = [];

    listofButtons.push(
        <div  className="flex">
            <button className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(Math.max(props.page-1,0))}>
                {'Previous'}
            </button>
        </div>
    )

    for (var i = props.page - 5; i < props.page + 5; i++){
        if(i > 0 && i < max_pages+1-0.0001){
            const x = i
            listofButtons.push(
                <button className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(x-1)}>
                    {x | 0}
                </button>
            )
        }
    }

    listofButtons.push(
        <div  className="flex">
            <button className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => props.setPage(Math.min(max_pages-0.001|0,props.page+1|0))}>
                {'Next'}
            </button>
        </div>
    )

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
            <div key={'mmindiv'} className="w-[100px] h-min flex">
                <button className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" onClick={() => {
                    props.setMaxView(Math.min(Math.pow((Math.sqrt(props.max_view)+1),2),36))
                    props.setPage(0)}}> 
                    - 
                </button>
                <button className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" onClick={() => {
                    props.setMaxView(Math.max(Math.pow((Math.sqrt(props.max_view)-1),2),9))
                    props.setPage(0)}}> 
                    +
                </button>
            </div>
        ]

        var class_var = ''

        switch (props.max_view) {
            case(36):
                class_var = `grid grid-cols-6 w-full auto-rows-auto gap-1`
                break
            case(25):
                class_var = `grid grid-cols-5 w-full auto-rows-auto gap-1`
                break
            case(16):
                class_var = `grid grid-cols-4 w-full auto-rows-auto gap-1`
                break
            default:
                class_var = `grid grid-cols-3 w-full auto-rows-auto gap-1`
                idx_max = 9
                props.setMaxView(9)
                break
        }

        container_var.push(
            <div key={'fctnr2'}>
                <div className={class_var}>
                    {
                        files.filter((data, idx) => idx < idx_max ).map( (file, index) =>
                            <ImageThumbnail key={`thumb-${file.filename}`} dataset={props.dataset} max_view={props.max_view} file={file} index={index} waiting={props.waiting} handleObjectClick={handleObjectClick}/>
                        )
                    }
                </div>
            </div>
        );
    }

    const FileComponent = popup ? [<FilePopup schema={props.schema} popup={popup} setPopup={setPopup} keyId={keyVar} key={'fcp'}/>] : [<></>]

    const handleKeyPress = useCallback((event) => {
        if (event.key == 'ArrowLeft') {
            props.setPage(Math.max(props.page-1,0))
        } else if (event.key == 'ArrowRight'){
            props.setPage(Math.min(max_pages-0.001|0,props.page+1|0))
        }

        if (event.shiftKey && event.key == '_'){
            props.setMaxView(Math.min(Math.pow((Math.sqrt(props.max_view)+1),2),36))
            props.setPage(0)
        } else if (event.shiftKey && event.key == '+'){
            props.setMaxView(Math.max(Math.pow((Math.sqrt(props.max_view)-1),2),9))
            props.setPage(0)
        }

    }, [props.page, props.view, props.max_view])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        }
    },[props.page, props.view, props.max_view])

    return (
        <div className="h-full">
            <div className="flex text-xs justify-between">
                <div> 
                    Page {props.page+1 | 0} of {max_pages-0.001+1 | 0}
                </div>
                
                {max_min_div}
                
                <button className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={() => {
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
                <div className="flex justify-left text-xs mt-2 mb-2 rounded-sm">
                    {listofButtons}
                </div>
            </div>
            {FileComponent}
        </div>
    )
};

export default FileExplorer;