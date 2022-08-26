import { useState, useEffect } from "react";
import FilePopup from "../../popups/FilePopup";

const FileExplorer = (props) => {
    const [view, setView] = useState(1);
    const [page, setPage] = useState(0);
    const [popup, setPopup] = useState(0)

    const query = props.state;
    const files = props.files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()) || file.last_modified.toLowerCase().includes(query.toLowerCase()));

    var max_pages: number = 0;
    var idx_min: number = 0;
    var idx_max: number = 0;

    const view_label = view ? 'Grid View' : 'List view';
    
    var container_var = []

    const handleClick = () => {
      setView(!view);
      setPage(0)  
    };


    var listofButtons  = [];

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-md p-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(Math.max(page-1,0))}>
                {'<'}
            </button>
        </div>
    )
    
    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-md px-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(0)}>
                {0}
            </button>
            <div className="p-2"> 
                ...
            </div>
        </div>
    )

    if (view) {
        const max_files: number = 8;
        max_pages =  files.length / max_files;
        idx_min = page*max_files;
        idx_max = (page+1)*max_files;
        

        for(var i = page - 5; i < page + 5; i++){
            if(i > 0 && i < (max_pages-0.0001)|0){
            const x = i
                listofButtons.push(
                    <button className=" bg-gray-200 rounded-md p-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(x)}>
                        {x | 0}
                    </button>
                )
            }
        }

        container_var.push(
            <div>
                <div className='grid  grid-rows-20 gap-1'>
                    <div className="grid grid-cols-2 gap-1">
                        <div> 
                            Filename
                        </div>
                        <div> 
                            Time of last change
                        </div>
                    </div>
                </div>
                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>

                <div className='grid grid-rows-20 gap-1'>
                    {
                        files.filter((item, index) =>  index < idx_max && index >= idx_min ).map((file) =>
                            <button className="w-full text-left" onClick={()=>setPopup(1)}>
                                <div className="dark:hover:text-black grid grid-cols-2 gap-1 text-xs py-2 px-4 justify-between w-full hover:bg-gray-300 border-b border-gray-200 dark:border-gray-600">
                                    <div className="h-5 truncate"> 
                                        {file['name'].substring(props.dataset.length)}
                                    </div>
                                    <div> 
                                        {file['last_modified']}
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
        const max_images: number = 40;
        max_pages =  files.length / max_images;
        idx_min = page*max_images;
        idx_max = (page+1)*max_images;

        for (var i = page - 5; i < page + 5; i++){
            if(i > 0 && i < max_pages-0.0001){
                const x = i
                listofButtons.push(
                    <button className=" bg-gray-200 rounded-md px-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(x)}>
                        {x | 0}
                    </button>
                )
            }
        }

        container_var.push(
            <div>
                <div className='grid grid-cols-10 grid-rows-3 gap-1'>
                    {
                        files.filter(
                            (item, index) =>  index < idx_max && index >= idx_min ).map( (file) =>
                            <button className="h-[80px] w-15 text-left text-xs" onClick={()=>setPopup(1)}>
                                <img  
                                    className="h-12 flex mx-auto"
                                    src={file['thumbnail']} 
                                    
                                    alt='.'/>
                                <div className="text-xs truncate whitespace-normal h-8">
                                    {file['name'].substring(props.dataset.length)}
                                </div>
                            </button>
                        )
                    }
                </div>
            </div>
        );
    }

    listofButtons.push(
        <div className="flex">
            <div className="p-2"> 
                ...
            </div>
            <button className=" bg-gray-200 rounded-md px-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(max_pages-0.001|0)}>
                {max_pages-0.001 | 0}
            </button>
        </div>
    )

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-md px-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(Math.min(max_pages-0.001|0,page+1|0))}>
                {'>'}
            </button>
        </div>
    )
    if (popup) {
        return (
            <div>
                <div className="flex text-xs justify-between py-3">
                    <div> 
                        Page {page | 0} of {max_pages-0.001 | 0}
                    </div>
                    <button className="px-2 py-2 w-[80px] hover:bg-gray-300 rounded-sm bg-gray-200 dark:text-black" onClick={() => setView(!view)}> 
                        {view_label} 
                    </button>
                </div>
                <div className="h-[355px]">
                    {container_var}
                </div>
                <div className="">
                    <div className="flex justify-between pt-2 pb-2 gap-2 rounded-sm">
                        {listofButtons}
                    </div>
                </div>
                <FilePopup popup={popup} setPopup={setPopup}/>
            </div>
        )
    } else {
        return (
            <div>
                <div className="flex text-xs justify-between py-3">
                    <div> 
                        Page {page | 0} of {max_pages-0.001 | 0}
                    </div>
                    <button className="px-2 py-2 w-[80px] hover:bg-gray-300 rounded-sm bg-gray-200 dark:text-black" onClick={() => setView(!view)}> 
                        {view_label} 
                    </button>
                </div>
                <div className="h-[355px]">
                    {container_var}
                </div>
                <div className="">
                    <div className="flex justify-between pt-2 pb-2 gap-2 rounded-sm">
                        {listofButtons}
                    </div>
                </div>
            </div>
        )
    }
};

export default FileExplorer;