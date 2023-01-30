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

function drawImageScaled(img, ctx) {
    var canvas = ctx.canvas ;
    var hRatio = canvas.width  / img.width    ;
    var vRatio =  canvas.height / img.height  ;
    var ratio  = Math.min ( hRatio, vRatio );
    var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
    var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.drawImage(img, 0,0, img.width, img.height,
                       centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  
 }

const CanvasBoundingBoxes = (props) => {
    
    const [cursor, setCursor] = useState<number>(0)
    const [mouseInsideBB, setMouseInsideBB] = useState<Array<Boolean>>(Array(props.rect.length).fill(false))
    const canvasRef = useRef(null)

    const dragTL = useRef(Array(props.rect.length).fill(false))
    const dragBL = useRef(Array(props.rect.length).fill(false))
    const dragTR = useRef(Array(props.rect.length).fill(false))
    const dragBR = useRef(Array(props.rect.length).fill(false))


    const dragT = useRef(Array(props.rect.length).fill(false))
    const dragB = useRef(Array(props.rect.length).fill(false))
    const dragL = useRef(Array(props.rect.length).fill(false))
    const dragR = useRef(Array(props.rect.length).fill(false))

    const dragAll = useRef(Array(props.rect.length).fill(false))

    const mouseX = useRef(0)
    const mouseY = useRef(0)
    const BoxDX = useRef(0)
    const BoxDY = useRef(0)

    useEffect(() => {
        const canvas: any = canvasRef.current
        const client_rect = canvas.getBoundingClientRect()
        
        // var dpr = window.devicePixelRatio || 1;
        // canvas.width = client_rect.width * dpr;
        // canvas.height = client_rect.height * dpr;
        const context =  canvas.getContext('2d')
        // context.scale(dpr, dpr);

        const mouseDown = (e) => {
            mouseX.current = e.pageX - client_rect.left;
            mouseY.current = e.pageY - client_rect.top;

            var in_box = false

            for(var i = 0; i < props.rect.length; i++){
                if(props.active[i] || props.selected[i]){
                    if(props.editing && !props.loading){
                        if (props.new.current[i]){
                            dragBR.current[i] = true
                            var arr = Array(props.rect.length).fill(false)
                            arr[i] = true
                            props.setEdit(() => {return arr})
                            in_box = true
                        } else {
                            if (checkCloseEnough(mouseX.current, props.rect[i].x) && checkCloseEnough(mouseY.current, props.rect[i].y) && (props.selected[i])) {
                                dragTL.current[i] = true
                                var arr = Array(props.rect.length).fill(false)
                                arr[i] = true
                                props.setEdit(() => {return arr})
                                props.setUsableStr(props.rect[i].class)
                                if(props.labelMap[props.rect[i].class]){
                                    props.setUsableStr2(props.labelMap[props.rect[i].class].label)
                                } else {
                                    props.setUsableStr2('')
                                }
                                setCursor(1)
                                in_box = true
                            break;
                            }
                            else if (checkCloseEnough(mouseX.current, props.rect[i].x + props.rect[i].w) && checkCloseEnough(mouseY.current, props.rect[i].y) && (props.selected[i])) {
                                dragTR.current[i] = true
                                var arr = Array(props.rect.length).fill(false)
                                arr[i] = true
                                props.setEdit(() => {return arr})
                                props.setUsableStr(props.rect[i].class)
                                if(props.labelMap[props.rect[i].class]){
                                    props.setUsableStr2(props.labelMap[props.rect[i].class].label)
                                } else {
                                    props.setUsableStr2('')
                                }
                                setCursor(2)
                                in_box = true
                            break;
                            }
                            else if (checkCloseEnough(mouseX.current, props.rect[i].x) && checkCloseEnough(mouseY.current, props.rect[i].y + props.rect[i].h) && (props.selected[i])) {
                                dragBL.current[i] = true
                                var arr = Array(props.rect.length).fill(false)
                                arr[i] = true
                                props.setEdit(() => {return arr})
                                props.setUsableStr(props.rect[i].class)
                                if(props.labelMap[props.rect[i].class]){
                                    props.setUsableStr2(props.labelMap[props.rect[i].class].label)
                                } else {
                                    props.setUsableStr2('')
                                }
                                setCursor(3)
                                in_box = true
                            break;
                            }
                            else if (checkCloseEnough(mouseX.current, props.rect[i].x + props.rect[i].w) && checkCloseEnough(mouseY.current, props.rect[i].y + props.rect[i].h) && (props.selected[i])) {
                                dragBR.current[i] = true
                                var arr = Array(props.rect.length).fill(false)
                                arr[i] = true
                                props.setEdit(() => {return arr})
                                props.setUsableStr(props.rect[i].class)
                                if(props.labelMap[props.rect[i].class]){
                                    props.setUsableStr2(props.labelMap[props.rect[i].class].label)
                                } else {
                                    props.setUsableStr2('')
                                }
                                setCursor(4)
                                in_box = true
                                break;
                            } 
                            // else if (checkCloseEnough(mouseX.current, props.rect[i].x) && (props.selected[i])) {
                            //     dragL.current[i] = true
                            //     var arr = Array(props.rect.length).fill(false)
                            //     arr[i] = true
                            //     props.setEdit(() => {return arr})
                            //     props.setUsableStr(props.rect[i].class)
                            //     setCursor(1)
                            //     in_box = true
                            //     break;
                            // }
                            // else if (checkCloseEnough(mouseX.current, props.rect[i].x + props.rect[i].w) && (props.selected[i])) {
                            //     dragR.current[i] = true
                            //     var arr = Array(props.rect.length).fill(false)
                            //     arr[i] = true
                            //     props.setEdit(() => {return arr})
                            //     props.setUsableStr(props.rect[i].class)
                            //     setCursor(2)
                            //     in_box = true
                            //     break;
                            // }
                            // else if (checkCloseEnough(mouseY.current, props.rect[i].y) && (props.selected[i])) {
                            //     dragT.current[i] = true
                            //     var arr = Array(props.rect.length).fill(false)
                            //     arr[i] = true
                            //     props.setEdit(() => {return arr})
                            //     props.setUsableStr(props.rect[i].class)
                            //     setCursor(1)
                            //     in_box = true
                            //     break;
                            // }
                            // else if (checkCloseEnough(mouseX.current, props.rect[i].y + props.rect[i].h) && (props.selected[i])) {
                            //     dragB.current[i] = true
                            //     var arr = Array(props.rect.length).fill(false)
                            //     arr[i] = true
                            //     props.setEdit(() => {return arr})
                            //     props.setUsableStr(props.rect[i].class)
                            //     setCursor(2)
                            //     in_box = true
                            //     break;
                            // }
                            else if (checkIfInside(mouseX.current, mouseY.current, i) && (!props.selected.includes(true) || props.selected[i])) {
                                dragAll.current[i] = true
                                var arr = Array(props.rect.length).fill(false)
                                arr[i] = true
                                props.setEdit(() => {return arr})
                                props.setUsableStr(props.rect[i].class)
                                props.setUsableStr2((props.labelMap[props.rect[i].class]) ? props.labelMap[props.rect[i].class].label : '')
                                BoxDX.current = mouseX.current - props.rect[i].x
                                BoxDY.current = mouseY.current - props.rect[i].y
                                setCursor(5)
                                in_box = true
                                break;
                                
                            } 
                        }
                    } else {
                        if (!props.diff){
                            props.setEditing(true)
                        }
                    }
                }
            }

            if(!in_box && mouseX.current > 0 && mouseY.current > 0 && mouseX.current < 800 && mouseY.current < 500){
                props.setEdit(() => {return Array(props.rect.length).fill(false)})
            }
        }
    
        const mouseUp = () => {
            for(var i = 0; i < props.rect.length; i++){
                if(props.active[i] || props.selected[i]){
                    if(dragBL.current[i] || dragBR.current[i] || dragTL.current[i] || dragTR.current[i] || dragAll.current[i]){
                        props.rect[i].w = (props.rect[i].w < 0) ? 0.1 : props.rect[i].w
                        props.rect[i].h = (props.rect[i].h < 0) ? 0.1 : props.rect[i].h
                        
                        var arr_copy = Object.values(props.updated_labels.current)
                        const idx = arr_copy.indexOf(props.keyId)
                        if (idx > -1){
                            arr_copy.splice(idx,1)
                        }
                        props.setLabels(() => {return arr_copy})
                    }
                }
            }
            dragTL.current = Array(props.rect.length).fill(false) 
            dragTR.current = Array(props.rect.length).fill(false) 
            dragBL.current = Array(props.rect.length).fill(false)
            dragBR.current = Array(props.rect.length).fill(false)
            dragAll.current = Array(props.rect.length).fill(false)
            setCursor(0)
        }
    
        const mouseMove = (e) => {
            mouseX.current = e.pageX - client_rect.left;
            mouseY.current = e.pageY - client_rect.top;
            if(dragBL.current.includes(true) || dragBR.current.includes(true) || dragTL.current.includes(true) || dragTR.current.includes(true) || dragAll.current.includes(true)){
                context.clearRect(0, 0, canvas.width, canvas.height);
                drawImageScaled(props.img, context)
            }
                        
            for(var i = 0; i < props.rect.length; i++){
                if(props.active[i] || props.selected[i]){
                    if (props.new.current[i]){
                        if (dragBR.current[i]){
                            props.rect[i].w = 0;
                            props.rect[i].h = 0;
                            props.rect[i].x = mouseX.current;
                            props.rect[i].y = mouseY.current;
                            
                            props.new.current[i] = false
                        }
                    } else {
                        if (dragTL.current[i]) {
                            props.rect[i].w = Math.min(props.rect[i].x + props.rect[i].w - mouseX.current, props.rect[i].x + props.rect[i].w - (props.ww - props.width )/2);
                            props.rect[i].h = Math.min(props.rect[i].y + props.rect[i].h - mouseY.current, props.rect[i].y + props.rect[i].h - (props.wh - props.height )/2);
                            props.rect[i].x = mouseX.current;
                            props.rect[i].y = mouseY.current;
                        } else if (dragTR.current[i]) {
                            props.rect[i].w = Math.min(mouseX.current - props.rect[i].x, (props.ww + props.width )/2 - props.rect[i].x);
                            props.rect[i].h = Math.min(props.rect[i].y + props.rect[i].h - mouseY.current, props.rect[i].y + props.rect[i].h - (props.wh - props.height )/2);
                            props.rect[i].x = mouseX.current - props.rect[i].w;
                            props.rect[i].y = mouseY.current;
                        } else if (dragBL.current[i]) {
                            props.rect[i].w = Math.min(props.rect[i].x + props.rect[i].w - mouseX.current, props.rect[i].x + props.rect[i].w - (props.ww - props.width )/2);
                            props.rect[i].h = Math.min(mouseY.current - props.rect[i].y, (props.wh + props.height )/2 - props.rect[i].y);
                            props.rect[i].x = mouseX.current;
                            props.rect[i].y = mouseY.current - props.rect[i].h;
                        } else if (dragBR.current[i]) {
                            props.rect[i].w = Math.min(mouseX.current - props.rect[i].x, (props.ww + props.width )/2 - props.rect[i].x);
                            props.rect[i].h = Math.min(mouseY.current - props.rect[i].y, (props.wh + props.height )/2 - props.rect[i].y);
                            props.rect[i].x = mouseX.current - props.rect[i].w;
                            props.rect[i].y = mouseY.current - props.rect[i].h;
                        } else if (dragAll.current[i]) {
                            props.rect[i].x = mouseX.current  - BoxDX.current;
                            props.rect[i].y = mouseY.current  - BoxDY.current;
                        }
                    }
                    if(dragBL.current.includes(true) || dragBR.current.includes(true) || dragTL.current.includes(true) || dragTR.current.includes(true) || dragAll.current.includes(true)){
                        if(dragBL.current[i] || dragBR.current[i] || dragTL.current[i] || dragTR.current[i] || dragAll.current[i]){
                            const color = hexToRgb((props.labelMap[props.rect[i].class]) ? props.labelMap[props.rect[i].class].color : '#000000')
                            props.rect[i].w = (props.rect[i].w < 0) ? 0.1 : props.rect[i].w
                            props.rect[i].h = (props.rect[i].h < 0) ? 0.1 : props.rect[i].h
                            
                            props.rect[i].x = (props.rect[i].x < (props.ww - props.width  )/2) ? (props.ww - props.width )/2 : props.rect[i].x
                            props.rect[i].y = (props.rect[i].y < (props.wh - props.height )/2) ? (props.wh - props.height)/2 : props.rect[i].y

                            props.rect[i].x = (props.rect[i].x + props.rect[i].w > (props.ww + props.width )/2) ? (props.ww + props.width )/2 - props.rect[i].w : props.rect[i].x
                            props.rect[i].y = (props.rect[i].y + props.rect[i].h > (props.wh + props.height)/2) ? (props.wh + props.height)/2 - props.rect[i].h : props.rect[i].y

                            context.lineWidth = 2;
                            context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`
                            context.fillRect(props.rect[i].x, props.rect[i].y, props.rect[i].w, props.rect[i].h)
                            context.strokeStyle = (props.labelMap[props.rect[i].class]) ? props.labelMap[props.rect[i].class].color : '#000000'
                            context.strokeRect(props.rect[i].x, props.rect[i].y, props.rect[i].w, props.rect[i].h)

                            context.font = '12px sans-serif';
                            context.fillStyle = '#ffff'
                            context.fillText((props.labelMap[props.rect[i].class]) ? props.labelMap[props.rect[i].class].label : '', props.rect[i].x, props.rect[i].y+12);

                            if((props.selected[i]) ){
                                context.fillStyle = `1.0, 1.0, 1.0, 1.0)`
                                context.fillRect(props.rect[i].x-5, props.rect[i].y-5, 10, 10) 
                                context.strokeRect(props.rect[i].x-5, props.rect[i].y-5, 10, 10) 
                                
                                context.fillStyle = `1.0, 1.0, 1.0, 1.0)`
                                context.fillRect(props.rect[i].x-5, props.rect[i].y + props.rect[i].h -5, 10, 10) 
                                context.strokeRect(props.rect[i].x-5, props.rect[i].y + props.rect[i].h -5, 10, 10)
            
                                context.fillStyle = `1.0, 1.0, 1.0, 1.0)`
                                context.fillRect(props.rect[i].x+ props.rect[i].w -5, props.rect[i].y + props.rect[i].h -5, 10, 10) 
                                context.strokeRect(props.rect[i].x+ props.rect[i].w -5, props.rect[i].y + props.rect[i].h -5, 10, 10)
            
                                context.fillStyle = `1.0, 1.0, 1.0, 1.0)`
                                context.fillRect(props.rect[i].x+ props.rect[i].w -5, props.rect[i].y -5, 10, 10) 
                                context.strokeRect(props.rect[i].x+ props.rect[i].w -5, props.rect[i].y -5, 10, 10)
                            }

            
                            const new_label = {
                                "0": props.rect[i].class,
                                "1": (props.rect[i].x + props.rect[i].w/2 - (props.ww - props.width )/2)/props.width,
                                "2": (props.rect[i].y + props.rect[i].h/2 - (props.wh - props.height)/2)/props.height,
                                "3": props.rect[i].w/props.width,
                                "4": props.rect[i].h/props.height
                            }
            
                            var new_labels = props.updated_labels.current
                            new_labels[i] = new_label
                            
                            new_labels['keyId'] = props.keyId
                            props.updated_labels.current = new_labels
            
                            props.setSubmit(true)
                            props.setnewLabels(() => {return props.updated_labels.current})
                        }  else {
                            var splitString = `${props.rect[i].class}`.split("");
                            var reverseArray = splitString.reverse();
                            var joinArray = reverseArray.join("");
                            const color_hex = stringToColour(`${joinArray}c${props.rect[i].class}`)
                            const color = hexToRgb(color_hex)
                            props.rect[i].w = (props.rect[i].w < 0) ? 0.1 : props.rect[i].w
                            props.rect[i].h = (props.rect[i].h < 0) ? 0.1 : props.rect[i].h
                            context.lineWidth = 2;
                            context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.05)`
                            context.fillRect(props.rect[i].x, props.rect[i].y, props.rect[i].w, props.rect[i].h)
                            context.strokeStyle = `${color_hex}AA`
                            context.strokeRect(props.rect[i].x, props.rect[i].y, props.rect[i].w, props.rect[i].h)
            
                            context.font = '12px sans-serif';
                            context.fillStyle = '#ffff'
                            context.fillText((props.labelMap[props.rect[i].class]) ? props.labelMap[props.rect[i].class].label : '', props.rect[i].x, props.rect[i].y+12);
                        } 
                    }
                }
            }

            var cursor_set = false

            for(var i = 0; i < props.rect.length; i++){
                if(props.active[i] || props.selected[i]){
                    if(props.editing && !props.loading && !props.new.current[i]){
                        if (props.new.current[i]){
                            dragBR.current[i] = true
                            var arr = Array(props.rect.length).fill(false)
                            arr[i] = true
                            props.setEdit(() => {return arr})
                        } else {
                            if (checkCloseEnough(mouseX.current, props.rect[i].x) && checkCloseEnough(mouseY.current, props.rect[i].y) && (props.selected[i])) {
                                setCursor(1)
                                cursor_set = true
                            break;
                            }
                            else if (checkCloseEnough(mouseX.current, props.rect[i].x + props.rect[i].w) && checkCloseEnough(mouseY.current, props.rect[i].y) && (props.selected[i])) {
                                setCursor(2)
                                cursor_set = true
                            break;
                            }
                            else if (checkCloseEnough(mouseX.current, props.rect[i].x) && checkCloseEnough(mouseY.current, props.rect[i].y + props.rect[i].h) && (props.selected[i])) {
                                setCursor(3)
                                cursor_set = true
                            break;
                            }
                            else if (checkCloseEnough(mouseX.current, props.rect[i].x + props.rect[i].w) && checkCloseEnough(mouseY.current, props.rect[i].y + props.rect[i].h) && (props.selected[i])) {
                                setCursor(4)
                                cursor_set = true
                            } else if (checkIfInside(mouseX.current, mouseY.current, i) && (props.selected[i])) {
                                // setCursor(5)
                                cursor_set = true
                            break;
                            }
                        }
                    }
                }
            }

            if(!cursor_set){
                setCursor(0)
            }

            var inside: Array<Boolean> = []
            for(var i = 0; i < props.rect.length; i++){
                if(props.active[i] || props.selected[i]){
                    inside.push(checkIfInside(mouseX.current, mouseY.current, i))
                } else {
                    inside.push(false)
                }
            }
            setMouseInsideBB(() => {return inside})
        }
    
        const checkCloseEnough = (p1, p2) => {
            return Math.abs(p1 - p2) < 5;
        }

        const checkIfInside = (pX, pY, i) => {
            return (pX > props.rect[i].x && pX < props.rect[i].x + props.rect[i].w) && (pY > props.rect[i].y && pY < props.rect[i].y +props.rect[i].h);
        }

        window.addEventListener('mousedown', mouseDown);
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('mousemove', mouseMove);

        context.clearRect(0, 0, canvas.width, canvas.height);

        drawImageScaled(props.img, context)

        for(var i = 0; i < props.rect.length; i++){
            if(props.active[i] || props.selected[i]){
                const color = hexToRgb((props.labelMap[props.rect[i].class]) ? props.labelMap[props.rect[i].class].color : '#000000')
                context.lineWidth = 2;
                context.fillStyle = (props.selected[i]) ? `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)` : `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`
                context.fillRect(props.rect[i].x, props.rect[i].y, props.rect[i].w, props.rect[i].h)

                context.strokeStyle = (props.labelMap[props.rect[i].class]) ? props.labelMap[props.rect[i].class].color : '#000000'
                context.strokeRect(props.rect[i].x, props.rect[i].y, props.rect[i].w, props.rect[i].h)
                if (!props.new.current[i]){
                    context.font = '12px sans-serif';
                    context.fillStyle = '#ffff';
                    context.fillText((props.labelMap[props.rect[i].class]) ? props.labelMap[props.rect[i].class].label : '', props.rect[i].x, props.rect[i].y+12);
                }


                if((props.selected[i]) ){
                    context.fillStyle = `1.0, 1.0, 1.0, 1.0)`
                    context.fillRect(props.rect[i].x-5, props.rect[i].y-5, 10, 10) 
                    context.strokeRect(props.rect[i].x-5, props.rect[i].y-5, 10, 10) 
                    
                    context.fillStyle = `1.0, 1.0, 1.0, 1.0)`
                    context.fillRect(props.rect[i].x-5, props.rect[i].y + props.rect[i].h -5, 10, 10) 
                    context.strokeRect(props.rect[i].x-5, props.rect[i].y + props.rect[i].h -5, 10, 10)

                    context.fillStyle = `1.0, 1.0, 1.0, 1.0)`
                    context.fillRect(props.rect[i].x+ props.rect[i].w -5, props.rect[i].y + props.rect[i].h -5, 10, 10) 
                    context.strokeRect(props.rect[i].x+ props.rect[i].w -5, props.rect[i].y + props.rect[i].h -5, 10, 10)

                    context.fillStyle = `1.0, 1.0, 1.0, 1.0)`
                    context.fillRect(props.rect[i].x+ props.rect[i].w -5, props.rect[i].y -5, 10, 10) 
                    context.strokeRect(props.rect[i].x+ props.rect[i].w -5, props.rect[i].y -5, 10, 10)
                }
            }
        }

        return () => {
            window.removeEventListener('mousedown', mouseDown);
            window.removeEventListener('mouseup', mouseUp);
            window.removeEventListener('mousemove', mouseMove);
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])
    
    return(
        <div className={`z-20 absolute ${(props.new.current.includes(true)) ? '' : (cursor == 0) ? mouseInsideBB.includes(true) ? 'cursor-pointer' : '' : (cursor == 1) ? 'cursor-nw-resize' : (cursor == 2) ? 'cursor-ne-resize' : (cursor == 3) ? 'cursor-sw-resize' : (cursor == 4) ? 'cursor-se-resize' : (cursor == 5) ? 'cursor-move' : '' }`}>
            <canvas key={`boxes canvas`} ref={canvasRef} {...props} width={props.diff ? 500 :  800} height={500} /> 
        </div>
    )
}

export default CanvasBoundingBoxes