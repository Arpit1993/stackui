import TopBar from "./topbar/topbar";
import FileExplorer from "./FileExplorer/FileExplorer";
import { useCallback, useState } from "react";

const Explorer = (props) => {

    const [filter, setFilter]= useState('')

    const changeFilter = useCallback(val => {
        setFilter(val);
      }, [setFilter]);

    return (
        <div className="p-2 h-full">
            <div className="shadow-md rounded-md">
                <TopBar props={props.props.dataprops} fcn={changeFilter} />
            </div>

            <div className="px-5 shadow-md rounded-md">
                <FileExplorer files={props.props.files} state={filter} dataset={props.props.dataset}/>
            </div>
        </div>
    )
}

export default Explorer;