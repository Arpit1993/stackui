import Image from "next/image"
import React, { useEffect, useState, useRef } from "react"

const hexToRgb = (hex: String) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

const stringToColour = (str: String) => {
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

const Box = (props) => {
    const canvasRef = useRef(null)

    var splitString = `${props.class_number}`.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    var rect = {x: props.x, y: props.y, w: props.w, h: props.h}

    var dragTL = false
    var dragBL = false 
    var dragTR = false 
    var dragBR = false

    var drag = false
    var mouseX
    var mouseY

    const color_hex = stringToColour(`${joinArray}c${props.class_number}`)
    const color = hexToRgb(color_hex)

    useEffect(() => {

        const mouseDown = (e) => {

        }

        const mouseUp = () => {

        }

        const mouseMove = (e) => {

        }

        const checkCloseEnough = (p1, p2) => {
            return Math.abs(p1 - p2) < 10;
        }

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mouseup', mouseUp, false);
        canvas.addEventListener('mousemove', mouseMove, false);

        context.lineWidth = 2;
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`
        context.fillRect(rect.x, rect.y, rect.w, rect.h)
        context.strokeStyle = color_hex
        context.strokeRect(rect.x, rect.y, rect.w, rect.h)
    }, [props, color, color_hex])

    return <canvas ref={canvasRef} {...props} width={800} height={500} />
}

const Name = (props) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.font = '12px sans-serif';
        context.fillStyle = '#ffff'
        context.fillText(props.class_number, props.x+2, props.y+12);
    }, [props])

    return <canvas ref={canvasRef} {...props} width={800} height={500} />
}


const BoundingBox = (props) => {
    return (
        <>
            <Box className='absolute' class_number={props.class_number} x={props.x} y={props.y} w={props.w} h={props.h}/>
            <Name className='absolute' class_number={props.class_number} x={props.x} y={props.y} w={props.w} h={props.h}/>
        </>
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
            <Image alt='' key="cmp1" className="z-0 w-full h-max" src={im.src} objectFit={'contain'} width={props.ww} height={props.wh} />
            {boxes.map( (box, idx) => box )}
        </>
    )
}

export default ImageViz