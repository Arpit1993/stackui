import React, { useEffect, useRef, useState } from "react"
import BranchPopup from "../BranchPopup"
import SlicePopup from "../SlicePopup";
import Editor from 'react-simple-code-editor';
import posthog from 'posthog-js'
import LoadingScreen from "../../../LoadingScreen"
import Slider from '@mui/material/Slider';
import DownloadIcon from '@mui/icons-material/Download';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import Datepicker from "react-tailwindcss-datepicker";
import { Tooltip } from "@mui/material";


const getbuttons = (variable, varFilter, setVarFilter, nullStr, setnullStr, n_var, name, n_buttons) => {
    const var_buttons : Array<any> = []

    for(var i = 0; i < n_buttons; i++){
        const cl = variable.sort()[i]
        
        if(varFilter[cl]){
            var_buttons.push(
                <ul key={`abc ${cl} ${name}`} className="w-full flex px-1 mb-1 mt-1">
                    <button  onClick={async ()=>{
                        var cf = varFilter
                        cf[cl] = !cf[cl]
                        setVarFilter(cf)
                        setnullStr(nullStr+'a')
                    }} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {`${cl} (${n_var[cl]})`}
                    </button>
                </ul>
            )
        } else {
            var_buttons.push(
                <ul key={`abc ${cl} ${name}`} className="w-full flex px-1 mb-1 mt-1">
                    <button  onClick={async ()=>{
                        var cf = varFilter
                        cf[cl] = !cf[cl]
                        setVarFilter(cf)
                        setnullStr(nullStr+'a')
                    }} className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                        {`${cl} (${n_var[cl]})`}
                    </button>
                </ul>
            )
        }
    }

    return var_buttons
}

