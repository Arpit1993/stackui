import React, { useEffect, useRef, useState } from "react"
import BranchPopup from "./BranchPopup"

const FilterPopup = (props) => {

    const [branch, setBranch] = useState(false)

    const [operation, setOperation] = useState('OR')
    const [classes, setClasses] = useState(['01','02'])
    const [classesFilter, setClassFilter] = useState({'01': false,'02': false})
    const cfilter = useRef({'01': false,'02': false})
    const [resolutions, setResolutions] = useState(['0x0','1x1'])
    const [resFilter, setResFilter] = useState({'0x0': false, '1x1': false})
    const rfilter = useRef({'0x0': false, '1x1': false})
    
    useEffect( () => {
        const getMetadata = async () => {
            const res =  await fetch('http://localhost:8000/schema_metadata').then((res) => res.json()).then(
                (res) =>
                {
                    setClasses(res.classes)
                    setResolutions(res.resolutions)

                    var cFilter = {}
                    for(var i = 0; i < res.classes.length; i++){
                        cFilter[res.classes[i]] = false
                    }
            
                    var rFilters = {}
                    for(var i = 0; i < res.resolutions.length; i++){
                        rFilters[res.resolutions[i]] = false
                    }

                    cfilter.current = cFilter
                    rfilter.current = rFilters

                    setClassFilter(cFilter)
                    setResFilter(rFilters)
                }
            )
        }
        getMetadata()
    }, [])

    const handleClassChange = (cl) => {
        var cf = classesFilter
        cf[cl] = !cf[cl]
        setClassFilter(cf)
        cfilter.current = cf
    }

    const toggleClasses = (toggle) => {
        var cf = classesFilter
        for(var i = 0; i < Object.keys(cf).length; i++){
            cf[Object.keys(cf)[i]] = toggle
        }
        cfilter.current = cf
        setClassFilter(cf)
    }

    const handleResChange = (rs) => {
        var rf = resFilter
        rf[rs] = !rf[rs]
        rfilter.current = rf
        setResFilter(rf)
    }

    const toggleRes = (toggle) => {
        var rf = resFilter
        for(var i = 0; i < Object.keys(rf).length; i++){
            rf[Object.keys(rf)[i]] = toggle
        }
        rfilter.current = rf
        setResFilter(rf)
    }

    const handleApplyFilter = async () => {
        props.setFiltering(true)

        var filters = {}
        var idx = 0

        for(var i = 0; i < Object.keys(classesFilter).length; i++){
            if (Object.values(classesFilter)[i]){
                filters[idx] =
                    {
                        'class': Object.keys(classesFilter)[i]
                    }
                idx+=1
            }
        }

        for(var i = 0; i < Object.keys(resFilter).length; i++){
            if (Object.values(resFilter)[i]){
                filters[idx] =
                    {
                        'resolution': Object.keys(resFilter)[i]
                    }
                idx+=1
            }
        }

        filters['operation'] = operation

        const data = JSON.stringify(filters)

        await fetch('http://localhost:8000/set_filter/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
        )

        cfilter.current = classesFilter
        rfilter.current = resFilter
    
        props.setFiltering(false)
    }

    const handleResetFilter = () => {
        props.setFiltering(true)

        fetch('http://localhost:8000/reset_filter/')
        .then(() => props.setFiltering(false))

        var rFilter = resFilter
        for(var i = 0; i < Object.keys(rFilter).length; i++){
            rFilter[Object.keys(rFilter)[i]] = true
        }

        var cFilter = classesFilter
        for(var i = 0; i < Object.keys(cFilter).length; i++){
            cFilter[Object.keys(cFilter)[i]] = true
        }

        setResFilter(rFilter)
        rfilter.current = rFilter
        setClassFilter(cFilter)
        cfilter.current = cFilter

        props.setFiltering(false)
    }

    const branch_popup = branch ? [<BranchPopup key={'brpp'} setPopup={setBranch}/>] : [<></>]

    return (
        <>
            {branch_popup}
            <div key={"flterpp"} className="bg-white rounded-lg dark:bg-slate-700 w-full h-[200px] border-[0.5px] border-gray-500">
                <div className="w-full justify-between flex h-[30px]">
                    <button onClick={() => props.setPopup(0)} className= 'flex justify-center rounded-tl-lg text-center w-[50px] h-[30px] flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
                </div>
                <div className="flex h-[120px] gap-2 p-2">
                    <div className="h-[120px] w-[200px] border rounded-md shadow-inner border-gray-500">
                        <div className="px-1 gap-1 flex text-xs w-[198px] h-[20px] text-center rounded-t-md dark:bg-gray-500 bg-gray-200 border border-b-gray-400">
                            <div>
                                Classes
                            </div>

                            <button className="underline text-blue-500" onClick={() => toggleClasses(true)}>
                                Select All
                            </button>

                            <button className="underline text-blue-500" onClick={() => toggleClasses(false)}>
                                Clear All
                            </button>
                        </div>
                        <div className="overflow-scroll h-[100px]">
                            {
                                classes.sort().map( (cl) =>
                                    <ul key={`abc ${cl}`} className="w-full flex px-1">
                                        <input key={Math.random()} type="checkbox" checked={cfilter[cl]} onClick={()=>handleClassChange(cl)} className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            {cl}
                                        </label>
                                    </ul>
                                )
                            }
                        </div>
                    </div>


                    <div className="flex flex-col justify-center">
                            <button className="p-1 border w-[50px] border-gray-400 rounded-md font-thin hover:bg-slate-100" onClick={() => {
                                if(operation == 'OR'){
                                    setOperation('AND')
                                } else {
                                    setOperation('OR')
                                }
                            }}> {operation} </button>
                            
                    </div>

                    <div className="h-[120px] w-[200px] border rounded-md shadow-inner border-gray-500">
                        <div className="flex gap-1 text-xs px-1 w-[198px] text-center rounded-t-md dark:bg-gray-500 bg-gray-200 border border-b-gray-400">
                            <div>
                                Resolutions
                            </div>

                            <button className="underline text-blue-500" onClick={() => toggleRes(true)}>
                                Select All
                            </button>

                            <button className="underline text-blue-500" onClick={() => toggleRes(false)}>
                                Clear All
                            </button>
                        </div>
                        <div className="overflow-scroll h-[100px]">
                            {
                                resolutions.map( (cl) =>
                                    <ul key={`def ${cl}`} className="w-full flex px-1">
                                        <input key={Math.random()} type="checkbox" checked={rfilter[cl]} onClick={()=>handleResChange(cl)} className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            {cl}
                                        </label>
                                    </ul>
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className="flex justify-around">
                    <div className="px-5 py-4 justify-start">
                        <button onClick={() => setBranch(true)} className=" bg-green-700 hover:bg-green-900 rounded-md shadow-inner p-1 px-5 text-sm text-white">
                            Branch
                        </button>
                    </div>
                    <div className="px-5 py-4 flex justify-end gap-2">
                        <button onClick={() => handleResetFilter()} className="bg-gray-300 hover:bg-gray-500 rounded-md shadow-inner p-1 px-5 text-sm text-black">
                            Reset
                        </button>
                        <button onClick={() => handleApplyFilter()} className="bg-black hover:bg-gray-500 rounded-md shadow-inner p-1  px-5 text-sm text-white">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilterPopup