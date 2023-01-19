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
    fetch(`http://localhost:8000/get_labels?filename=${keyId}&version=${version}`)
        .then((res) => res.json())
        .then((res) => {
            var tok_array: Array<any> = [];
            const tokens = keyId.match(/\s+|\S+/g);
            var token_start_ = 1

            for(var i = 0; i < tokens.length; i++){
                const token_start = token_start_
                const entity = res.filter( label => (label['start'] <= token_start && label['end'] >= token_start - 1 + tokens[i].length) )
                
                tok_array.push(
                    <div className="flex w-max relative" style={{ backgroundColor: entity[0] ? `${stringToColour(entity[0]['type'])}88` : '000000'}}>
                        <div 
                            className={"w-max items-center h-min text-base cursor-text"}>
                            { tokens[i] === " " ? "\u00A0" : tokens[i] }
                        </div>
                        {
                            (entity[0] && entity[0]['end'] == token_start - 1 + tokens[i].length) 
                            ?   
                            <div className="w-fit" style={{ userSelect: "none" }}>
                                {entity[0]['type']}
                            </div>
                            : null
                        }
                    </div>
                )
                token_start_ = token_start + tokens[i].length
            }
            setD(
                <div className="border-gray-300 border bg-gray-50 dark:bg-gray-800 rounded-md p-2 h-fit overflow-scroll items-center justify-start flex w-full font-normal">
                {
                    tok_array
                }
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
        <div className="text-sm z-[200] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-400 w-[1100px]  h-[600px]">
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
            <div className="justify-center items-center w-full h-full flex flex-col gap-2">
                <div className="">
                    <DropdownVersion label={'Version'} keyId={props.keyId} setV={setV1} len={props.len} v={v1} />
                    <div className="p-2 h-[10%] items-center justify-start flex w-full font-semibold">
                        {'Sentence:'}
                    </div>
                    <div className="w-[500px] h-[50px] rounded-md dark:text-black text-center flex flex-col justify-center bg-white">
                        {d1}
                    </div>
                </div>
                <div className="mt-20">
                    <DropdownVersion label={'Version'} keyId={props.keyId} setV={setV2} len={props.len} v={v2} />
                    <div className="p-2 h-[10%] items-center justify-start flex w-full font-semibold">
                        {'Sentence:'}
                    </div>
                    <div className="w-[500px] h-[50px] rounded-md dark:text-black text-center flex flex-col justify-center bg-white">
                        {d2}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NERDiffPopup;