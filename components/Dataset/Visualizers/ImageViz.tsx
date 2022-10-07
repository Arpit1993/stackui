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

    var dragTL = false
    var dragBL = false 
    var dragTR = false 
    var dragBR = false

    var mouseX
    var mouseY

    const color_hex = stringToColour(`${joinArray}c${props.class_number}`)
    const color = hexToRgb(color_hex)

    useEffect(() => {

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const client_rect = canvas.getBoundingClientRect()
        
        const mouseDown = (e) => {
            mouseX = e.pageX - client_rect.left;
            mouseY = e.pageY - client_rect.top;

            if (checkCloseEnough(mouseX, props.rect.x) && checkCloseEnough(mouseY, props.rect.y)) {
                dragTL = true
            }
            else if (checkCloseEnough(mouseX, props.rect.x + props.rect.w) && checkCloseEnough(mouseY, props.rect.y)) {
                dragTR = true
            }
            else if (checkCloseEnough(mouseX, props.rect.x) && checkCloseEnough(mouseY, props.rect.y + props.rect.h)) {
                dragBL = true
            }
            else if (checkCloseEnough(mouseX, props.rect.x + props.rect.w) && checkCloseEnough(mouseY, props.rect.y + props.rect.h)) {
                dragBR = true
            }
        }
    
        const mouseUp = () => {
            dragTL = false 
            dragTR = false 
            dragBL = false
            dragBR = false
        }
    
        const mouseMove = (e) => {
            mouseX = e.pageX - client_rect.left;
            mouseY = e.pageY - client_rect.top;
    
            if (dragTL) {
                props.rect.w = (props.rect.x + props.rect.w - mouseX);
                props.rect.h = (props.rect.y + props.rect.h - mouseY);
                props.rect.x = mouseX;
                props.rect.y = mouseY;
            } else if (dragTR) {
                props.rect.w = (mouseX - props.rect.x);
                props.rect.h = (props.rect.y + props.rect.h - mouseY);
                props.rect.x = mouseX - props.rect.w;
                props.rect.y = mouseY;
            } else if (dragBL) {
                props.rect.w = (props.rect.x + props.rect.w - mouseX);
                props.rect.h = (mouseY - props.rect.y);
                props.rect.x = mouseX;
                props.rect.y = mouseY - props.rect.h;
            } else if (dragBR) {
                props.rect.w = (mouseX - props.rect.x);
                props.rect.h = (mouseY - props.rect.y);
                props.rect.x = mouseX - props.rect.w;
                props.rect.y = mouseY - props.rect.h;
            }

            if(dragBL || dragBR || dragTL || dragTR){
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.lineWidth = 2;
                context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`
                context.fillRect(props.rect.x, props.rect.y, props.rect.w, props.rect.h)
                context.strokeStyle = color_hex
                context.strokeRect(props.rect.x, props.rect.y, props.rect.w, props.rect.h)

                context.font = '12px sans-serif';
                context.fillStyle = '#ffff'
                context.fillText(props.class_number, props.rect.x+2, props.rect.y+12);

            }
        }
    
        const checkCloseEnough = (p1, p2) => {
            return Math.abs(p1 - p2) < 10;
        }

        window.addEventListener('mousedown', mouseDown);
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('mousemove', mouseMove);
        
        context.lineWidth = 2;
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`
        context.fillRect(props.rect.x, props.rect.y, props.rect.w, props.rect.h)
        context.strokeStyle = color_hex
        context.strokeRect(props.rect.x, props.rect.y, props.rect.w, props.rect.h)

        context.font = '12px sans-serif';
        context.fillStyle = '#ffff'
        context.fillText(props.class_number, props.rect.x+2, props.rect.y+12);

    }, [props, color, color_hex, props.rect])

    return <canvas ref={canvasRef} {...props} width={800} height={500} />
}


const BoundingBox = (props) => {

    var rect = {x: props.x, y: props.y, h: props.h, w: props.w}

    return (
        <>
            <Box className='absolute' class_number={props.class_number} rect={rect}/>
        </>
    )
}

const ImageViz = (props) => {
    
    const [labels, setLabels] = useState([])
    
    var boxes = []
    let im =  document.createElement('img');
    im.src = props.img
    const [width, setWidth] = useState(props.ww)
    const [height, setHeight] = useState(props.wh)

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

    boxes = []

    for(var i = 0; i < labels.length; i++){
        const w = labels[i][3]*width
        const h = labels[i][4]*height

        const x = (props.ww - width)/2 + labels[i][1]*width  - w/2
        const y = (props.wh - height)/2 + labels[i][2]*height - h/2

        boxes.push(<BoundingBox class_number={labels[i][0]} x={Math.floor(x)} y={Math.floor(y)} w={Math.floor(w)} h={Math.floor(h)} ox={(props.ww - width)/2} oy={(props.wh - height)/2} />);
    }

    return (
        <>
            <Image alt='' key="cmp1" className="z-0 w-full h-max" src={im.src} objectFit={'contain'} width={props.ww} height={props.wh} />
            {boxes.map( (box, idx) => box )}
        </>
    )
}

export default ImageViz