import React, { useEffect, useState, useRef } from "react"

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

const BoundingBox = (props) => {
    
    const [edit, setEdit] = useState<Boolean>(false)
    const canvasRef = useRef(null)

    const offset_x = -5
    const offset_y = 0

    var splitString = `${props.class_number}`.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");

    const adding = useRef(props.adding)

    const dragTL = useRef(false)
    const dragBL = useRef(false)
    const dragTR = useRef(false)
    const dragBR = useRef(false)

    const mouseX = useRef(0)
    const mouseY = useRef(0)

    const color_hex = stringToColour(`${joinArray}c${props.class_number}`)
    const color = hexToRgb(color_hex)

    useEffect(() => {
        if (props.active){
            const canvas: any = canvasRef.current
            const context =  canvas.getContext('2d')
            const client_rect = canvas.getBoundingClientRect()
            
            const mouseDown = (e) => {
                mouseX.current = e.pageX - client_rect.left;
                mouseY.current = e.pageY - client_rect.top;

                if(props.editing){
                    if (checkCloseEnough(mouseX.current, props.rect.x) && checkCloseEnough(mouseY.current, props.rect.y)) {
                        dragTL.current = true
                        setEdit(true)
                    }
                    else if (checkCloseEnough(mouseX.current, props.rect.x + props.rect.w) && checkCloseEnough(mouseY.current, props.rect.y)) {
                        dragTR.current = true
                        setEdit(true)
                    }
                    else if (checkCloseEnough(mouseX.current, props.rect.x) && checkCloseEnough(mouseY.current, props.rect.y + props.rect.h)) {
                        dragBL.current = true
                        setEdit(true)
                    }
                    else if (checkCloseEnough(mouseX.current, props.rect.x + props.rect.w) && checkCloseEnough(mouseY.current, props.rect.y + props.rect.h)) {
                        dragBR.current = true
                        setEdit(true)
                    }
                
                } else {
                    if (!props.diff){
                        props.setEditing(true)
                    }
                }
            }
        
            const mouseUp = () => {
                if(dragBL.current || dragBR.current || dragTL.current || dragTR.current){
                    var arr_copy = Object.values(props.updated_labels.current)
                    const idx = arr_copy.indexOf(props.keyId)
                    if (idx > -1){
                        arr_copy.splice(idx,1)
                    }
                    props.setLabels(arr_copy)
                }

                dragTL.current = false 
                dragTR.current = false 
                dragBL.current = false
                dragBR.current = false

                setEdit(false)
            }
        
            const mouseMove = (e) => {
                mouseX.current = e.pageX - client_rect.left;
                mouseY.current = e.pageY - client_rect.top;
        
                if (dragTL.current) {
                    props.rect.w = (props.rect.x + props.rect.w - mouseX.current);
                    props.rect.h = (props.rect.y + props.rect.h - mouseY.current);
                    props.rect.x = mouseX.current;
                    props.rect.y = mouseY.current;
                } else if (dragTR.current) {
                    props.rect.w = (mouseX.current - props.rect.x);
                    props.rect.h = (props.rect.y + props.rect.h - mouseY.current);
                    props.rect.x = mouseX.current - props.rect.w;
                    props.rect.y = mouseY.current;
                } else if (dragBL.current) {
                    props.rect.w = (props.rect.x + props.rect.w - mouseX.current);
                    props.rect.h = (mouseY.current - props.rect.y);
                    props.rect.x = mouseX.current;
                    props.rect.y = mouseY.current - props.rect.h;
                } else if (dragBR.current) {
                    props.rect.w = (mouseX.current - props.rect.x);
                    props.rect.h = (mouseY.current - props.rect.y);
                    props.rect.x = mouseX.current - props.rect.w;
                    props.rect.y = mouseY.current - props.rect.h;
                }

                if(dragBL.current || dragBR.current || dragTL.current || dragTR.current){
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.lineWidth = 2;
                    context.fillStyle = (props.selected || edit) ? `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)` : `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`
                    context.fillRect(props.rect.x+offset_x, props.rect.y+offset_y, props.rect.w, props.rect.h)
                    context.strokeStyle = color_hex
                    context.strokeRect(props.rect.x+offset_x, props.rect.y+offset_y, props.rect.w, props.rect.h)

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

                    props.setSubmit(true)
                    props.setnewLabels(props.updated_labels.current)
                }
            }
        
            const checkCloseEnough = (p1, p2) => {
                return Math.abs(p1 - p2) < 10;
            }

            window.addEventListener('mousedown', mouseDown);
            window.addEventListener('mouseup', mouseUp);
            window.addEventListener('mousemove', mouseMove);
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.lineWidth = 2;
            context.fillStyle = (props.selected || edit) ? `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)` : `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`
            context.fillRect(props.rect.x+offset_x, props.rect.y+offset_y, props.rect.w, props.rect.h)
            context.strokeStyle = color_hex
            context.strokeRect(props.rect.x+offset_x, props.rect.y+offset_y, props.rect.w, props.rect.h)

            context.font = '12px sans-serif';
            context.fillStyle = '#ffff';
            context.fillText(props.class_number, props.rect.x+2, props.rect.y+12);


            return () => {
                window.removeEventListener('mousedown', mouseDown);
                window.removeEventListener('mouseup', mouseUp);
                window.removeEventListener('mousemove', mouseMove);
            }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color, color_hex, props])
    
    return(
        <div className="z-20 absolute">
            {
                props.active ?
                <canvas key={`boxx${props.class_number}${props.label_idx}`} ref={canvasRef} {...props} width={800} height={500} /> 
                :
                null
            }
        </div>
    )
}

export default BoundingBox