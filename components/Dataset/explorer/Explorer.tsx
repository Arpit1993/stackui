import TopBar from "./topbar/topbar";
import FileExplorer from "./FileExplorer/FileExplorer";
import { SetStateAction, useCallback, useState } from "react";
import React from "react";

const Explorer = (props: { props: { dataprops: any; files: any; dataset: any}; page: number; setPage: any; view: any; setView: any; len: number; waiting: any; setFiltering: any}) => {

    const [filter, setFilter]= useState('')
    const changeFilter = useCallback((val: String) => {
        setFilter(val as SetStateAction<string>);
      }, [setFilter]);

    return (
        <div className="p-2 mt-2 mr-2 h-full bg-gray-50 dark:bg-gray-600 rounded-xl ">
            <div>
                <TopBar props={props.props.dataprops} fcn={changeFilter} setFiltering={props.setFiltering} />
            </div>

            <div className="px-5 h-full">
                <FileExplorer setF waiting={props.waiting} files={props.props.files} state={filter} dataset={props.props.dataset} page={props.page} setPage={props.setPage} view={props.view} setView={props.setView} len={props.len}/>
            </div>
        </div>
    )
}

export default Explorer;