import React, { useEffect, useState, useRef, useCallback} from "react"
import AddIcon from '@mui/icons-material/Add';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { Dropdown } from 'flowbite-react'
import LoadingScreen from "../../LoadingScreen";

async function auto_label(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/distilbert-base-cased-distilled-squad",
		{
			headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_KEY as string}` },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
    console.log(result)
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

const QAViz = (props) => {
    
    const [paragraph, setParagraph] = useState<number>(0);
    const [question, setQuestion] = useState<number>(0);
    const [nullStr, setnullStr] = useState<string>('');
    
    const [fetched, setFetched] = useState<Boolean>(false);
    const [editingParagraph, setEditingParagraph] = useState<Boolean>(false);
    const [editingQuestion, setEditingQuestion] = useState<Boolean>(false);
    const [adding, setAdding] = useState<Boolean>(false);
    const [loading, setLoading]= useState<Boolean>(false)

    const updated_labels = useRef<Array<any>>([]);
    const keyId = useRef<String>('');

    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')

    const handleAutoLabel = () => {
        setLoading(true)
        auto_label({"inputs": {'context': updated_labels.current[paragraph]['context'], 'question': updated_labels.current[paragraph]['qas'][question]['question']}}).then(
            (res) => {
                if (res['score'] >= 0.0){
                    updated_labels.current[paragraph]['qas'][question]['answers'].push(
                        {
                            'text': res['answer'], 'answer_start': res['start']
                        }
                        )
                    }
                    props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current})
                    props.setSubmit(true)
                    setnullStr(`${nullStr}z`)
                    setLoading(false)
            }
        )
    }

    const addNewParagraph = () => {
        updated_labels.current.push({'qas': [{'answers': [], 'question': ''}], 'context': ''}) 
        props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current})
        props.setSubmit(true)
        setnullStr(`${nullStr}z`)            
    }

    const addNewQuestion = () => {
        updated_labels.current[paragraph]['qas'].push({'answers': [], 'question': ''})
        props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current})
        props.setSubmit(true)
        setnullStr(`${nullStr}z`)
    }

    const handleTag = (text, start) => {
        updated_labels.current[paragraph]['qas'][question]['answers'].push({'text': text, 'answer_start': start})
        props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current})
        props.setSubmit(true)
        setnullStr(`${nullStr}z`)
    }

    const getComments = async () => {
        fetch(`http://localhost:8000/get_tags?file=${props.keyId}`).then((res) => res.json()).then(setComments)
    }

    const handleRemove = (idx) => {

        updated_labels.current[paragraph]['qas'][question]['answers'].splice(idx, 1)

        props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current})
        props.setSubmit(true)
        setnullStr(`${nullStr}z`)
    }
    
    useEffect(() => {
        if(keyId.current != props.keyId) {
            fetch(`http://localhost:8000/get_labels?filename=${props.keyId}`)
            .then((res) => res.json())
            .then((res) => {
                updated_labels.current = res
                console.log(updated_labels.current)
                keyId.current = props.keyId
                setFetched(true)
                setParagraph(0)
                setQuestion(0)
                setnullStr(`${nullStr}z`)
            })
        }
        getComments()
    },[props.keyId, props.loading])
    
    var order: Array<any> = Array(0)
    var array_spans: Array<any> = Array(0)

    if (fetched && updated_labels.current && updated_labels.current[paragraph] && updated_labels.current[paragraph]['qas'][question]['answers']){
        updated_labels.current[paragraph]['qas'][question]['answers'] = updated_labels.current[paragraph]['qas'][question]['answers'].sort((a, b) => {
            if(a.answer_start > b.answer_start){
                return 1;
            } else {
                return -1;
            }
        })
        
        var start = 0
        var x: Array<any> = []
        for (var j = 0; j < updated_labels.current[paragraph]['qas'][question]['answers'].length; j++){
            if (updated_labels.current[paragraph]['qas'][question]['answers'][j].answer_start <= 0 && updated_labels.current[paragraph]['qas'][question]['answers'][j].answer_start  > 1-updated_labels.current[paragraph]['qas'][question]['answers'][j].text.length){
                x.push(j)
            }
        }

        var answers_per_index: Array<any> = [x]
        console.log(updated_labels.current[paragraph]['qas'][question]['answers'])
        for(var i = 1; i < updated_labels.current[paragraph]['context'].length; i++){
            if (updated_labels.current[paragraph]['qas'][question]['answers'].map((val) => (val.answer_start == i+1-val.text.length)).includes(true)) {
                order.push(updated_labels.current[paragraph]['context'].slice(start, i+1).replace(/ /g,'\u00A0'));
                start = i+1;
            } else if (updated_labels.current[paragraph]['qas'][question]['answers'].map((val) => (val.answer_start == i)).includes(true)){
                order.push(updated_labels.current[paragraph]['context'].slice(start, i).replace(/ /g,'\u00A0'));
                start = i;
            } else if (i == updated_labels.current[paragraph]['context'].length - 1){
                order.push(updated_labels.current[paragraph]['context'].slice(start, i+1).replace(/ /g,'\u00A0'));
            }

            var x: Array<any> = []
            for (var j = 0; j < updated_labels.current[paragraph]['qas'][question]['answers'].length; j++){
                if (updated_labels.current[paragraph]['qas'][question]['answers'][j].answer_start <= i + 1 && updated_labels.current[paragraph]['qas'][question]['answers'][j].answer_start > i - updated_labels.current[paragraph]['qas'][question]['answers'][j].text.length + 1 ){
                    x.push(j)
                }
            }
            answers_per_index.push(x)
        }
        
        start = 0

        for(var i = 0; i < order.length; i++){
            const idx_1 = i
            var child: any = [<span key={`child${idx_1}--1`} style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word', wordBreak: 'break-all'}} className="w-min h-min text-sm cursor-text leading-loose"> {order[idx_1].replace(/ /g,'\u00A0')} </span>]
            
            start = (start >= answers_per_index.length) ? answers_per_index.length - 1 : start

            for(var j = 0; j < answers_per_index[start].length; j++){
                const idx_0 = start
                const idx_2 = j
                const answer = updated_labels.current[paragraph]['qas'][question]['answers'][answers_per_index[idx_0][idx_2]]['text']

                child = [
                    <span key={`child${idx_1}-${idx_2}`} className="w-fit py-1 px-1 rounded-md relative bg-white text-justify" onClick={()=>{}}
                     style={{ border: `solid 2px ${stringToColour(answer)}BF`, backgroundColor: `${stringToColour(answer)}70`}}>
                        {child}
                    </span>
                ]
            }
            start = start + order[i].length
            array_spans.push(child)
        }
    }

    return (
        <>
            {
                (loading) ? <LoadingScreen/> : null
            }
            {
                (fetched) ?
                <div className={`${(adding) ? ' cursor-text' : ''} items-center flex flex-col gap-2 h-full w-full p-2 dark:bg-gray-900 dark:text-white`}>
                    <div className="h-[5%] gap-3 items-center justify-start flex w-full font-semibold">
                        <Dropdown
                            label="Paragraph"
                            size="xs"
                        >
                            <div className="h-48 overflow-y-scroll">
                                {
                                    updated_labels.current.map(
                                        (p, idx) => {
                                            return <Dropdown.Item key={`p_dd${idx}`} onClick={() => { setParagraph(idx) }}> {idx} </Dropdown.Item>       
                                } 
                                    )
                                }
                                <Dropdown.Item key={`p_dd_add_new`} onClick={() => { addNewParagraph() }}>{'Add...'}</Dropdown.Item>
                            </div>
                        </Dropdown>
                    </div>
                    <div className="w-full h-[40%] gap-2 flex justify-start items-center">
                        <span onMouseUp={()=>{
                            const select: any = window.getSelection()
                            const selected_string: String = select.toString()
                            const string_of_node = select?.anchorNode?.textContent.toString()
                            
                            if (adding && selected_string.length > 0){
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
                                
                                handleTag(selected_string, start)
                                setAdding(false)
                                setnullStr(`${nullStr}z`)
                            }
                        }} 
                        className="h-full border-gray-300 overflow-y-scroll
                        border bg-gray-50 dark:bg-gray-800 rounded-md p-1 text-justify w-full font-normal text-sm">
                            {
                                (editingParagraph) ? 
                                <form className="w-full h-full">   
                                    <textarea onChange={(e) => {updated_labels.current[paragraph]['context'] = e.target.value; props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current}); props.setSubmit(true); setnullStr(`${nullStr}z`)}} 
                                    className="break-words h-full overflow-y-scroll text-sm text-start max-h-96 w-full text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" contentEditable={true}
                                    value={updated_labels.current[paragraph]['context']}/>
                                </form>
                                : 
                                (order.length) ? array_spans : null
                            }
                        </span>
                        {
                            (props.admin) ?
                            <button onClick={() => {setEditingParagraph(!editingParagraph); ; props.enableLRshortcut.current = editingParagraph}} className={editingParagraph ? 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' : 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'}>
                                {editingParagraph ? 'Save' : 'Edit'}
                            </button>
                            : null
                        }
                    </div>
                    <div className="h-[5%] items-center justify-start flex w-full font-semibold">
                        <Dropdown
                            label="Question"
                            size="xs"
                        >
                            <div className="h-48 overflow-y-scroll">
                                {
                                    updated_labels.current[paragraph]['qas'].map(
                                        (p, idx) => {
                                            return <Dropdown.Item key={`q_dd${idx}`} onClick={() => { setQuestion(idx) }}> {idx} </Dropdown.Item>       
                                } 
                                    )
                                }
                                <Dropdown.Item key={`q_dd_add_new`} onClick={() => { addNewQuestion() }}> {'Add...'} </Dropdown.Item>
                            </div>
                        </Dropdown>
                    </div>
                    <div className="w-full h-[10%] gap-2 flex justify-start items-center">
                        <span 
                        className="h-[90%] border-gray-300 overflow-y-scroll
                        border bg-gray-50 dark:bg-gray-800 rounded-md p-1 text-justify w-full font-normal text-sm">
                            {
                                (editingQuestion) ? 
                                <form className="w-full h-full">   
                                    <textarea onChange={(e) => {updated_labels.current[paragraph]['qas'][question]['question'] = e.target.value; props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current}); props.setSubmit(true); setnullStr(`${nullStr}z`)}} 
                                    className="break-words h-full overflow-y-scroll text-sm text-start max-h-48 w-full text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" contentEditable={true}
                                    value={updated_labels.current[paragraph]['qas'][question]['question']}
                                    />
                                </form>
                                : 
                                <span className="break-words h-full overflow-y-scroll text-sm text-start max-h-48 w-full text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500">
                                    {updated_labels.current[paragraph]['qas'][question]['question']}
                                </span>
                            }
                        </span>
                        {
                            (props.admin) ?
                            <button onClick={() => {setEditingQuestion(!editingQuestion); props.enableLRshortcut.current = editingQuestion}} className={editingQuestion ? 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' : 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'}>
                                {editingQuestion ? 'Save' : 'Edit'}
                            </button>
                            : null
                        }
                    </div>
                    <div className="h-[20%] items-start flex flex-col w-full font-normal gap-2">
                        <div className="font-semibold">
                            {'Answers:'}
                        </div>
                        <div className="items-center justify-start flex-wrap flex h-[80%] overflow-scroll w-full font-normal gap-2 border border-gray-300 p-2 rounded-md">
                            {
                                <button onClick={() => setAdding(true)} className={"flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                                    <AddIcon className="h-[20px] w-[20px]"/>
                                    {'Add'}
                                </button>

                            }
                            <button onClick={() => handleAutoLabel()} className={"flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                                <PsychologyIcon className="h-[20px] w-[20px]"/>
                                {'AI-Suggested'}
                            </button>
                            {
                            updated_labels.current[paragraph]['qas'][question]['answers'].map(
                                (q, idx) => {return <span key={`answer${idx}-${paragraph}-${question}`} className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                                    {q['text']}
                                    <button onClick={()=>{ handleRemove(idx) }} className="inline-flex items-center p-0.5 ml-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                        <svg className="w-3.5 h-3.5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </span>}
                            )
                            }
                        </div>
                    </div>
                    {/* <div className="w-full h-[10%]">
                        <div className="p-2 items-center justify-start flex w-full font-semibold">
                            {'Comments:'}
                        </div>
                        <div className="flex-col justify-between">
                            <div className="w-full">
                                <div className="border overflow-scroll border-gray-300 rounded-md items-center h-[50px] p-1 flex gap-2">
                                    {
                                        (comments.length > 0) ?
                                        comments.map( (comnt) => 
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
                    </div> */}
                </div>
                :
                null
            }
        </>
    )
}

export default QAViz;