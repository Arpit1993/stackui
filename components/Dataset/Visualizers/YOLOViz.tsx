import Image from "next/image"
import React, { useEffect, useState, useRef } from "react"
import EditIcon from '@mui/icons-material/Edit';
import BoundingBox from "./Items/BoundingBox";
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

const width_extra: number = 0
const height_extra: number = 7

const YOLOViz = (props) => {
    
    const [usableStr, setUsableStr] = useState<string>('')
    const [active, setActive] = useState<Array<any>>([])
    const [editableLabel, setEditableLabel] = useState<Array<any>>([])
    const [labels, setLabels] = useState<Array<any>>([])
    const [nullstr, setNullStr] = useState<String>('')
    const updated_labels = useRef<Array<any>>([])
    const [first, setFirst] = useState<Boolean>(true)
    const [editing, setEditing] = useState<Boolean>(false)
    const [options, setOptions] = useState<Boolean>(false)

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

    useEffect(() => {
        if(first){
            fetch(`http://localhost:8000/get_labels?filename=${props.keyId}&version=${props.label_version}`)
            .then((response) => response.json()).then((res) => {
                setLabels(Object.values(res))
                setActive(Array(Object.values(res).length).fill(true))
                setEditableLabel(Array(Object.values(res).length).fill(false))
                updated_labels.current = res
            });
            setFirst(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.keyId, props.label_version])

    if (!first){
        for(var i = 0; i < labels.length; i++){
            const w = labels[i][3]*width
            const h = labels[i][4]*height
    
            const x = (props.ww - width)/2 + labels[i][1]*width  - w/2
            const y = (props.wh - height)/2 + labels[i][2]*height - h/2
    
            var rect = {x: Math.floor(x), y: Math.floor(y), h: Math.floor(h), w: Math.floor(w)}
            boxes.push(
                <BoundingBox class_number={labels[i][0]} 
                ww={props.ww} wh={props.wh} width={width} height={height} 
                rect={rect} updated_labels={updated_labels} 
                label_idx={i} keyId={props.keyId}
                setSubmit={props.setSubmit} setnewLabels={props.setnewLabels}
                editing={editing} adding={false} setLabels={setLabels} active={active[i]}/>
            );   
        }
    }

    return (
        <div className={editing ? "w-full h-full cursor-crosshair" : "w-full h-full"}>
            <Image alt='' key="cmp1" className="z-0 absolute top-0 left-0 w-full h-max" src={im.src} objectFit={'contain'} width={props.ww+width_extra} height={props.wh+height_extra} />
            <div className="absolute top-0 left-0">
                {boxes}
            </div>
            <button onClick={()=>{
                    setOptions(!options)
                }} 
                className={editing ? "z-30 flex gap-1 absolute right-1 top-1 text-gray-900 bg-white/30 border border-gray-300 focus:outline-none hover:bg-gray-100/30 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800/30 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700/30 dark:hover:border-gray-600 dark:focus:ring-gray-700" : "z-30 flex gap-1 absolute right-1 top-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                {'Menu'}
            </button>
            <div className={options ? "z-50 absolute justify-between flex flex-col gap-1 top-14 right-1 w-1/5 h-3/4 p-1 border border-gray-500 rounded-md bg-white dark:bg-gray-900" : 'invisible'}>
                <div className="mt-2 flex justify-center w-full">
                    <button onClick={()=>{setEditing(!editing);setOptions(!options);}} className={editing ? "z-30 flex gap-1 text-gray-900 bg-gray-100 border border-gray-300 outline-none ring-4 ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:ring-gray-700" : "z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                        <EditIcon className="h-[20px] w-[20px]"/>
                        {'edit'}
                    </button>
                </div>
                <div className="relative flex flex-col h-1/2 rounded-md">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Labels</h3>
                    <div className="flex justify-center w-full overflow-scroll">
                        <ul className="w-32 h-max text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {
                                labels.map(
                                    (label, idx) =>
                                        <li key={`checkbox-${label[0]}-${idx}`} className="w-full h-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center pl-3">
                                                <input type="checkbox" checked={active[idx]} onChange={()=>{
                                                        var arr_copy = active;
                                                        arr_copy.splice(idx,1,!active[idx]);
                                                        setActive(arr_copy);
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
                                                            updated_labels.current = Object.assign({},arr_copy1)
                                                            setLabels(arr_copy1)
                                                            
                                                            var arr_copy = editableLabel
                                                            arr_copy[idx] = !arr_copy[idx]
                                                            setUsableStr('')
                                                            setEditableLabel(arr_copy)
                                                            setNullStr(nullstr.concat('ds'))
                                                        }}>
                                                            <label>
                                                                <input className="w-full text-black font-normal" type="text" value={usableStr} 
                                                                onChange={(e) => {setUsableStr(e.target.value)}} />
                                                            </label>
                                                        </form>
                                                        :
                                                        <button className="cursor-text" onClick={() => {
                                                            var arr_copy = editableLabel
                                                            arr_copy[idx] = !arr_copy[idx]
                                                            setEditableLabel(arr_copy)
                                                            setNullStr(nullstr.concat('as'))
                                                        }}>
                                                            {label[0]}
                                                        </button>   
                                                    }
                                                    <div className="flex flex-col justify-center h-full">
                                                        <button
                                                            className="h-[15px] w-[15px]"
                                                            onClick={()=>{
                                                                var arr_copy = Object.values(updated_labels.current)
                                                                arr_copy.splice(idx,1)
                                                                const idx1 = arr_copy.indexOf(props.keyId)
                                                                if (idx1 > -1){
                                                                    arr_copy.splice(idx1,1)
                                                                }
                                                                updated_labels.current = Object.assign({},arr_copy)
                                                                setLabels(arr_copy)
                                                                setNullStr(nullstr.concat('z'))
                                                                }
                                                            }>
                                                            <ClearIcon className="h-[15px] w-[15px]"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className="mt-2 flex justify-center w-full">
                    <button onClick={()=>{
                        var arr_copy: Array<any> = Object.values(updated_labels.current)
                        arr_copy.push(
                         ['new label', 0.1, 0.1, 0.1, 0.1]   
                        )
                        const idx1 = arr_copy.indexOf(props.keyId)
                        if (idx1 > -1){
                            arr_copy.splice(idx1,1)
                        }
                        updated_labels.current = Object.assign({},arr_copy)
                        setLabels(arr_copy)
                        setNullStr(nullstr.concat('z'))
                        var edit_arr = Array(arr_copy.length).fill(false)
                        edit_arr[edit_arr.length-1] = true
                        setEditableLabel(edit_arr)
                        }} className={"z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                        <AddIcon className="h-[20px] w-[20px]"/>
                        {'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default YOLOViz