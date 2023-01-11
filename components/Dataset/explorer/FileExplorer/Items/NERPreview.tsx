import React, { useEffect, useState } from "react"
import DropdownFile from "./DropdownFile"
import FileTagPopup from "../Popups/FileTagPopup"
import { Tooltip } from "@mui/material"
import { useRef } from "react"
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { color } from "@mui/system"

const stringToColour = (str: string) => {
    var hash = 0;

    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }

    return colour;
}

const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {
        r: 1,
        g: 1,
        b: 1
      };
}

function get_tex_size(txt, font) {
    const element: any = document.createElement('canvas');
    const context = element.getContext("2d");
    context.font = font;
    return {'width': context.measureText(txt).width, 'height':parseInt(context.font)};
}

const Entity = (props) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas: any = canvasRef.current
        const context =  canvas.getContext('2d')
        const color_hex = stringToColour(props.entity['type'])
        const color = hexToRgb(color_hex)


        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 0.2;
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`
        context.font = '12px sans-serif';
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.strokeStyle = color_hex
        context.strokeRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = '#000000';
        context.fillText(props.entity['type'], 2, canvas.height-4);
    },[props.entity])

    return (
        <div className="z-20">
            <canvas key={`boxx${props.class_number}${props.label_idx}`} ref={canvasRef} {...props} width={get_tex_size(props.entity['type'],'12px sans-serif').width+4} height={get_tex_size(props.entity['type'],'12px sans-serif').height+4} /> 
        </div>
    )
}

const NERPreview = (props) => {

    const [labels, setLabels] = useState<any>([])
    const [hover, setHover] = useState<Boolean>(false)
    const [popup, setPopup] = useState<Boolean>(false)
    const [nullStr, setNullStr] = useState<string>('')


    const width: number = Math.ceil(750/Math.sqrt(props.max_view))
    const height: number = Math.ceil(450/Math.sqrt(props.max_view)) 

    var anomaly: Boolean = false
    var msg: string = ''    

    for(var i = 0; i < props.file['tags'].length; i++){
        if (props.file['tags'][i].includes('anomaly:')){
            anomaly = true
            msg = props.file['tags'][i].replace('anomaly: ','')
        }
    }

    useEffect(() => {
        fetch(`http://localhost:8000/get_labels?filename=${props.file['name']}`)
        .then((res) => res.json())
        .then((res) => {
            var str_array = [];
            for(var i = 0; i < res.length; i++){
                const entity = res[i]['type']
                
                str_array.push(
                    <Entity entity={res[i]}/>
                )
            }

            setLabels(() => {
                return str_array
            });
        })
    },[props.file])

    return (
        <div onMouseEnter={()=>{setHover(true)}} onMouseLeave={()=>{setHover(false)}} className={`relative h-[${height}px] w-[${width}px]`}>
            {
                popup ? 
                    <FileTagPopup shortcuts={props.shortcuts} key={`tfpp ${props.file['name']}`} setPopup={setPopup} file={props.file}/>
                 : <></>
            }
            <div className="absolute z-auto right-2">
                <DropdownFile hover={hover} selected={props.selected[props.index]} shortcuts={props.shortcuts} setTagsPopup={props.setTagsPopup} setPopup={setPopup}/>
            </div>
            {
                (props.file['tags'].length > 0) ? 
                <Tooltip title={`${msg}`} placement="right">
                    {
                        anomaly ?
                        <button key={`tags-${props.file['name']}`} className="absolute mt-1 ml-1 z-20" onClick={() => setPopup(true)}>
                            <ErrorOutlineIcon className="w-1/10 h-1/10 shadow-sm fill-white rounded-full overflow-hidden bg-red-500 hover:bg-red-700"/>
                        </button>
                        :
                        <button key={`tags-${props.file['name']}`} className="absolute border z-20 ml-1 mt-1 w-[15px] h-4 bg-red-500 rounded-full hover:bg-red-700" onClick={() => setPopup(true)}>
                        </button>      
                    }
                </Tooltip>
                
                : <></>
            }
            {
                (props.selected[props.index]) ? 
                <button key={`selected-${props.file['name']}`} className="absolute z-20 right-0 bottom-0 mr-2 mb-1 w-[20px] h-[20px] bg-white/50 border-black border hover:bg-white/30 flex justify-center items-center" onClick={() => {
                    var arr = props.selected
                    arr.splice(props.index,1,!props.selected[props.index])
                    props.setSelected(arr)
                    props.setPointer(props.index)
                    setNullStr(nullStr.concat('x'))
                }}>
                    <div className="flex w-[20px] h-[20px] items-center justify-center">
                        <div className="bg-blue-500 w-[15px] h-4"></div>
                    </div>
                </button>
                :
                <button key={`nselected-${props.file['name']}`} className={!hover ? "invisible absolute z-20 right-0 bottom-0 mr-2 mb-1 w-[20px] h-[20px]" :"absolute z-20 right-0 bottom-0 mr-2 mb-1 w-[20px] h-[20px] bg-white/50 border-black border hover:bg-white/30"} onClick={() => {
                    var arr = props.selected
                    if(props.selected.length > 0){
                        arr.splice(props.index,1,!props.selected[props.index])
                        props.setSelected(arr)
                        props.setPointer(props.index)
                        setNullStr(nullStr.concat('x'))
                    }
                }}>
                </button>
            }
            <div className={`w-full h-full flex z-10`}>
                <button className={`justify-center flex flex-col z-10 rounded-lg h-full w-full bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black border-[0.5px] border-gray-400 text-left text-xs`} key={`${props.index.toString()}defg`} onClick={() => props.handleObjectClick(props.file['name'])}>
                    {
                        <button className={props.selected[props.index] ? `absolute z-[21] justify-center flex flex-col rounded-lg h-full w-full bg-blue-500/30 hover:bg-blue-500/50` : `absolute  z-[21] justify-center flex flex-col rounded-lg h-full w-full hover:bg-white/20`} key={`${props.index.toString()}defg2`} onClick={() => props.handleObjectClick(props.file['name'])}>
                        </button>
                    }
                    <button className="w-full text-left"  key={`${props.index.toString()}abc`}  onClick={() => props.handleObjectClick(props.file['name'])}>
                        <div className="grid grid-cols-2 gap-1 text-xs py-2 px-4 rounded-lg justify-between w-full">
                            <div className="h-5 flex gap-2"> 
                                {props.file['name']}
                                {' | '}
                                {
                                    labels
                                }
                            </div>
                            <div> 
                                {new Date(props.file['last_modified'].concat(' GMT')).toLocaleString()}
                            </div>
                        </div>
                    </button>
                </button>
            </div>
        </div>
    )
    
}

export default NERPreview;