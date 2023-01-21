import React, { useEffect, useState, useRef, useCallback} from "react"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PsychologyIcon from '@mui/icons-material/Psychology';


async function auto_label(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/dslim/bert-base-NER",
		{
			headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_KEY as string}` },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
    return result;
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

const NERViz = (props) => {
    const [tagEdit, setTagEdit] = useState<Boolean>(false);
    const [newTag, setNewTag] = useState<string>('');
    const [fetched, setFetched] = useState<Boolean>(false);
    const [editing, setEditing] = useState<Boolean>(false);

    const [adding, setAdding] = useState<Boolean>(false);
    const [tag, setTag] = useState<any>('');
    const [nullStr, setNullStr] = useState('');
    const [labels, setLabels] = useState<Array<any>>([]);
    const [sentence, setSentence] = useState<String>('');
    const [edited, setEdited] = useState<Boolean>(false);
    const selected_labels = useRef<Array<any>>([]);
    const updated_labels = useRef<Array<any>>([]);
    const tags = useRef<Array<any>>([]);
    const keyId = useRef<String>('');

    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')

    
    const handleAutoLabel = () => {
        auto_label({"inputs": sentence}).then(
            (res) => {
                console.log(res)
                for(var i = 0; i < res.length; i++ ){
                    if (res[i]['score'] >= 0.77){
                        updated_labels.current.push(
                            {
                                'type': res[i]['entity_group'], 'start': res[i]['start'], 'end': res[i]['end']
                            }
                        )
                        setTag('')
                        setAdding(false)
                        props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current})
                        props.setSubmit(true)
                        setAdding(false)
                        setNullStr('z'.concat(nullStr))
                        }
                    }
            }
        )
    }

    const handleChangeComment = (e) => {
        setNewComment(e.target.value)
    }

    const handleDeleteComment = async (comment) => {
        fetch(`http://localhost:8000/remove_tag?file=${props.keyId}&tag=${comment}`).then(() => {getComments()})
    }

    const handleAddComment = async (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/add_tag?file=${props.keyId}&tag=${newComment}`).then(() => {getComments()})
    }

    const getComments = async () => {
        fetch(`http://localhost:8000/get_tags?file=${props.keyId}`).then((res) => res.json()).then(setComments)
    }

    const handleEditor = () => {
        if (editing) {
            if(edited){
                const data = JSON.stringify({'key': props.keyId, 'text': sentence})
                fetch('http://localhost:8000/set_text/', {method: 'POST',headers: {"Content-Type": "application/json"},body: data})
                .then((res) => res.json())
                .then( (res) => {props.enableLRshortcut.current = false; setEdited(false); setEditing(false);}).then(
                    (res) => {
                        fetch('http://localhost:8000/commit_req?comment='.concat(`fixed renamed sentence ${props.keyId}`)).then(
                            () => {window.location.reload()}
                        )
                    }
                )
            props.setSubmit(true)
        } else {setEditing(false)} } else {
            setEditing(true)
        } 
    }


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
                            style={{ backgroundColor: `${stringToColour(tag_)}77`}}>
                            {tag_}
                        </button>
                    )
                } else {
                    tag_array.push(
                        <button onClick={() => {setTag(tag_); setAdding(true);}} 
                            className="z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 
                            focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800
                            dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                            style={{ backgroundColor: `${stringToColour(tag_)}22`}}
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
            fetch('http://localhost:8000/schema_metadata').then((res) => res.json()).then(
                (res) => {
                    tags.current = res.entities
                }
            ).then(
                () => {
                    fetch(`http://localhost:8000/get_text?key=${props.keyId}`).then((res) => res.json())
                    .then((res) => {setSentence(res['text'])})
                    fetch(`http://localhost:8000/get_labels?filename=${props.keyId}`)
                    .then((res) => res.json())
                    .then((res) => {
                        updated_labels.current = res
                        selected_labels.current = Array(res.length).fill(false)
                        recomputeTags()
                        keyId.current = props.keyId
                        setFetched(true)
                    })
                }
            )

        } else {
            recomputeTags()
        }    
        getComments()
    },[props.keyId, props.loading, tag])

    var order: Array<any> = Array(0)
    var array_spans: Array<any> = Array(0)

    if (fetched && sentence){

        updated_labels.current = updated_labels.current.sort((a, b) => {
            if(a.start > b.start){
                return 1;
            } else {
                return -1;
            }
        })
        
        var start = 0
        var x: Array<any> = []
        for (var j = 0; j < updated_labels.current.length; j++){
            if (updated_labels.current[j].start <= 1 && updated_labels.current[j].end > 0){
                x.push(j)
            }
        }

        var entities_per_index: Array<any> = [x]

        for(var i = 1; i < sentence.length; i++){
            if (updated_labels.current.map((val) => (val.end == i+1)).includes(true)) {
                order.push(sentence.slice(start, i+1).replace(/ /g,'\u00A0'));
                start = i+1;
            } else if (updated_labels.current.map((val) => (val.start == i+1)).includes(true)){
                order.push(sentence.slice(start, i).replace(/ /g,'\u00A0'));
                start = i;
            } else if (i == sentence.length - 1){
                order.push(sentence.slice(start, i+1).replace(/ /g,'\u00A0'));
            }

            var x: Array<any> = []
            for (var j = 0; j < updated_labels.current.length; j++){
                if (updated_labels.current[j].start <= i + 1 && updated_labels.current[j].end > i){
                    x.push(j)
                }
            }
            entities_per_index.push(x)
        }
        
        start = 0
        for(var i = 0; i < order.length; i++){
            const idx_1 = i
            var child: any = [<span key={`child${idx_1}--1`} className="w-max break-all flex justify-start items-center h-min text-base cursor-text"> {order[idx_1].replace(/ /g,'\u00A0')} </span>]
            
            start = (start >= entities_per_index.length) ? entities_per_index.length - 1 : start

            for(var j = 0; j < entities_per_index[start].length; j++){
                const idx_0 = start
                const idx_2 = j
                const entity_type = updated_labels.current[entities_per_index[start][idx_2]]['type']

                child = [
                    <button key={`child${idx_1}-${idx_2}`}  className="w-max relative bg-white flex justify-start" onClick={()=>{selected_labels.current[entities_per_index[idx_0][idx_2] as number] = !selected_labels.current[entities_per_index[idx_0][idx_2] as number]; setNullStr(nullStr.concat('?'))}} style={{ backgroundColor: (selected_labels.current[entities_per_index[idx_0][idx_2]]) ? `${stringToColour(entity_type)}BF` : `${stringToColour(entity_type)}70`}}>
                        {
                            (selected_labels.current[entities_per_index[idx_0][idx_2]] && (updated_labels.current[entities_per_index[idx_0][idx_2]]['end'] == idx_0 + order[idx_1].length))
                            ?
                            <button onClick={() => handleRemove(entities_per_index[idx_0][idx_2])} className="absolute z-[10] w-max h-max top-[-10px] right-[-10px] text-gray-500">
                                <DeleteIcon className="h-[20px] w-[20px]"/>
                            </button>
                            : null
                        }
                        {child}
                        {
                        (updated_labels.current[entities_per_index[idx_0][idx_2]]['end'] == idx_0 + order[idx_1].length)
                        ?   
                        <div className="w-fit" style={{ userSelect: "none" }}>
                            {entity_type}
                        </div>
                        : null
                        }  
                    </button>
                ]
            }
            start = start + order[i].length
            array_spans.push(child)
        }
    }

    return (
        <div className="items-center flex flex-col gap-2 h-full w-full p-2 dark:bg-gray-900 dark:text-white">
            <div className="p-2 h-[10%] items-center justify-start flex w-full font-semibold">
                {'Sentence:'}
            </div>
            <div onMouseUp={()=>{
                const select: any = window.getSelection()
                const selected_string: String = select.toString()
                const string_of_node = select?.anchorNode?.textContent.toString()
                
                if (adding && selected_string.length > 0 && tag != ''){
                    var add = true
                    var start = 0
                    
                    for(var i = 0; i < order.length; i++){
                        if(order[i] == string_of_node){
                            add = false
                            start = start + Math.min(select?.focusOffset,select?.anchorOffset)
                        } else {
                            start = (add) ? start + order[i].length : start
                        }
                    }
                    
                    handleTag(start + 1, start + selected_string.length, tag)
                }
                setAdding(false)
            }} className="flex-wrap overflow-y-scroll h-[30%] border-gray-300 border bg-gray-50 dark:bg-gray-800 rounded-md p-2 items-center justify-start flex w-full font-normal">
                {
                    (editing) ? 
                    <form className="w-full h-full">   
                        <div onInput={(e) => {setSentence(e.currentTarget.textContent as string); setEdited(true)}} className="break-words h-full overflow-y-scroll text-start max-h-96 w-full text-base text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" contentEditable={true}>{sentence}</div>
                    </form>
                    : 
                    (order.length) ? array_spans : null
                }
            </div>
            <div className="p-2 h-[50%] items-start flex flex-col w-full font-normal gap-2">
                {
                    (props.admin) ?
                    <button onClick={() => {handleEditor()}} className={editing ? 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' : 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'}>
                        {editing ? 'Save' : 'Edit'}
                    </button>
                    : null
                }
                <div className="font-semibold">
                    {'Tags:'}
                </div>
                <div className="items-center justify-start flex-wrap flex h-[80%] overflow-scroll w-full font-normal gap-2 border border-gray-300 p-2 rounded-md">
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
                    <button onClick={() => handleAutoLabel()} className={"z-30 flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                            <PsychologyIcon className="h-[20px] w-[20px]"/>
                            {'AutoLabel'}
                    </button>
                </div>
            </div>
            <div className="w-full">
                <div className="p-2 h-[10%] mt-5 items-center justify-start flex w-full font-semibold">
                    {'Comments:'}
                </div>
                <div className="flex-col justify-between">
                    <div className="w-full">
                        <div className="border overflow-scroll border-gray-300 rounded-md items-center h-[50px] p-1 flex gap-2">
                            {
                                (comments.length > 0) ?
                                comments.map( (comnt, idx) => 
                                    <span key={'comment'.concat(comnt)} id="badge-dismiss-default" className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                                        {comnt}
                                    <button onClick={() => handleDeleteComment(comnt)} className="inline-flex items-center p-0.5 ml-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                        <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                  </span>
                                ) : <></>
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full">
                        <form className="px-5" onSubmit={handleAddComment} >
                            <label className="flex justify-center mt-2 gap-1"> 
                                <input onChange={handleChangeComment}
                                    className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="Add comment or note" type="text" />   
                                <div className="flex flex-col justify-center">
                                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-body rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        +
                                    </button>
                                </div>
                            </label> 
                        </form> 
                </div>
            </div>
        </div>
    )
}

export default NERViz;