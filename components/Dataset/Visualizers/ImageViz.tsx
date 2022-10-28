import Image from "next/image"
import React from "react"

const ImageViz = (props) => {
    
    let im =  document.createElement('img');
    im.src = props.img

    return (
        <>
            <Image alt='' key="cmp1" className="z-0 w-full h-max" src={im.src} objectFit={'contain'} width={props.ww} height={props.wh} />
        </>
    )
}

export default ImageViz