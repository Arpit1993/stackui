import React, { useState, useEffect } from "react";
import Curve from "./Items/Curve";


const Experiments = (props) => {
    const [projects, setProjects] = useState<any>([])
    const [popup, setPopup] = useState<Boolean>(false)
    const [project, setProject] = useState<String>('')

    useEffect(()=>{
        fetch('http://localhost:8000/get_projects').then((res) => res.json()).then((res) => {setProjects(res)})
    },[])

    return (
        <>
            {
                popup ? 
                <Project project={project} setPopup={setPopup}/>
                : null   
            }
            <div className="fixed overflow-scroll z-[40] left-0 bottom-0 w-[80%] h-[77%] bg-white dark:bg-black">
                {
                    (Object.keys(projects).length == 0) ?
                    <div className="w-full h-full font-normal flex justify-center items-center"> 
                        {'No experiments yet'}
                    </div>
                    :
                    <div className="p-2 grid grid-cols-2 justify-items-center gap-2 w-full h-full">
                        {
                            Object.keys(projects).map(
                            (proj) =>  
                            {
                                return <button key={`proj_comp ${proj}`}
                                    onClick={() => {
                                        setProject(proj);
                                        setPopup(true)
                                    }}
                                    className="block items-start flex-col w-full h-44 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                    <div className="mb-2 text-2xl w-full font-bold tracking-tight text-gray-900 dark:text-white">
                                        {proj}
                                    </div>    
                                    <div className="w-full flex justify-start font-normal text-gray-700 dark:text-gray-400">
                                        {`Number of runs: ${projects[proj].runs.length}`}
                                    </div>    
                                    <div className="w-full flex justify-start  font-normal text-gray-700 dark:text-gray-400">
                                        {`Number of models: ${projects[proj].models.length}`}
                                    </div>
                                    <div className="justify-start bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                        <svg aria-hidden="true" className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                                        {`${projects[proj]['date created']}`}
                                    </div>          
                                </button>
                            })
                        }
                    </div>
                }
            </div>  
        </>      
    )
}

const Project = (props) => {
    const [runs, setRuns]= useState<any>([])
    
    useEffect(()=>{
        fetch(`http://localhost:8000/get_logs_list?project=${props.project}`).then((res) => res.json()).then((res) => {setRuns(res.reverse()); console.log(res)})
    },[props.project])

    return (
        <div className="fixed overflow-scroll z-[50] p-4 left-0 bottom-0 w-[80%] h-[77%] bg-white dark:bg-black">
            <div className="w-full flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Experiments
                </h3>
                <button onClick={() => {props.setPopup(false)}} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <div className="z-[46] p-2 grid grid-cols-1 justify-items-center gap-2 w-full h-full">
                {
                    (runs.length > 0) ?
                    runs.map(
                        (run) => {
                            return <div key={`run from ${run['date']}`} className="z-[100] block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                <div className="justify-start bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                    <svg aria-hidden="true" className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                                    {`${run['date']}`}
                                </div>
                                <Curve date={run['date']} logs={run['logs']}/>
                            </div>
                        }
                    )
                    :
                    'No runs yet'
                }
            </div>
        </div>
    )
}

export default Experiments;