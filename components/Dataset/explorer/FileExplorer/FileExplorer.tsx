import FilePopup from "../../popups/FilePopup";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import React from "react";

const FileExplorer = (props: { state: any; files: any[]; dataset: string | any[]; page: number; setPage: any; view: any; setView: any; len: number}) => {
    const [keyVar, setKey] = useState('');
    const [popup, setPopup] = useState(0)

    const query = props.state;
    const files = props.files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()) || file.last_modified.toLowerCase().includes(query.toLowerCase()));

    var idx_min: number = 0;
    var idx_max: number = 0;

    const view_label = props.view ? 'Grid View' : 'List view';
    
    var container_var = []

    const handleObjectClick = (key_in: String) => {
        setPopup(1)
        setKey(key_in as SetStateAction<string>)
    }

    var listofButtons  = [];

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-full w-[25px] h-[25px] shadow-sm dark: text-black hover:bg-gray-300" onClick={() => props.setPage(Math.max(props.page-1,0))}>
                {'<'}
            </button>
        </div>
    )

    const max_files: number = 11;
    const max_images: number = 9;
    const max_pages =  props.view ? props.len / max_files : props.len / max_images;

    for (var i = props.page - 5; i < props.page + 5; i++){
        if(i > 0 && i < max_pages-0.0001){
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
                            <button className="w-full text-left"  key={index.toString()}  onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                                <div className="grid grid-cols-2 gap-1 text-xs py-2 px-4 bg-white rounded-lg dark:hover:bg-gray-500 justify-between w-full hover:bg-gray-300 border-b border-gray-200 dark:border-gray-600">
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

        container_var.push(
            <div key={'fctnr2'}>
                <div className='z-0 grid grid-cols-3 w-[800px] grid-rows-3 gap-1'>
                    {
                        files.filter(
                            (item, index) =>  index < idx_max && index >= idx_min ).map( (file, index) =>
                            <button className="z-0 h-[150px] p-1 w-[260px] bg-gray-50 hover:bg-gray-100 rounded-md border-[0.5px] border-gray-400 w-15 text-left text-xs" key={index.toString()} onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                                <Image  
                                    className="z-0 h-[12] justify-self-center flex mx-auto"
                                    src={file.thumbnail} 
                                    width={260}
                                    height={120}
                                    objectFit={'contain'}
                                    alt='.'/>
                                <div className="text-xs z-10 hover:w-max truncate whitespace-normal h-[20px]">
                                    {file.name.substring(props.dataset.length)}
                                </div>
                            </button>
                        )
                    }
                </div>
            </div>
        );
    }

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-full w-[25px] h-[25px] shadow-sm dark: text-black hover:bg-gray-300" onClick={() => props.setPage(Math.min(max_pages-0.001|0,props.page+1|0))}>
                {'>'}
            </button>
        </div>
    )

    const FileComponent = popup ? [<FilePopup popup={popup} setPopup={setPopup} keyId={keyVar} key={'fcp'}/>] : [<></>]

    return (
        <div className="h-full">
            <div className="flex text-xs justify-between py-3">
                <div> 
                    Page {props.page+1 | 0} of {max_pages-0.001+1 | 0}
                </div>
                <button className="px-2 py-2 w-[80px] hover:bg-gray-300 rounded-sm bg-gray-200 dark:text-black" onClick={() => {
                    props.setView(1-props.view)
                    props.setPage(0)}}> 
                    {view_label} 
                </button>
            </div>
            <div className="h-[480px] flex justify-center">
                {container_var}
            </div>
            <div className="">
                <div className="flex justify-between pt-2 pb-2 gap-2 rounded-sm">
                    {listofButtons}
                </div>
            </div>
            {FileComponent}
        </div>
    )
};

export default FileExplorer;