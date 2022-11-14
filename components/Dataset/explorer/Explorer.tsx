import TopBar from "./topbar/topbar";
import FileExplorer from "./FileExplorer/FileExplorer";
import { SetStateAction, useCallback, useState } from "react";
import React from "react";

const Explorer = (props) => {
    return (
        <div className="p-2 mt-2 mr-2 h-full bg-gray-50 dark:bg-gray-900 rounded-xl">
            <div>
                <TopBar props={props.props.dataprops} setFiltering={props.setFiltering} schema={props.schema} />
            </div>

            <div className="px-5 h-full">
                <FileExplorer schema={props.schema} max_view={props.max_view} setFiltering={props.setFiltering} setMaxView={props.setMaxView} waiting={props.waiting} files={props.props.files} dataset={props.props.dataset} page={props.page} setPage={props.setPage} view={props.view} setView={props.setView} len={props.len}/>
            </div>
        </div>
    )
}

export default Explorer;