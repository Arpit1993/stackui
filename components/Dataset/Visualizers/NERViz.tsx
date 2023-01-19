import React, { useEffect, useState, useRef, useCallback} from "react"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';


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

const NERViz = (props) => {
    const [tagEdit, setTagEdit] = useState<Boolean>(false);
    const [newTag, setNewTag] = useState<string>('');
    
    const [adding, setAdding] = useState<Boolean>(false);
    const [tag, setTag] = useState<any>('');
    const [nullStr, setNullStr] = useState('');
    const [labels, setLabels] = useState<Array<any>>([]);
    const selected_labels = useRef<Array<any>>([]);
    const updated_labels = useRef<Array<any>>([]);
    const tags = useRef<Array<any>>([]);
    const keyId = useRef<String>('');


    const handleTag = (start, end, tag) => {
        if(adding){
            updated_labels.current.push(
                {
                    'type': tag, 'start': start, 'end': end
                }
            )
            setTag('')
            setAdding(false)
            props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current})
            props.setSubmit(true)
        }
    } 

    const recomputeTags = () => {
        var tag_array: Array<any> = [];
        var seen_tags: Array<any> = [];
        var all_tags: Array<any> = tags.current;
        const res = updated_labels.current;
        selected_labels.current = Array(res.length).fill(false);

        if(all_tags.length == 0){
            for(var i = 0; i < res.length; i++){
                all_tags.push(res[i]['type'])
            }    
        }

        for(var i = 0; i < all_tags.length; i++){
            const tag_ = all_tags[i]
            if(!seen_tags.includes(tag_)){
                if (tag == tag_){
                    tag_array.push(
                        <button onClick={() => {setTag(''); setAdding(true);}} 
                            className="z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 
                            focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800
                            dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                            style={{ backgroundColor: `${stringToColour(tag_)}44`}}>
                            {tag_}
                        </button>
                    )
                } else {
                    tag_array.push(
                        <button onClick={() => {setTag(tag_); setAdding(true);}} 
                            className="z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 
                            focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800
                            dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                            >
                            {tag_}
                        </button>
                    )
                }
                seen_tags.push(tag_);
            }
        }

        setLabels(() => {return tag_array}); 
        tags.current = seen_tags
    }

    const addNewTag = (new_tag) => {
        var all_tags: Array<any> = tags.current;
        const res = updated_labels.current;
        selected_labels.current = Array(res.length).fill(false);

        if(!all_tags.includes(new_tag)){
            all_tags.push(new_tag);
        }

        if (new_tag != ''){
            tags.current = all_tags
            setTagEdit(false); 
            setAdding(true);
            setNewTag('');
            recomputeTags();
        }
    }

    const handleRemove = (idx) => {

        updated_labels.current.splice(idx, 1)

        props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current})
        props.setSubmit(true)
        recomputeTags()
    }
    
    useEffect(() => {
        if(keyId.current != props.keyId){
            tags.current = []
            fetch(`http://localhost:8000/get_labels?filename=${props.keyId}`)
            .then((res) => res.json())
            .then((res) => {
                updated_labels.current = res
                selected_labels.current = Array(res.length).fill(false)
                recomputeTags()
                keyId.current = props.keyId
            })
        } else {
            recomputeTags()
        }    
    },[props.keyId, tag, props.loading])

    var tok_array: Array<any> = [];
    const tokens = props.keyId.match(/\s+|\S+/g);
    var token_start_ = 1

    for(var i = 0; i < tokens.length; i++){
        const token_start = token_start_
        const entity = updated_labels.current.filter( label => (label['start'] <= token_start && label['end'] >= token_start - 1 + tokens[i].length) )
        const len = tokens[i].length
        const idx = i
        const idx_entity = updated_labels.current.findIndex( label => (label['start'] <= token_start && label['end'] >= token_start - 1 + tokens[i].length) )

        tok_array.push(
            <div className="flex w-max relative" style={{ backgroundColor: (entity[0]) ? (selected_labels.current[idx]) ? `${stringToColour(entity[0]['type'])}88` : `${stringToColour(entity[0]['type'])}44` : '#00000000'}}>
                {
                    (selected_labels.current[idx] && entity[0])
                    ?
                    <button onClick={() => handleRemove(idx_entity)} className="absolute z-[10] w-max h-max top-[-10px] right-[-10px] text-gray-500">
                        <DeleteIcon className="h-[20px] w-[20px]"/>
                    </button>
                    : null
                }
                <button 
                    onClick={() => { if (adding) {handleTag(token_start, token_start - 1 + len, tag)} else {selected_labels.current[idx] = !selected_labels.current[idx]; setNullStr(nullStr.concat('?'))}}} 
                    className={adding ? "w-max items-center h-min text-base" : "w-max items-center h-min text-base cursor-text"}>
                    { tokens[i] === " " ? "\u00A0" : tokens[i] }
                </button>
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

    return (
        <div className="items-center flex flex-col gap-2 h-full w-full p-2 dark:bg-gray-900 dark:text-white">
            <div className="p-2 h-[10%] items-center justify-start flex w-full font-semibold">
                {'Sentence:'}
            </div>
            <div className="flex-wrap border-gray-300 border bg-gray-50 dark:bg-gray-800 rounded-md p-2 h-fit overflow-ellipsis items-center justify-start flex w-full font-normal">
                {
                    tok_array
                }
            </div>
            <div className="p-2 h-[20%] items-start flex flex-col w-full font-normal gap-2">
                <div className="font-semibold">
                    {'Tags:'}
                </div>
                <div className="items-center justify-start flex w-full font-normal gap-2">
                    {labels}
                    {
                        tagEdit ?
                        <form onSubmit={(event) => {event.preventDefault(); addNewTag(newTag)}} className={"z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                            <label>
                                <input className="w-24 h-6 text-black font-normal border-gray-300 border rounded-md" type="text" value={newTag} 
                                onChange={(e) => {setNewTag(e.target.value)}} />
                            </label>
                        </form>
                        :
                        <button onClick={() => setTagEdit(true)} className={"z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                            <AddIcon className="h-[20px] w-[20px]"/>
                            {'Add'}
                        </button>

                    }
                </div>
            </div>
        </div>
    )
}

export default NERViz;