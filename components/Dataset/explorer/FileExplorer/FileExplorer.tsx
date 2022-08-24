import { useState } from "react";

const FileExplorer = (props) => {
    const [view, setView] = useState(1);
    const [page, setPage] = useState(0);
    const files = props.files;

    if (view) {
        const max_files: number = 30;
        const max_pages: number =  files.length / max_files;
        const idx_min: number = page*max_files;
        const idx_max: number = (page+1)*max_files;
        
        var listofButtons  = []

        for(var i = page - 2; i < page + 2; i++){
            if(i >= 0 && i < max_pages){
                const x = i
                listofButtons.push(
                    <button className=" bg-gray-200 rounded-md p-2 shadow-sm" onClick={() => setPage(x)}>
                        {x}
                    </button>
                )
            }
        }

        return (
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
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>

                <div className='grid  grid-rows-20 gap-1'>
                    {
                        files.filter((item, index) =>  index < idx_max && index >= idx_min ).map(
                            (file) =>
                            <div className="grid grid-cols-2 gap-1">
                                <div> 
                                    {file['name']}
                                </div>
                                <div> 
                                    {file['last_modified']}
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="">
                    <div className="flex justify-center p-2 gap-2 rounded-sm">
                        {listofButtons}
                    </div>
                </div>
            </div>
        );
    } else {
        const max_images: number = 50;
        const max_pages: number =  files.length / max_images;
        const idx_min: number = page*max_images;
        const idx_max: number = (page+1)*max_images;
        
        var listofButtons  = []

        for(var i = page - 5; i < page + 5; i++){
            if(i >= 0 && i < max_pages){
                const x = i
                listofButtons.push(
                    <button className=" bg-gray-200 rounded-md p-2 shadow-sm" onClick={() => setPage(x)}>
                        {x}
                    </button>
                )
            }
        }

        return (
            <div>
                <div className='grid grid-cols-10 grid-rows-6 gap-1'>
                    {
                        files.filter((item, index) =>  index < idx_max && index >= idx_min ).map(
                            (file) =>
                            <a href={file['thumbnailUrl']} target="_blank" rel="noreferrer">
                                <img  
                                    className="w-20"
                                    src={file['thumbnail']} 
                                    alt='.'/>
                                <div className="text-xs overflow-clip">
                                    {file['name']}
                                </div>
                            </a>
                        )
                    }
                </div>
                <div className="">
                    <div className="flex justify-center p-2 gap-2 rounded-sm">
                        {listofButtons}
                    </div>
                </div>
            </div>
        );
    }
};

export default FileExplorer;