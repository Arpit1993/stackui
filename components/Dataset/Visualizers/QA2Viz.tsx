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

const QA2Viz = (props) => {
    
    const [nullStr, setnullStr] = useState<string>('');
    
    const [fetched, setFetched] = useState<Boolean>(false);
    const [editingParagraph, setEditingParagraph] = useState<Boolean>(false);
    const [adding, setAdding] = useState<Boolean>(false);
    const [loading, setLoading]= useState<Boolean>(false)

    const updated_labels = useRef<Array<any>>([]);
    const keyId = useRef<String>('');
    const inside = useRef<Boolean>(false);

    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')

    const handleAutoLabel = () => {
        setLoading(true)
        auto_label({"inputs": {'context': updated_labels.current['paragraph'], 'question': updated_labels.current['question']}}).then(
            (res) => {
                if (res['score'] >= 0.0){
                    updated_labels.current['answers'].push(
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

    const handleTag = (text, start) => {
        updated_labels.current['answers'].push({'text': text, 'answer_start': start})
        props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current})
        props.setSubmit(true)
        setnullStr(`${nullStr}z`)
    }

    const getComments = async () => {
        fetch(`http://localhost:8000/get_tags?file=${props.keyId}`).then((res) => res.json()).then(setComments)
    }

    const handleRemove = (idx) => {

        updated_labels.current['answers'].splice(idx, 1)

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
                setnullStr(`${nullStr}z`)
            })
        }
        getComments()
    },[props.keyId, props.loading])
    
    var order: Array<any> = Array(0)
    var array_spans: Array<any> = Array(0)

    if (fetched && updated_labels.current){
        updated_labels.current['answers'] = updated_labels.current['answers'].sort((a, b) => {
            if(a.answer_start > b.answer_start){
                return 1;
            } else {
                return -1;
            }
        })
        
        var start = 0
        var x: Array<any> = []
        for (var j = 0; j < updated_labels.current['answers'].length; j++){
            if (updated_labels.current['answers'][j].answer_start <= 0 && updated_labels.current['answers'][j].answer_start  > 1-updated_labels.current['answers'][j].text.length){
                x.push(j)
            }
        }

        var answers_per_index: Array<any> = [x]
        console.log(updated_labels.current['answers'])
        for(var i = 1; i < updated_labels.current['paragraph'].length; i++){
            if (updated_labels.current['answers'].map((val) => (val.answer_start == i+1-val.text.length)).includes(true)) {
                order.push(updated_labels.current['paragraph'].slice(start, i+1).replace(/ /g,'\u00A0'));
                start = i+1;
            } else if (updated_labels.current['answers'].map((val) => (val.answer_start == i)).includes(true)){
                order.push(updated_labels.current['paragraph'].slice(start, i).replace(/ /g,'\u00A0'));
                start = i;
            } else if (i == updated_labels.current['paragraph'].length - 1){
                order.push(updated_labels.current['paragraph'].slice(start, i+1).replace(/ /g,'\u00A0'));
            }

            var x: Array<any> = []
            for (var j = 0; j < updated_labels.current['answers'].length; j++){
                if (updated_labels.current['answers'][j].answer_start <= i + 1 && updated_labels.current['answers'][j].answer_start > i - updated_labels.current['answers'][j].text.length + 1 ){
                    x.push(j)
                }
            }
            answers_per_index.push(x)
        }
        
        start = 0

        for(var i = 0; i < order.length; i++){
            const idx_1 = i
            var child: any = [
            <span key={`child${idx_1}--1`} 
            className="whitespace-pre-line break-all w-min h-min text-sm cursor-text"> 
                {order[idx_1].replace(/ /g,'\u00A0')} 
            </span>]
            start = (start >= answers_per_index.length) ? answers_per_index.length - 1 : start

            for(var j = 0; j < answers_per_index[start].length; j++){
                const idx_0 = start
                const idx_2 = j
                const answer = updated_labels.current['answers'][answers_per_index[idx_0][idx_2]]['text']

                child = [
                    <span key={`child${idx_1}-${idx_2}`} className="py-1 px-1 rounded-md bg-white" onClick={()=>{}}
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
                (fetched) ?
                <div 
                onMouseDown={()=>{props.enableLRshortcut.current = (inside.current) ? false : true}}
                className={`${(adding) ? ' cursor-text' : ''} p-4 items-center flex flex-col gap-2 h-full w-full dark:bg-gray-900 dark:text-white`}>
                    <div className="w-full h-[40%] gap-2 flex justify-start items-center">
                        <span onMouseEnter={()=>{props.enableLRshortcut.current = false}}
                            onMouseLeave={()=>{props.enableLRshortcut.current = false}} 
                            onMouseUp={()=>{
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
                        className="h-full overflow-y-scroll rounded-md p-1 text-justify w-full font-normal text-sm">
                            {
                                (editingParagraph) ? 
                                <form className="w-full h-full">   
                                    <textarea onChange={(e) => {updated_labels.current['paragraph'] = e.target.value; props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current}); props.setSubmit(true); setnullStr(`${nullStr}z`)}} 
                                    className="h-full overflow-y-scroll border  border-gray-400 text-sm text-start max-h-96 w-full text-gray-900 rounded-md bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" contentEditable={true}
                                    value={updated_labels.current['paragraph']}/>
                                </form>
                                : 
                                <div className="breal-all border border-gray-300 bg-gray-50 overflow-y-scroll h-full rounded-md p-2">
                                    {
                                        (order.length) ? array_spans : null
                                    }
                                </div>
                            }
                        </span>
                    </div>
                    <div className="h-[5%] mt-2 gap-3 items-center justify-start flex w-full font-semibold">
                        {
                            <button onClick={() => {setEditingParagraph(!editingParagraph); ; props.enableLRshortcut.current = editingParagraph}} className={editingParagraph ? 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' : 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'}>
                                {editingParagraph ? 'Save' : 'Edit'}
                            </button>
                        }
                    </div>
                    <div className="w-full h-[20%] gap-2 flex justify-start items-center">
                        <span 
                        onMouseEnter={()=>{inside.current = true}}
                        onMouseLeave={()=>{inside.current = false}}
                        
                        className="h-full overflow-y-scroll rounded-md p-1 text-justify w-full font-normal text-sm">
                            {
                                <form className="w-full h-max">   
                                    <textarea onChange={(e) => {updated_labels.current['question'] = e.target.value; props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current}); props.setSubmit(true); setnullStr(`${nullStr}z`)}} 
                                    className="h-max overflow-y-scroll text-sm text-start max-h-48 w-full text-gray-900 border  border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" contentEditable={true}
                                    value={updated_labels.current['question']}
                                    />
                                </form>
                            }
                        </span>
                    </div>
                    <div className="h-[20%] items-start flex flex-col w-full font-normal gap-2">
                        <div className="font-semibold">
                            {
                                'Answers:'
                            }
                        </div>
                        <div className="items-center justify-start flex-wrap flex overflow-scroll w-full font-normal gap-2 border border-gray-300 p-2 rounded-md">
                            {
                                <button onClick={() => setAdding(true)} className={"flex gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                                    <AddIcon className="h-[20px] w-[20px]"/>
                                    {'Add'}
                                </button>

                            }
                            <button onClick={() => handleAutoLabel()} className={"flex items-center gap-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                                <PsychologyIcon className="h-[20px] w-[20px]"/>
                                {'AI-Suggested'}
                                {
                                    (loading) ?
                                        <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                    :
                                    null
                                }
                            </button>
                            {
                            updated_labels.current['answers'].map(
                                (q, idx) => {return <span key={`answer${idx}`} className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
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

export default QA2Viz;