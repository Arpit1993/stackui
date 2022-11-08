import React, { useEffect, useRef, useState } from "react"
import BranchPopup from "./BranchPopup"
import posthog from 'posthog-js'
import LoadingScreen from "../../LoadingScreen"

const getbuttons = (variable, varFilter, setVarFilter, nullStr, setnullStr, n_var, name) => {
    const var_buttons : Array<any> = []

    for(var i = 0; i < variable.length; i++){
        const cl = variable.sort()[i]
        
        if(varFilter[cl]){
            var_buttons.push(
                <ul key={`abc ${cl} ${name}`} className="w-full flex px-1 mb-1 mt-1">
                    <button  onClick={async ()=>{
                        const cf = varFilter
                        cf[cl] = !cf[cl]
                        setVarFilter(cf)
                        setnullStr(nullStr+'a')
                    }} className="w-full h-6 bg-gray-200 shadow-lg rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-600 dark:border-gray-600">
                        {`${cl} (${n_var[cl]})`}
                    </button>
                </ul>
            )
        } else {
            var_buttons.push(
                <ul key={`abc ${cl} ${name}`} className="w-full flex px-1 mb-1 mt-1">
                    <button  onClick={async ()=>{
                        const cf = varFilter
                        cf[cl] = !cf[cl]
                        setVarFilter(cf)
                        setnullStr(nullStr+'a')
                    }} className="w-full h-6 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-500 dark:border-gray-600">
                        {`${cl} (${n_var[cl]})`}
                    </button>
                </ul>
            )
        }
    }

    return var_buttons
}

