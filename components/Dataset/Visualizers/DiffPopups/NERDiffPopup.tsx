import React, { useRef } from "react";
import { useState, useEffect } from "react";
import DropdownVersion from "../Components/DropdownVersion";

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

const fetchData = async (keyId, version, setD) => {
    const text = await fetch(`http://localhost:8000/get_text?key=${keyId}&version=${version}`).then((res) => res.json())
    
    fetch(`http://localhost:8000/get_labels?filename=${keyId}&version=${version}`)
        .then((res) => res.json())
        .then(async (res) => {
            const sentence = text['text']
            var updated_labels = res
            var order: Array<any> = []
            var array_spans: Array<any> = []

            updated_labels = updated_labels.sort((a, b) => {
                if(a.start > b.start){
                    return 1;
                } else {
                    return -1;
                }
            })
            
            var start = 0

            var x = []
            for (var j = 0; j < updated_labels.length; j++){
                if (updated_labels[j].start <= 1 && updated_labels[j].end > 0){
                    x.push(j)
                }
            }

            var entities_per_index: Array<any> = [x]
            var chars: Array<any> = [sentence[0]]
    
            for(var i = 1; i < sentence.length; i++){
                if (updated_labels.map((val) => (val.end == i)).includes(true)) {
                    order.push(sentence.slice(start, i).replace(/ /g,'\u00A0'));
                    start = i;
                } else if (updated_labels.map((val) => (val.start == i+1)).includes(true)){
                    order.push(sentence.slice(start, i).replace(/ /g,'\u00A0'));
                    start = i;
                } else if (i == sentence.length - 1){
                    order.push(sentence.slice(start, i+1).replace(/ /g,'\u00A0'));
                }
    
                var x: Array<any> = []
                for (var j = 0; j < updated_labels.length; j++){
                    if (updated_labels[j].start <= i + 1 && updated_labels[j].end > i){
                        x.push(j)
                    }
                }
                entities_per_index.push(x)
                chars.push(sentence[i])
            }
            
            start = 0
            for(var i = 0; i < order.length; i++){
                const idx_1 = i
                var child: any = [<span key={`child${idx_1}--1`} style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word', wordBreak: 'break-all'}} className="w-fit text-justify h-min text-base cursor-text"> {order[idx_1].replace(/ /g,'\u00A0')} </span>]
                
                start = (start >= entities_per_index.length) ? entities_per_index.length - 1 : start
    
                for(var j = 0; j < entities_per_index[start].length; j++){
                    const idx_0 = start
                    const idx_2 = j
                    const entity_type = updated_labels[entities_per_index[start][idx_2]]['type']
    
                    child = [
                        <button key={`child${idx_1}-${idx_2}`}  className="w-max text-justify relative bg-white" style={{ backgroundColor: `${stringToColour(entity_type)}22`, border: `1px solid ${stringToColour(entity_type)}AA`}}>
                            {child}
                        </button>
                    ]
                }
                start = start + order[i].length
                array_spans.push(child)
            }
            setD(
                <div className="border-gray-300 border h-36 bg-gray-50 dark:bg-gray-800 rounded-md p-2 overflow-scroll text-justify  w-full font-normal">
                    {array_spans}
                </div>
            )
        })
}

const NERDiffPopup = (props) => {

    const [v1, setV1] = useState(props.len)
    const [v2, setV2] = useState(Math.max(props.len-1,1))
    const [d1, setD1] = useState(null)
    const [d2, setD2] = useState(null)


    useEffect( () => {

        const fetchStuff = async (keyId, setD1, setD2, v1, v2) => {
            await fetchData(keyId,v1,setD1)
            await fetchData(keyId,v2,setD2)
        }
        fetchStuff(props.keyId, setD1, setD2, v1, v2)
    },[props.keyId, props.popup, v1, v2])

    return (
        <div className="text-sm z-[200] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-400 w-[1100px]  h-[600px]">
            <div className="w-full justify-between h-8 flex p-2">
                <button onClick={() => {
                    props.setPopup(false)
                    }} className='text-xs items-center flex justify-center text-gray-800 w-4 h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'>
                    {/* <CloseIcon className="invisible hover:visible w-3 h-3"/> */}
                </button>
                <div className="place-self-center py-2 font-bold">
                    File: {props.keyId}
                </div>
                <div></div>
            </div>
            <div className="justify-start items-center w-full h-full flex flex-col gap-2">
                <div className="mt-8">
                    <DropdownVersion label={'Version'} keyId={props.keyId} setV={setV1} len={props.len} v={v1} />
                    <div className="p-2 h-[10%] items-center justify-start flex w-full font-semibold">
                        {'Sentence:'}
                    </div>
                    <div className="w-[600px] h-fit rounded-md dark:text-black text-center flex flex-col justify-center bg-white">
                        {d1}
                    </div>
                </div>
                <div className="mt-10">
                    <DropdownVersion label={'Version'} keyId={props.keyId} setV={setV2} len={props.len} v={v2} />
                    <div className="p-2 h-[10%] items-center justify-start flex w-full font-semibold">
                        {'Sentence:'}
                    </div>
                    <div className="w-[600px] h-fit rounded-md dark:text-black text-center flex flex-col justify-center bg-white">
                        {d2}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NERDiffPopup;