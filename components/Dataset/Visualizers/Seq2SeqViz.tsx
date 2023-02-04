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

const Seq2SeqViz = (props) => {
    
    const [nullStr, setnullStr] = useState<string>('');
    const [editingParagraph, setEditingParagraph] = useState<Boolean>(false);
    const [editingQuestion, setEditingQuestion] = useState<Boolean>(false);
   
    const updated_labels = useRef<Array<any>>([]);
    const keyId = useRef<String>('');

    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')

    const getComments = async () => {
        fetch(`http://localhost:8000/get_tags?file=${props.keyId}`).then((res) => res.json()).then(setComments)
    }


    useEffect(() => {
        if(keyId.current != props.keyId) {
            fetch(`http://localhost:8000/get_labels?filename=${props.keyId}`)
            .then((res) => res.json())
            .then((res) => {
                updated_labels.current = res
                keyId.current = props.keyId
                setnullStr(`${nullStr}z`)
            })
        }
        getComments()
    },[props.keyId])
    

    return (
        <div className={`items-center flex flex-col gap-2 h-full w-full p-2 dark:bg-gray-900 dark:text-white`}>
            <div className="w-full h-[40%] gap-2 flex justify-start items-center">
                <span onMouseEnter={()=>{props.enableLRshortcut.current = false}}
                onMouseLeave={()=>{props.enableLRshortcut.current = true}}
                className="h-[90%] overflow-y-scroll
                 bg-gray-50 dark:bg-gray-800 rounded-md p-1 text-justify w-full font-normal text-sm">
                    <form className="w-full h-full">   
                        <textarea onChange={(e) => {updated_labels.current['key'] = e.target.value; props.setNewKey(e.target.value); props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current}); props.setSubmit(true); setnullStr(`${nullStr}z`)}} 
                        className="break-words h-full overflow-y-scroll text-sm text-start max-h-48 w-full text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" contentEditable={true}
                        value={updated_labels.current['key']}
                        />
                    </form>
                </span>
            </div>
            <div className="w-full h-[40%] gap-2 flex justify-start items-center">
                <span onMouseEnter={()=>{props.enableLRshortcut.current = false}}
                onMouseLeave={()=>{props.enableLRshortcut.current = true}}
                className="h-[90%] overflow-y-scroll
                bg-gray-50 dark:bg-gray-800 rounded-md p-1 text-justify w-full font-normal text-sm"> 
                    <form className="w-full h-full">   
                        <textarea onChange={(e) => {updated_labels.current['res'] = e.target.value; props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current}); props.setSubmit(true); setnullStr(`${nullStr}z`)}} 
                        className="break-words h-full overflow-y-scroll text-sm text-start max-h-48 w-full text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" contentEditable={true}
                        value={updated_labels.current['res']}
                        />
                    </form>
                </span>
            </div>
        </div>
    )
}

export default Seq2SeqViz;