const YOLOFilterPopup = (props) => {

    const [branch, setBranch] = useState(false)

    const [classes, setClasses] = useState(['01','02'])
    const [n_classes, setNClasses] = useState({})
    const [classesFilter, setClassFilter] = useState({'01': false,'02': false})
    
    const [n_res, setNResolutions] = useState({})
    const [resolutions, setResolutions] = useState(['0x0','1x1'])
    const [resFilter, setResFilter] = useState({'0x0': false, '1x1': false})

    const [n_tags, setNTags] = useState({})
    const [tags, setTags] = useState(['a','b'])
    const [tagFilter, setTagFilter] = useState({'a': false, 'b': false})
    
    const [time, setTime] = useState(true)
    var repeated = false

    // weird hack to make the checkboxes bg-color change when setState, otherwise state remains the same
    // TODO
    const [nullStr, setnullStr] = useState('')

    useEffect( () => {
        const getMetadata = async () => {
            await fetch('http://localhost:8000/schema_metadata').then((res) => res.json()).then(
                (res) =>
                {
                    setClasses(res.classes)
                    setNClasses(res.n_class)
                    
                    var cFilter: any = {}
                    for(var i = 0; i < res.classes.length; i++){
                        if(classesFilter[res.classes[i]]){
                            cFilter[res.classes[i]] = true
                        } else {
                            cFilter[res.classes[i]] = false
                        }
                    }

                    setClassFilter(cFilter)

                    setResolutions(res.resolutions)
                    setNResolutions(res.n_res)
            
                    var rFilters: any = {}
                    for(var i = 0; i < res.resolutions.length; i++){
                        if(resFilter[res.resolutions[i]]){
                            rFilters[res.resolutions[i]] = true
                        } else {
                            rFilters[res.resolutions[i]] = false
                        }
                    }

                    setResFilter(rFilters)

                    setTags(res.tags)
                    setNTags(res.n_tags)

                    var tFilters: any = {}
                    for(var i = 0; i < res.tags.length; i++){
                        if(tagFilter[res.tags[i]]){
                            tFilters[res.tags[i]] = true
                        } else {
                            tFilters[res.tags[i]] = false
                        }
                    }
                    setTagFilter(tFilters)
                }
            )
        }

        getMetadata()
    }, [time])

    const toggleVariable = (toggle, filter, setFilter) => {
        var cf = filter
        for(var i = 0; i < Object.keys(cf).length; i++){
            cf[Object.keys(cf)[i]] = toggle
        }
        setFilter(cf)

        setnullStr(nullStr+'x')
    }

    const handleApplyFilter = async () => {
        props.setFiltering('y')

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

        for(var i = 0; i < Object.keys(tagFilter).length; i++){
            if (Object.values(tagFilter)[i]){
                filters[idx] =
                    {
                        'tag': Object.keys(tagFilter)[i]
                    }
                idx+=1
            }
        }

        if(props.txt.length > 0){
            filters[idx] = {
                'name': props.txt
            }
        }

        const data = JSON.stringify(filters)

        await fetch('http://localhost:8000/set_filter/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
        )

        
        posthog.capture('Applied filter', { property: 'value' })
    
        props.setFiltering('z')
        setTime(!time)
    }

    const handleResetFilter = async () => {
        await fetch('http://localhost:8000/reset_filter/')
        .then(() => props.setFiltering('w')).then(
            () =>{
                const rFilter = resFilter
                for(var i = 0; i < Object.keys(rFilter).length; i++){
                    rFilter[Object.keys(rFilter)[i]] = false
                }

                const cFilter = classesFilter
                for(var i = 0; i < Object.keys(cFilter).length; i++){
                    cFilter[Object.keys(cFilter)[i]] = false
                }

                const tFilter = tagFilter
                for(var i = 0; i < Object.keys(tFilter).length; i++){
                    tFilter[Object.keys(tFilter)[i]] = false
                }
                
                setResFilter(rFilter)
                setClassFilter(cFilter)
                setTagFilter(tFilter)
                setnullStr('')
            }
        )

        props.setFiltering('z')
        setTime(!time)
    }

    const branch_popup = branch ? [<BranchPopup key={'brpp'} setPopup={setBranch}/>] : [<></>]

    const classes_buttons : Array<any> = getbuttons(classes, classesFilter, setClassFilter, nullStr, setnullStr, n_classes,'class')
    const res_buttons : Array<any> = getbuttons(resolutions, resFilter, setResFilter, nullStr, setnullStr, n_res,'res')
    const tag_buttons : Array<any> = getbuttons(tags, tagFilter, setTagFilter, nullStr, setnullStr, n_tags,'tag')

    return (
        <>
            {branch_popup}
            <div key={"flterpp"} className="bg-whites rounded-lg dark:bg-slate-900 w-full h-[200px] border-[0.5px] border-gray-500">
                <div className="w-full justify-between flex h-[30px]">
                    <button onClick={() => props.setPopup(0)} className= 'flex justify-center rounded-tl-lg text-center w-[50px] h-[30px] flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
                </div>
                <div className="flex h-[120px] gap-2 p-2">
                    <div className="h-[120px] w-[200px] border rounded-md shadow-inner border-gray-500">
                        <div className="px-1 gap-1 flex text-xs w-[198px] h-[20px] text-center rounded-t-md dark:bg-gray-900 bg-gray-200">
                            <div>
                                Classes
                            </div>

                            <button className="underline text-blue-500" onClick={() => toggleVariable(true,classesFilter,setClassFilter)}>
                                Select All
                            </button>

                            <button className="underline text-blue-500" onClick={() => toggleVariable(false,classesFilter,setClassFilter)}>
                                Clear All
                            </button>
                        </div>
                        <div className="overflow-scroll h-[100px]">
                            {classes_buttons}
                        </div>
                    </div>

                    <div className="h-[120px] w-[200px] border rounded-md shadow-inner border-gray-500">
                        <div className="flex gap-1 text-xs px-1 w-[198px] text-center rounded-t-md dark:bg-gray-900 bg-gray-200">
                            <div>
                                Resolutions
                            </div>

                            <button className="underline text-blue-500" onClick={() => toggleVariable(true, resFilter, setResFilter)}>
                                Select All
                            </button>

                            <button className="underline text-blue-500" onClick={() => toggleVariable(false, resFilter, setResFilter)}>
                                Clear All
                            </button>
                        </div>
                        <div className="overflow-scroll h-[100px]">
                            {res_buttons}
                        </div>
                    </div>

                    <div className="h-[120px] w-[200px] border rounded-md shadow-inner border-gray-500">
                        <div className="flex gap-1 text-xs px-1 w-[198px] text-center rounded-t-md dark:bg-gray-900 bg-gray-200">
                            <div>
                                Tags
                            </div>

                            <button className="underline text-blue-500" onClick={() => toggleVariable(true, tagFilter, setTagFilter)}>
                                Select All
                            </button>

                            <button className="underline text-blue-500" onClick={() => toggleVariable(false, tagFilter, setTagFilter)}>
                                Clear All
                            </button>
                        </div>
                        <div className="overflow-scroll h-[100px]">
                            {tag_buttons}
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

export default YOLOFilterPopup