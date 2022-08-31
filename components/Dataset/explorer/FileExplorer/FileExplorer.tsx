import FilePopup from "../../popups/FilePopup";
import Image from "next/image";
import { SetStateAction, useState } from "react";

const FileExplorer = (props: { state: any; files: any[]; dataset: string | any[]; }) => {
    const [view, setView] = useState(1);
    const [page, setPage] = useState(0);
    const [keyVar, setKey] = useState('');
    const [popup, setPopup] = useState(0)

    const query = props.state;
    const files = props.files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()) || file.last_modified.toLowerCase().includes(query.toLowerCase()));

    var idx_min: number = 0;
    var idx_max: number = 0;

    const view_label = view ? 'Grid View' : 'List view';
    
    var container_var = []

    const handleClick = () => {
      setView(1-view);
      setPage(0)  
    };

    const handleObjectClick = (key_in: String) => {
        setPopup(1)
        setKey(key_in as SetStateAction<string>)
    }

    var listofButtons  = [];

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-full w-[25px] h-[25px] shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(Math.max(page-1,0))}>
                {'<'}
            </button>
        </div>
    )

    const max_files: number = 8;
    const max_images: number = 40;
    const max_pages =  view ? files.length / max_files : files.length / max_images;;

    for (var i = page - 5; i < page + 5; i++){
        if(i > 0 && i < max_pages-0.0001){
            const x = i
            listofButtons.push(
                <button className=" bg-gray-200 rounded-full w-[25px] h-[25px] shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(x)}>
                    {x | 0}
                </button>
            )
        }
    }

    if (view) {
        idx_min = page*max_files;
        idx_max = (page+1)*max_files;

        container_var.push(
            <div>
                <div className='grid  w-[700px] grid-rows-20 gap-1'>
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
                                <div className="grid grid-cols-2 gap-1 text-xs py-2 px-4 dark:hover:bg-gray-500 justify-between w-full hover:bg-gray-300 border-b border-gray-200 dark:border-gray-600">
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
        idx_min = page*max_images;
        idx_max = (page+1)*max_images;

        container_var.push(
            <div>
                <div className='grid grid-cols-10 w-[700px] grid-rows-3 gap-1'>
                    {
                        files.filter(
                            (item, index) =>  index < idx_max && index >= idx_min ).map( (file, index) =>
                            <button className="h-[80px] w-15 text-left text-xs" key={index.toString()} onClick={() => handleObjectClick(file['name'].substring(props.dataset.length))}>
                                <Image  
                                    className="h-12 flex mx-auto"
                                    src={file['thumbnail']} 
                                    layout="fill"
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
        <div  className="flex">
            <button className=" bg-gray-200 rounded-full w-[25px] h-[25px] shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(Math.min(max_pages-0.001|0,page+1|0))}>
                {'>'}
            </button>
        </div>
    )

    const FileComponent = popup ? [<FilePopup popup={popup} setPopup={setPopup} keyId={keyVar} key={'fcp'}/>] : [<></>]

    return (
        <div>
            <div className="flex text-xs justify-between py-3">
                <div> 
                    Page {page | 0} of {max_pages-0.001 | 0}
                </div>
                <button className="px-2 py-2 w-[80px] hover:bg-gray-300 rounded-sm bg-gray-200 dark:text-black" onClick={() => setView(1-view)}> 
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
            {FileComponent}
        </div>
    )
};

export default FileExplorer;