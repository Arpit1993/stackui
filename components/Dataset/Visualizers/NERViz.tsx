import React, { useEffect, useState, useRef, useCallback} from "react"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LoadingScreen from "../../LoadingScreen";

async function auto_label(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/flair/ner-english-ontonotes-large",
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
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }

    return colour;
}

const NERViz = (props) => {
    const [tagEdit, setTagEdit] = useState<Boolean>(false);
    const [newTag, setNewTag] = useState<string>('');
    const [fetched, setFetched] = useState<Boolean>(false);
    const [editing, setEditing] = useState<Boolean>(false);
    const [loading, setLoading] = useState<Boolean>(false);
    
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
        setLoading(true)
        auto_label({"inputs": sentence}).then(
            (res) => {
                console.log(res)
                for(let i = 0; i < res.length; i++ ){
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
                setLoading(false)
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
            props.enableLRshortcut.current = true; 
            if(edited){
                props.setFiltering('dasdksl')
                const data = JSON.stringify({'key': props.keyId, 'text': sentence})
                fetch('http://localhost:8000/set_text/', {method: 'POST',headers: {"Content-Type": "application/json"},body: data})
                .then((res) => res.json())
                .then( (res) => {setEdited(false); setEditing(false); props.setSubmit(true); props.setKeyId(res['newKey']); props.setFiltering('sdasl'); props.setFiltering('')})
        } else {setEditing(false)} } else {
            props.enableLRshortcut.current = false; 
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
        let tag_array: Array<any> = [];
        let seen_tags: Array<any> = [];
        let all_tags: Array<any> = tags.current;
        const res = updated_labels.current;
        selected_labels.current = Array(res.length).fill(false);

        if(all_tags.length == 0){
            for(let i = 0; i < res.length; i++){
                all_tags.push(res[i]['type'])
            }    
        }

        for(let i = 0; i < all_tags.length; i++){
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
        let all_tags: Array<any> = tags.current;
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

    let order: Array<any> = Array(0)
    let array_spans: Array<any> = Array(0)

    if (fetched && sentence){

        updated_labels.current = updated_labels.current.sort((a, b) => {
            if(a.start > b.start){
                return 1;
            } else {
                return -1;
            }
        })
        
        let start = 0
        let x: Array<any> = []
        for (let j = 0; j < updated_labels.current.length; j++){
            if (updated_labels.current[j].start <= 1 && updated_labels.current[j].end > 0){
                x.push(j)
            }
        }

        let entities_per_index: Array<any> = [x]

        for(let i = 1; i < sentence.length; i++){
            if (updated_labels.current.map((val) => (val.end == i+1)).includes(true)) {
                order.push(sentence.slice(start, i+1).replace(/ /g,'\u00A0'));
                start = i+1;
            } else if (updated_labels.current.map((val) => (val.start == i+1)).includes(true)){
                order.push(sentence.slice(start, i).replace(/ /g,'\u00A0'));
                start = i;
            } else if (i == sentence.length - 1){
                order.push(sentence.slice(start, i+1).replace(/ /g,'\u00A0'));
            }

            let x: Array<any> = []
            for (let j = 0; j < updated_labels.current.length; j++){
                if (updated_labels.current[j].start <= i + 1 && updated_labels.current[j].end > i){
                    x.push(j)
                }
            }
            entities_per_index.push(x)
        }
        
        start = 0

        for(let i = 0; i < order.length; i++){
            const idx_1 = i
            let child: any = [<span key={`child${idx_1}--1`} className="whitespace-pre-line break-all w-min h-min text-sm cursor-text"> {order[idx_1].replace(/ /g,'\u00A0')} </span>]
            
            start = (start >= entities_per_index.length) ? entities_per_index.length - 1 : start

            for(let j = 0; j < entities_per_index[start].length; j++){
                const idx_0 = start
                const idx_2 = j
                const entity_type = updated_labels.current[entities_per_index[start][idx_2]]['type']

                child = [
                    <span key={`child${idx_1}-${idx_2}`} className="w-fit py-1 px-1 rounded-md relative bg-white text-justify" onClick={()=>{selected_labels.current[entities_per_index[idx_0][idx_2] as number] = !selected_labels.current[entities_per_index[idx_0][idx_2] as number]; setNullStr(nullStr.concat('?'))}}
                     style={{ border: (selected_labels.current[entities_per_index[idx_0][idx_2]]) ? `solid 2px ${stringToColour(entity_type)}BF` : `solid 2px ${stringToColour(entity_type)}70`, backgroundColor: (selected_labels.current[entities_per_index[idx_0][idx_2]]) ? `${stringToColour(entity_type)}AA` : `${stringToColour(entity_type)}70`}}>
                        {
                            (selected_labels.current[entities_per_index[idx_0][idx_2]] && (updated_labels.current[entities_per_index[idx_0][idx_2]]['end'] == idx_0 + order[idx_1].length))
                            ?
                            <button onClick={() => handleRemove(entities_per_index[idx_0][idx_2])} className="absolute z-[100] w-max h-max top-[-10px] text-gray-500">
                                <DeleteIcon className="h-[20px] w-[20px]"/>
                            </button>
                            : null
                        }
                        {child}
                        {
                        (updated_labels.current[entities_per_index[idx_0][idx_2]]['end'] == idx_0 + order[idx_1].length)
                        ?   
                        <span style={{userSelect: 'none'}} className="w-fit rounded-md bg-white/50 p-1">
                            {entity_type}
                        </span>
                        : null
                        }  
                    </span>
                ]
            }
            start = start + order[i].length
            array_spans.push(child)
        }
    }

    return (
        <div className="items-center flex flex-col gap-2 h-full w-full p-2 dark:bg-gray-900 dark:text-white">
            {
                (loading) ? <LoadingScreen/> : null
            }
            <div className="p-2 h-[5%] items-center justify-start flex w-full font-semibold">
                {'Sentence:'}
            </div>
            <span onMouseUp={()=>{
                const select: any = window.getSelection()
                const selected_string: String = select.toString()
                console.log(selected_string)
                const string_of_node = select?.anchorNode?.textContent.toString()
                
                if (adding && selected_string.length > 0 && tag != ''){
                    let add = true
                    let start = 0
                    
                    for(let i = 0; i < order.length; i++){
                        if(order[i] == string_of_node){
                            add = false
                            start = start + Math.min(select?.focusOffset,select?.anchorOffset)
                        } else {
                            start = (add) ? start + order[i].length : start
                        }
                    }
                    
                    handleTag(start + 1, start + selected_string.length, tag)
                    setAdding(false)
                }
            }} 
            className="h-[30%] border-gray-300 overflow-y-scroll
            border bg-gray-50 dark:bg-gray-800 rounded-md p-1 text-justify w-full font-normal">
                {
                    (editing) ? 
                    <form className="w-full h-full">   
                        <textarea onChange={(e) => {setSentence(e.target.value); setEdited(true)}} className="break-words h-full overflow-y-scroll text-start max-h-96 w-full text-sm text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" contentEditable={true} value={sentence}/>
                    </form>
                    : 
                    <div className="breal-all border overflow-y-scroll h-full border-gray-400 rounded-md p-2">
                        {
                            (order.length) ? array_spans : null
                        }
                    </div>
                }
            </span>
            <div className="p-2 h-[40%] items-start flex flex-col w-full font-normal gap-2">
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
                    <button onClick={() => handleAutoLabel()} className={"z-30 flex gap-1 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"}>
                            <PsychologyIcon className="h-[20px] w-[20px]"/>
                            {'AI-Suggestions'}
                    </button>
                    {labels}
                </div>
            </div>
            <div className="w-full h-fit">
                <div className="p-2 mt-5 items-center justify-start flex w-full font-semibold">
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