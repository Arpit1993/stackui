import Image from "next/image"
import React, { useEffect, useState, useRef } from "react"
import {
    Rectangle
} from 'draw-shape-reactjs';

const Canvas = (props) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.lineWidth = 5;
        context.strokeStyle = '#38f'
        context.strokeRect(props.x, props.y, props.w, props.h)
    }, [])

    return <canvas ref={canvasRef} {...props} width={800} height={500} />
}


const BoundingBox = (props) => {
    return (
        <Canvas className='absolute' x={props.x} y={props.y} w={props.w} h={props.h}/>
    )
}

const ImageViz = (props) => {
    
    const [labels, setLabels] = useState([])
    
    var boxes = []
    let im =  document.createElement('img');
    im.src = props.img
    const [width, setWidth] = useState(props.ww)
    var [height, setHeight] = useState(props.wh)

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
        const f = fetch('http://localhost:8000/get_yolo_labels?filename='.concat(props.keyId,'&version=current'))
        .then((response) => response.json()).then((res) => setLabels(Object.values(res)));
    }, [props.keyId])

    if(props.wh/im.height*im.width < props.ww){
        width = props.wh/im.height*im.width
        height = props.wh
    }
    else {
        width = props.ww
        height = props.ww/im.width*im.height
    }

    boxes = []
    for(var i = 0; i < labels.length; i++){
        const w = labels[i][3]*width
        const h = labels[i][4]*height

        const x = (props.ww - width)/2 + labels[i][1]*width  - w/2 + props.ox
        const y = (props.wh - height)/2 + labels[i][2]*height - h/2 + props.oy

        boxes.push(<BoundingBox class_number={labels[i][0]} x={Math.floor(x)} y={Math.floor(y)} w={Math.floor(w)} h={Math.floor(h)} />);
    }

    return (
        <>
            <Image alt='' key="cmp1" className="w-full h-max" src={im.src} objectFit={'contain'} width={props.ww} height={props.wh} />
            {boxes.map( (box, idx) => box )}
        </>
    )
}

export default ImageViz