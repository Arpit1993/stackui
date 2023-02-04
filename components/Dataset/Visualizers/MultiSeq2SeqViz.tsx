import React, { useEffect, useState, useRef, useCallback} from "react"
import AddIcon from '@mui/icons-material/Add';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LoadingScreen from "../../LoadingScreen";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

function useOutsideAlerter(ref, setEditing, updated_labels, nullStr, setnullStr) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            setEditing(() => {
                return Array(updated_labels.current['keys'].length).fill(false)
            })
            setnullStr(`${nullStr}z`)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

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

const MultiSeq2SeqViz = (props) => {
    
    const [nullStr, setnullStr] = useState<string>('');
    const [editing, setEditing] = useState<Array<Boolean>>([]);
   
    const updated_labels = useRef<Array<any>>([]);
    const keyId = useRef<String>('');

    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')

    const getComments = async () => {
        fetch(`http://localhost:8000/get_tags?file=${props.keyId}`).then((res) => res.json()).then(setComments)
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setEditing, updated_labels, nullStr, setnullStr);

    useEffect(() => {
        if(keyId.current != props.keyId) {
            console.log(props.keyId)
            console.log(keyId.current)
            fetch(`http://localhost:8000/get_labels?filename=${props.keyId}`)
            .then((res) => res.json())
            .then((res) => {
                updated_labels.current = res
                keyId.current = props.keyId
                setEditing(() => {
                    return Array(updated_labels.current['keys'].length).fill(false)
                })
                setnullStr(`${nullStr}z`)
            })
        }
        getComments()
    },[props.keyId])
    
    return (
        <div className={`items-center flex gap-2 h-full w-full p-2 dark:bg-gray-900 dark:text-white`}>
            <div className="w-[60%] h-full justify-start items-center">
                <div className="font-semibold h-[5%]">
                    {'Response:'}
                </div>
                <span onMouseEnter={()=>{props.enableLRshortcut.current = false}}
                onMouseLeave={()=>{props.enableLRshortcut.current = true}}
                onMouseDown={() => {
                    setEditing(()=>{
                        var arr_ref = Array(updated_labels.current['keys'].length).fill(false)
                        return arr_ref
                    }); setnullStr(nullStr.concat('w'))
                }}
                className="h-[95%] flex overflow-y-scroll
                p-1 text-justify w-full font-normal text-sm"> 
                    <form className="w-full h-full">   
                        <textarea onChange={(e) => {updated_labels.current['res'] = e.target.value; props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current}); props.setSubmit(true); setnullStr(`${nullStr}z`)}} 
                        className="break-words  drop-shadow-md resize-none h-full overflow-y-scroll border border-gray-300  dark:border-gray-700 text-sm text-start w-full text-gray-900 rounded-md bg-white focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" contentEditable={true}
                        value={updated_labels.current['res']}
                        />
                    </form>
                </span>
            </div>
            <div className="w-[40%] h-full justify-start items-center">
                <span onMouseEnter={()=>{props.enableLRshortcut.current = false}}
                onMouseLeave={()=>{props.enableLRshortcut.current = true}}
                className=" h-full flex flex-col gap-2 overflow-y-scroll
                rounded-md p-1 text-justify w-full font-normal text-sm"> 
                    {
                        (updated_labels.current['keys'].length > 0) ?
                        updated_labels.current['keys'].map(
                            (k,i) => {
                                return <>
                                <div className="font-semibold">
                                    {`Context: ${i}`}
                                </div>
                                {
                                    (!editing[i]) ?
                                    <article 
                                    
                                    onMouseDown={() => {
                                        setEditing(()=>{
                                            var arr_ref = Array(updated_labels.current['keys'].length).fill(false)
                                            arr_ref[i] = true
                                            return arr_ref
                                        }); setnullStr(nullStr.concat('w'))
                                    }} className="prose drop-shadow-md border border-gray-300 dark:border-gray-700 p-2 h-full overflow-y-scroll text-sm text-start w-full text-gray-900 rounded-md bg-white focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {updated_labels.current['keys'][i]}
                                        </ReactMarkdown>                  
                                    </article>
                                    :
                                    <form key={`ref for ${i}`} className="w-full h-full">   
                                    <textarea onChange={(e) => {updated_labels.current['keys'][i] = e.target.value; props.setnewLabels({'keyId': props.keyId, 'label': updated_labels.current}); props.setSubmit(true); setnullStr(`${nullStr}z`)}} 
                                    className="break-words drop-shadow-md h-full resize-none overflow-y-scroll text-sm text-start w-full text-gray-900 rounded-md bg-white focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" contentEditable={true}
                                    value={updated_labels.current['keys'][i]}
                                    />
                                    </form>
                                }
                                </>
                            })
                        : null
                    }
                </span>
            </div>
        </div>
    )
}

export default MultiSeq2SeqViz;