/* eslint-disable @next/next/no-img-element */
import Image from "next/image"
import React, { useEffect, useState, useRef, useCallback} from "react"
import EditIcon from '@mui/icons-material/Edit';
import BoundingBox from "./Items/BoundingBox";
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const YOLOViz = (props) => {
    
    const [usableStr, setUsableStr] = useState<string>('label')
    const [active, setActive] = useState<Array<any>>([])
    const [editableLabel, setEditableLabel] = useState<Array<any>>([])
    const [selectedLabel, setSelectedLabel] = useState<Array<any>>([])
    const [labels, setLabels] = useState<Array<any>>([])
    const [nullstr, setNullStr] = useState<String>('')
    const updated_labels = useRef<Array<any>>([])
    const newRef = useRef<Array<any>>([])
    const [first, setFirst] = useState<Boolean>(true)
    const [editing, setEditing] = useState<Boolean>(false)
    const [options, setOptions] = useState<Boolean>(false)
    
    const myRef = useRef<any>(null)
    const executeScroll = () => myRef.current.scrollIntoView()    

    var boxes: Array<any> = []

    let im =  document.createElement('img');
    im.src = props.img
    const [width, setWidth] = useState<number>(props.ww)
    const [height, setHeight] = useState<number>(props.wh)

    im.onload = () => {   
        if(props.wh/im.height*im.width < props.ww){
            setWidth(props.wh/im.height*im.width)
            setHeight(props.wh)
        }
        else {
            setWidth(props.ww)
            setHeight(props.ww/im.width*im.height)
        }
    }

    const addNewLabel = () => {
        var arr_copy: Array<any> = Object.values(updated_labels.current)
        arr_copy.push(
        ['label', 0, 0, 0, 0]   
        )
        const idx1 = arr_copy.indexOf(props.keyId)
        if (idx1 > -1){
            arr_copy.splice(idx1,1)
        }
        var dic_copy = Object.assign({},arr_copy)
        dic_copy['keyId'] = props.keyId
        updated_labels.current = dic_copy
        props.setnewLabels(() => {
            return updated_labels.current
        })
        props.setSubmit(true)

        newRef.current = Array(arr_copy.length).fill(false)
        newRef.current[newRef.current.length-1] = true

        setLabels(() => {return arr_copy})
        setNullStr(nullstr.concat('z'))
        var edit_arr = Array(arr_copy.length).fill(false)
        edit_arr[edit_arr.length-1] = true
        setEditableLabel(() => {return edit_arr})

        var sel_arr = Array(arr_copy.length).fill(false)
        sel_arr[sel_arr.length-1] = true
        setSelectedLabel(() => {return sel_arr})

        setEditing(true)
        executeScroll()
        var arr_copy = active;  
        arr_copy.push(true);
        setActive(() => {return arr_copy});
    }

    const deleteLabel = (idx) => {
        var arr_copy = Object.values(updated_labels.current)
        arr_copy.splice(idx,1)
        const idx1 = arr_copy.indexOf(props.keyId)
        if (idx1 > -1){
            arr_copy.splice(idx1,1)
        }
        newRef.current = Array(arr_copy.length).fill(false)
        var dic_copy = Object.assign({},arr_copy)
        dic_copy['keyId'] = props.keyId
        updated_labels.current = dic_copy
        props.setnewLabels(() => {return updated_labels.current})
        props.setSubmit(true)
        setUsableStr('label')
        setLabels(() => {
            return arr_copy
        })
        setNullStr(nullstr.concat('z'))
    }

    const handleKeyPress = useCallback((event) => {
        console.log(selectedLabel)
        if(event.ctrlKey){
            if (event.key == 'n') {
                event.preventDefault()
                addNewLabel()
                setOptions(true)
            }
            else if (event.key == 'e') {
                event.preventDefault()
                setEditing(!editing)
            }
            else if (event.key == 'd') {
                event.preventDefault()
                for(var i = 0; i < selectedLabel.length; i++){
                    if(selectedLabel[i] == true){
                        deleteLabel(i)
                    }
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setOptions, setEditing, active, addNewLabel, deleteLabel, editing, updated_labels, newRef, selectedLabel])

    useEffect(() => {
        if(first){
            fetch(`http://localhost:8000/get_labels?filename=${props.keyId}&version=${props.label_version}`)
            .then((response) => response.json()).then((res) => {
                setLabels(Object.values(res))
                setActive(()=> {return Array(Object.values(res).length).fill(true)})
                setEditableLabel(() => {return Array(Object.values(res).length).fill(false)})
                setSelectedLabel(() => {return Array(Object.values(res).length).fill(false)})
                updated_labels.current = res
                newRef.current = Array(Object.values(res).length).fill(false)
            });
            setFirst(false)
        }

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.keyId, props.label_version, handleKeyPress])

    if (!first){
        for(var i = 0; i < labels.length; i++){
            const w = labels[i][3]*width
            const h = labels[i][4]*height
    
            const x = (props.ww - width)/2 + labels[i][1]*width  - w/2
            const y = (props.wh - height)/2 + labels[i][2]*height - h/2
    
            var rect = {x: Math.floor(x), y: Math.floor(y), h: Math.floor(h), w: Math.floor(w)}
            
            boxes.push(
                <BoundingBox new={newRef} loading={props.loading} class_number={labels[i][0]} 
                ww={props.ww} wh={props.wh} width={width} height={height} 
                rect={rect} updated_labels={updated_labels} 
                label_idx={i} keyId={props.keyId} setEditing={setEditing}
                selected={selectedLabel[i]}
                setSubmit={props.setSubmit} setnewLabels={props.setnewLabels}
                editing={editing} adding={false} diff={props.diff} setLabels={setLabels} active={active[i]}/>
            );   
        }
    }

    return (
        <div className={editing ? "relative w-full h-full cursor-crosshair" : "relative  w-full h-full"}>
            <div className="relative flex justify-center w-full h-full">
                <img src={im.src} alt="." className="object-contain rounded-lg border border-gray-300 dark:border-gray-800 max-h-full w-auto align-middle"/>
                {
                    props.diff ? 
                    null
                    :
                    <>
                        <button onClick={()=>{setOptions(!options)}} 
                            className={editing ? "z-30 flex gap-1 absolute right-[-75px] top text-gray-900 bg-white/30 border border-gray-300 focus:outline-none hover:bg-gray-100/30 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800/30 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700/30 dark:hover:border-gray-600 dark:focus:ring-gray-700" : "z-30 flex gap-1 absolute right-[-75px] top text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                            <MoreHorizIcon className="w-[20px] h-[20px]"/>
                        </button>
                        
                        <div className={options ? "z-50 absolute right-[-160px] justify-between flex flex-col gap-1 top-14 w-1/5 h-3/4 p-1 border border-gray-500 rounded-md bg-white dark:bg-gray-900" : 'invisible z-50 absolute right-[-160px] justify-between flex flex-col gap-1 top-14 w-1/5 h-3/4'}>
                            <div className="mt-2 flex justify-center w-full">
                                <button onClick={()=>{setEditing(!editing);setOptions(!options);}} className={editing ? "z-30 flex gap-1 text-gray-900 bg-gray-100 border border-gray-300 outline-none ring-4 ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:ring-gray-700" : "z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                                    <EditIcon className="h-[20px] w-[20px]"/>
                                    {'edit'}
                                </button>
                            </div>
                            <div className="relative items-center flex flex-col h-1/2 rounded-md">
                                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Labels</h3>
                                <div className="flex justify-center w-32 h-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-600 dark:text-white overflow-scroll">
                                    <ul className="w-32 h-full">
                                        {
                                            labels.map(
                                                (label, idx) =>
                                                    <li key={`checkbox-labels-${idx}`} className="w-full h-max rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                                                        <div className="flex items-center h-10 pl-3">
                                                            <input type="checkbox" checked={active[idx]} onChange={()=>{
                                                                    var arr_copy = active;
                                                                    arr_copy.splice(idx,1,!active[idx]);
                                                                    setActive((arr_copy) => {return arr_copy});
                                                                    setNullStr(nullstr.concat('z'));
                                                                }
                                                            }
                                                            value="" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                                            <div className="flex justify-between mr-2 gap-1 py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                {
                                                                    editableLabel[idx] ? 
                                                                    <form onSubmit={(event)=>{
                                                                        event.preventDefault();
                                                                        var arr_copy1: Array<Array<any>> = Object.values(updated_labels.current)
                                                                        const idx1 = arr_copy1.indexOf(props.keyId)
                                                                        if (idx1 > -1){
                                                                            arr_copy1.splice(idx1,1)
                                                                        }
                                                                        arr_copy1[idx][0] = usableStr
                                                                        var dic_copy = Object.assign({},arr_copy1)
                                                                        dic_copy['keyId'] = props.keyId
                                                                        updated_labels.current = dic_copy
                                                                        props.setnewLabels(() => {return updated_labels.current})
                                                                        props.setSubmit(true)
                                                                        setLabels(arr_copy1)
                                                                        
                                                                        var arr_copy = editableLabel
                                                                        arr_copy[idx] = !arr_copy[idx]
                                                                        setEditableLabel((arr_copy) => {return arr_copy})
                                                                        setUsableStr('')
                                                                        setNullStr(nullstr.concat('as'))

                                                                        var arr_copy = selectedLabel
                                                                        arr_copy[idx] = !arr_copy[idx]
                                                                        setSelectedLabel((arr_copy) => {return arr_copy})
                                                                        setNullStr(nullstr.concat('ds'))
                                                                    }}>
                                                                        <label>
                                                                            <input className="w-full h-6 text-black font-normal border border-black" type="text" value={usableStr} 
                                                                            onChange={(e) => {
                                                                                props.setSubmit(true)
                                                                                var arr_copy1: Array<Array<any>> = Object.values(updated_labels.current)
                                                                                const idx1 = arr_copy1.indexOf(props.keyId)
                                                                                if (idx1 > -1){
                                                                                    arr_copy1.splice(idx1,1)
                                                                                }
                                                                                arr_copy1[idx][0] = e.target.value
                                                                                var dic_copy = Object.assign({},arr_copy1)
                                                                                dic_copy['keyId'] = props.keyId
                                                                                updated_labels.current = dic_copy
                                                                                props.setnewLabels(() => {return updated_labels.current})
                                                                                setLabels((arr_copy1) => {return arr_copy1})
                                                                                setUsableStr(e.target.value)
                                                                                }} />
                                                                        </label>
                                                                    </form>
                                                                    :
                                                                    <button className="cursor-text" onClick={() => {
                                                                        var arr_copy = editableLabel
                                                                        arr_copy[idx] = !arr_copy[idx]
                                                                        setEditableLabel((arr_copy) => {return arr_copy})
                                                                        setNullStr(nullstr.concat('as'))
                                                                        var arr_copy1 = selectedLabel
                                                                        arr_copy1[idx] = !arr_copy1[idx]
                                                                        setSelectedLabel((arr_copy1) => {return arr_copy1})
                                                                        setNullStr(nullstr.concat('as'))
                                                                        setUsableStr(label[0])
                                                                    }}>
                                                                        {label[0]}
                                                                    </button>   
                                                                }
                                                                <div className="flex flex-col justify-center h-full">
                                                                    <button
                                                                        className="h-4 w-[15px]"
                                                                        onClick={()=>{deleteLabel(idx)}}>
                                                                        <ClearIcon className="h-4 w-[15px]"/>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                            )
                                        }
                                        <div ref={myRef} className='mt-10'></div>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-center w-full">
                                <button onClick={addNewLabel} className={"z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                                    <AddIcon className="h-[20px] w-[20px]"/>
                                    {'Add'}
                                </button>
                            </div>
                        </div>
                    </>
                }
            </div>
            <div className="absolute top-0 left-0">
                {boxes}
            </div>
        </div>
    )
}
  export default YOLOViz