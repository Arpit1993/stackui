import TopBar from "./topbar/topbar";
import FileExplorer from "./FileExplorer/FileExplorer";
import NERExplorer from "./FileExplorer/NERExplorer";
import React, { useState } from "react";
import GenerateDataPopup from "../popups/GenerateDataPopup";

const Explorer = (props) => {
    const [explore, setExplore]= useState<Boolean>(true)

    return (
        <div className="p-2 mt-2 mr-2 h-full bg-gray-50 dark:bg-gray-900 rounded-xl">
            <div className="h-[20%]">
                <TopBar shortcuts={props.shortcuts} props={props.props.dataprops} setFiltering={props.setFiltering} schema={props.schema} setPage={props.setPage} filtering={props.filtering}/>
            </div>

            <div className="px-5 h-[80%]">
                {
                    props.schema.includes('ner') ? 
                    <NERExplorer shortcuts={props.shortcuts} schema={props.schema} max_view={props.max_view} setFiltering={props.setFiltering} setMaxView={props.setMaxView} waiting={props.waiting} files={props.props.files} dataset={props.props.dataset} page={props.page} setPage={props.setPage} view={props.view} setView={props.setView} len={props.len}/>
                    :
                    <FileExplorer shortcuts={props.shortcuts} schema={props.schema} max_view={props.max_view} setFiltering={props.setFiltering} setMaxView={props.setMaxView} waiting={props.waiting} files={props.props.files} dataset={props.props.dataset} page={props.page} setPage={props.setPage} view={props.view} setView={props.setView} len={props.len}/>
                }
            </div>
        </div>
    )
}

export default Explorer;