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

const BoundingBox = (props) => {
    
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

                const new_label = {
                    "0": props.class_number,
                    "1": (props.rect.x + props.rect.w/2 - (props.ww - props.width )/2)/props.width,
                    "2": (props.rect.y + props.rect.h/2 - (props.wh - props.height)/2)/props.height,
                    "3": props.rect.w/props.width,
                    "4": props.rect.h/props.height
                }

                var new_labels = props.updated_labels.current
                new_labels[props.label_idx] = new_label
                new_labels['keyId'] = props.keyId
                props.updated_labels.current = new_labels

                props.setSubmit(1)
                props.setnewLabels(props.updated_labels.current)
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
        context.fillStyle = '#ffff';
        context.fillText(props.class_number, props.rect.x+2, props.rect.y+12);

    }, [color, color_hex, props.rect])

    const box = [<canvas key={`boxx${props.class_number}${props.label_idx}`} ref={canvasRef} {...props} width={800} height={500} />]
    
    return(
        <div className="absolute">
            {box}
        </div>
    )
}

const YOLOViz = (props) => {
    
    const [labels, setLabels] = useState([])
    const updated_labels = useRef(labels)
    const [first, setFirst] = useState(true)

    var boxes: Array<any> = []
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
        if(first){
            fetch(`http://localhost:8000/get_labels?filename=${props.keyId}&version=${props.label_version}`)
            .then((response) => response.json()).then((res) => {
                setLabels(Object.values(res))
                updated_labels.current = res
            });
            setFirst(false)
        }
    }, [props.keyId])

    boxes = []

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
            setSubmit={props.setSubmit} setnewLabels={props.setnewLabels}/>
        );
    }

    return (
        <>
            <Image alt='' key="cmp1" className="z-0 w-full h-max" src={im.src} objectFit={'contain'} width={props.ww} height={props.wh} />
            {boxes.map( (box, idx) => box )}
        </>
    )
}

export default YOLOViz