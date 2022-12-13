import React, { useState } from "react";

const YOLOExperiments = (props) => {
    return (
        <button onClick={()=>{props.shortcuts.current = props.experimentsPopup; props.setExperimentsPopup(!props.experimentsPopup)}} className="fixed z-[100] left-[20%] bottom-0 w-[60%] h-[80%] bg-gray-50 dark:bg-gray-900">
        </button>        
    )
}

export default YOLOExperiments;