const QAFilterPopup = (props) => {

    const [code, setCode] = useState( `def filter(datapoint):\n\t# python condition applied to each datapoint \n\treturn True\n`)
    const [schema, setSchema] = useState( `datapoint: dict\n\tkey: string\n\tnum_entities: string<int>\n\tentities: list<string>\n\tresolution: string\n\ttags: list<string>\n\tlabels: list<dict>:\n\t\t'0': entity\n\t\t'1': x\n\t\t'2': y\n\t\t'3': w\n\t\t'4': h`)
    const [query, setQuery] = useState(false)

    const [date, setDate] = useState({startDate: null, endDate: null});
    const [branch, setBranch] = useState(false)
    const [slice, setSlice] = useState(false)
    
    const [sliderAnswers, setSliderAnswers] = useState([0,100])
    const [sliderParagraphs, setSliderParagraphs] = useState([0,100])
    const [sliderQuestions, setSliderQuestion] = useState([0,100])

    const [n_tags, setNTags] = useState({})
    const [tags, setTags] = useState([])
    
    const [lenParagraph, setLenParagraph] = useState<number>(0)
    const [lenQuestion, setLenQuestion] = useState<number>(0)
    const [lenAnswer, setLenAnswer] = useState<number>(0)

    const [pSearch, setPSearch] = useState<string>('')
    const [qSearch, setQSearch] = useState<string>('')
    const [aSearch, setASearch] = useState<string>('')

    const [tagFilter, setTagFilter] = useState({})
    
    const [time, setTime] = useState(true)
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)

    // weird hack to make the checkboxes bg-color change when setState, otherwise state remains the same
    // TODO
    const [nullStr, setnullStr] = useState('')
    const ref = useRef(null)

    const controller = new AbortController();
    const { signal } = controller;


    const handleApplyFilter = async () => {
        setLoading(true)
        props.setFiltering('y')

        var filters = {}
        var idx = 0

        for(var i = 0; i < Object.keys(tagFilter).length; i++){
            if (Object.values(tagFilter)[i]){
                filters[idx] =
                    {
                        'tag': Object.keys(tagFilter)[i]
                    }
                idx+=1
            }
        }

        if(props.txt.length > 0){
            filters[idx] = {
                'name': props.txt
            }
            idx+=1
        }

        if(pSearch.length > 0){
            filters[idx] = {
                'p_search': pSearch
            }
            idx+=1
        }

        if(qSearch.length > 0){
            filters[idx] = {
                'q_search': qSearch
            }
            idx+=1
        }

        if(aSearch.length > 0){
            filters[idx] = {
                'a_search': aSearch
            }
            idx+=1
        }

        if(sliderAnswers[0] > 0 || sliderAnswers[1] < 100){
            filters[idx] = {
                'ans_len': [Math.floor(sliderAnswers[0] * lenAnswer / 100),Math.floor(sliderAnswers[1] * lenAnswer / 100)]
            }
            idx+=1
        }

        if(sliderQuestions[0] > 0 || sliderQuestions[1] < 100){
            filters[idx] = {
                'q_len': [Math.floor(sliderQuestions[0] * lenQuestion / 100),Math.floor(sliderQuestions[1] * lenQuestion / 100)]
            }
            idx+=1
        }

        if(sliderParagraphs[0] > 0 || sliderParagraphs[1] < 100){
            filters[idx] = {
                'par_len': [Math.floor(sliderParagraphs[0] * lenParagraph / 100),Math.floor(sliderParagraphs[1] * lenParagraph / 100)]
            }
            idx+=1
        }

        if(date.endDate && date.startDate){
            filters[idx] = {
                'date': [date.startDate.replace('-','/'), date.endDate.replace('-','/')]
            }
            idx+=1
        }

        const data = JSON.stringify(filters)

        await fetch('http://localhost:8000/set_filter/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
        )

        posthog.capture('Applied filter', { property: 'value' })
    
        props.setFiltering('z')
        props.setPage(0)
        setTime(!time)
        setLoading(false)
    }

    const handleResetFilter = async () => {
        setLoading(true)
        props.setFiltering('y')

        await fetch('http://localhost:8000/reset_filters/')
        .then(() => props.setFiltering('w')).then(
            () =>{

                const tFilter = tagFilter
                for(var i = 0; i < Object.keys(tFilter).length; i++){
                    tFilter[Object.keys(tFilter)[i]] = false
                }
                
                setTagFilter(tFilter)
                setSliderAnswers([0,100])
                setSliderParagraphs([0,100])
                setSliderQuestion([0,100])
                setDate({startDate: null, endDate: null})
                setnullStr('')
            }
        )

        props.setFiltering('z')
        setTime(!time)
        setLoading(false)
    }

    useEffect( () => {
        const getMetadata = async () => {
            await fetch('http://localhost:8000/schema_metadata').then((res) => res.json()).then(
                (res) =>
                { 
                    // TODO
                    setLenAnswer(Math.max(...res.answer_lengths))
                    setLenParagraph(Math.max(...res.paragraph_lengths))
                    setLenQuestion(Math.max(...res.question_lengths))
                    
                    setTags(res.tags)
                    setNTags(res.n_tags)

                    var tFilters: any = {}
                    for(var i = 0; i < res.tags.length; i++){
                        if(tagFilter[res.tags[i]]){
                            tFilters[res.tags[i]] = true
                        } else {
                            tFilters[res.tags[i]] = false
                        }
                    }
                    setTagFilter(tFilters)
                }
            )

            if(props.callFilter) {
                await handleApplyFilter()
                props.setCallFilter(false)
            }
        }
        getMetadata()

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
            //   props.setPopup(false)
            //   props.shortcuts.current = true
            }
          }


        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.callFilter, time])

    var tag_buttons : Array<any> = getbuttons(tags, tagFilter, setTagFilter, nullStr, setnullStr, n_tags,'tag', tags.length)

    return (
        <>
            {
                loading ? <LoadingScreen key={'ldscyoloflterppp'} /> : <></>
            }
            {
                branch ? <BranchPopup ref_={ref} key={'brpp'} setPopup={setBranch}/> : <></>
            }
            {
                slice ? <SlicePopup ref_={ref} key={'slicpp'} setPopup={setSlice}/> : <></>
            }
            <div key={"flterpp"} ref={ref} className="bg-white absolute z-40 top-16 rounded-lg dark:bg-gray-900 w-[80%] h-[250px] border-[0.5px] border-gray-500">
                <div className="w-full justify-between flex h-8">
                    <div className="px-2">
                        <button onClick={() => {
                        props.shortcuts.current = true
                        props.setPopup(false)
                        }} className='text-xs px-1 w-[15px] h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                    </div>

                    <div className="px-2">
                        <button onClick={() => setQuery(!query)} className='text-xs text-center text-white font-base w-[120px] h-[20px] bg-blue-600 hover:bg-blue-800 rounded-full'>
                            structured query
                        </button>
                    </div>
                </div>
                {
                    query ? 
                    <div className="flex w-full h-[150px] justify-between gap-2 p-1">
                        <Editor
                            className="border border-gray-500 overflow-scroll rounded-md w-1/2 bg-white text-black dark:bg-gray-800 dark:text-yellow-400"
                            value={code}
                            onValueChange={setCode}
                            highlight={(code) => highlight(code, languages.python)}
                            padding={10}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 12,
                            }}
                        />
                        <div className="border border-gray-500 rounded-md w-1/2 flex flex-col"> 
                            <div className="dark:bg-gray-600 px-1 w-full flex flex-col justify-center text-sm rounded-t-md bg-gray-100 border-b border-gray-500 h-[20px]">
                                schema
                            </div>
                            <div className="w-full h-full overflow-y-scroll text-xs">
                                <pre>
                                    {schema}
                                </pre>
                            </div>        
                        </div>
                    </div>
                    :
                    <div className="flex w-full overflow-x-scroll mb-[-400px] pb-[400px] justify-center gap-2 p-1">
                        <div> 
                            <div className="text-sm">
                                Paragraphs
                            </div>
                            <input onChange={(e) => {setPSearch(e.target.value)}} placeholder="paragraph search" value={pSearch}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                            <div className="text-sm">
                                Questions
                            </div>
                            <div className="dark:text-white">
                                <input onChange={(e) => {setQSearch(e.target.value)}} placeholder="question search" value={qSearch}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                            </div>
                        </div>
                        <div className="h-[120px] w-[200px]">
                            <div className="text-sm">
                                Answers
                            </div>
                            <div className="dark:text-white">
                                <input onChange={(e) => {setASearch(e.target.value)}} placeholder="answer search" value={aSearch}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                            </div>
                            <div className="text-sm mt-[6px]">
                                Paragraph length
                            </div>
                            <div className="w-[200px] h-8 border rounded-md shadow-inner border-gray-300">
                                {/* <div className="flex gap-1 text-xs px-1 w-[198px] text-center rounded-t-md dark:bg-gray-900 bg-gray-200">
                                </div> */}
                                <div className="w-full px-5">
                                    <Slider
                                        getAriaLabel={() => 'Chars per paragraph'}
                                        value={sliderParagraphs}
                                        onChange={(event: Event, newValue: number | number[]) => {
                                            setSliderParagraphs(newValue as number[]);
                                        }}
                                        valueLabelFormat={(x)=>{
                                            return `${Math.floor(lenParagraph * x/100)} chars`
                                        }}
                                        valueLabelDisplay="auto"
                                        getAriaValueText={()=>{return ''}}
                                        />
                                </div>
                            </div>
                        </div>
                        <div className="h-[120px] w-[200px]">
                            <div className="text-sm">
                                Question length
                            </div>
                            <div className="w-[200px] h-8 border rounded-md shadow-inner border-gray-300">
                                {/* <div className="flex gap-1 text-xs px-1 w-[198px] text-center rounded-t-md dark:bg-gray-900 bg-gray-200">
                                </div> */}
                                <div className="w-full px-5">
                                    <Slider
                                        getAriaLabel={() => 'Chars per question'}
                                        value={sliderQuestions}
                                        onChange={(event: Event, newValue: number | number[]) => {
                                            setSliderQuestion(newValue as number[]);
                                        }}
                                        valueLabelFormat={(x)=>{
                                            return `${Math.floor(lenQuestion * x/100)} chars`
                                        }}
                                        valueLabelDisplay="auto"
                                        getAriaValueText={()=>{return ''}}
                                        />
                                </div>
                            </div>
                            <div className="mt-[15px] text-sm">
                                Answer length
                            </div>
                            <div className="w-[200px] h-8 border rounded-md shadow-inner border-gray-300">
                                {/* <div className="flex gap-1 text-xs px-1 w-[198px] text-center rounded-t-md dark:bg-gray-900 bg-gray-200">
                                </div> */}
                                <div className="w-full px-5">
                                    <Slider
                                        getAriaLabel={() => 'Chars per Answer'}
                                        value={sliderAnswers}
                                        onChange={(event: Event, newValue: number | number[]) => {
                                            setSliderAnswers(newValue as number[]);
                                        }}
                                        valueLabelFormat={(x)=>{
                                            return `${Math.floor(lenAnswer * x/100)} chars`
                                        }}
                                        valueLabelDisplay="auto"
                                        getAriaValueText={()=>{return ''}}
                                        />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-sm">
                                Comments
                            </div>
                            <div className="h-[100px] w-[200px] border rounded-md shadow-inner border-gray-300">
                                <div className="overflow-y-scroll h-[98px]">
                                    {tag_buttons}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm">
                                Date of change
                            </div>
                            <div className="relative w-[300px] h-[100px] border rounded-md shadow-inner border-gray-300">
                                <div className="absolute w-full p-8 gap-3">
                                    <Datepicker
                                        useRange={false}
                                        separator={"to"}
                                        value={date}
                                        onChange={setDate}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                
                <div className="flex justify-around">
                    <div className="px-5 py-4 justify-start">
                        <Tooltip title={'Creates a separate branch with the query results'} placement="bottom">
                            <button onClick={() => {setBranch(true);}} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Branch
                            </button>
                        </Tooltip>

                        <Tooltip title={'Groups the query results under a slice'} placement="bottom">
                            <button onClick={() => {setSlice(true)}} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Slice
                            </button>
                        </Tooltip>
                    </div>
                    <div className="px-5 py-4 flex justify-end gap-2">
                        <Tooltip title={'Resets query to full dataset'} placement="bottom">
                            <button onClick={() => handleResetFilter()} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                Reset
                            </button>
                        </Tooltip>
                        <button onClick={() => handleApplyFilter()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Apply
                        </button>
                        <button onClick={() => {
                            if (downloading) {
                                controller.abort()
                                setDownloading(false)
                            } else {
                                setDownloading(true)
                                fetch('http://localhost:8000/download_api', { signal })
                                .then( res => res.blob() )
                                .then( blob => {
                                  var file = window.URL.createObjectURL(blob);
                                  window.location.assign(file);
                                  setDownloading(false)
                                });
                            }
                        }} className="flex gap-2 items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            <DownloadIcon className="w-5 h-5"/>
                            {
                                downloading ? 'Cancel' : 'Download'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QAFilterPopup