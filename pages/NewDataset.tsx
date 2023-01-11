import React from "react"
import { useState } from "react"
import LoadingScreen from "../components/LoadingScreen"
import FormData from "form-data";
import DropdownSchema from "../components/Dataset/Items/DropdownSchema";
import posthog from 'posthog-js'
import { Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function NewDatasets() {        

    const [loading , setLoading ] = useState<Boolean>(false)
    const [uri , setURI ] = useState<String>('local')
    const [storage , setStorage ] = useState<String>('local')
    const [name, setName] = useState<String>('My Dataset')

    const [file, setFile] = useState(null)
    const [schema, setSchema] = useState<String>('Select...')
    const [accessKey, setAccessKey] = useState<String>('')
    const [secretKey, setsecretKey] = useState<String>('')
    const [region, setRegion] = useState<String>('us-east-1')
    const [failed, setFailed] = useState<Boolean>(false)

    const handleKey1Change = (event) => {
        setAccessKey(event.target.value)
    }

    const handleKey2Change = (event) => {
        setsecretKey(event.target.value)
    }

    const handleKey3Change = (event) => {
        setRegion(event.target.value)
    }
    
    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleURIChange = (event) => {
        setURI(event.target.value)
        if (event.target.value.includes('gs://')) {
            setStorage('gs')
        } else if (event.target.value.includes('s3://')) {
            setStorage('s3')
        }
    }

    const handleSubmit = async () => {    
        if (uri.length > 0){
            setLoading(true)

            if (storage == 'gs'){
                const data = new FormData();
                data.append(
                    "file",
                    file,
                    file.name
                )
                const reqOptions = {
                    method: 'POST',
                    body: data
                }
                const response2 = await fetch('http://localhost:8000/init_gskey/', reqOptions)
            }

            var tmp_schema: String = ''
            if (schema == 'Select...'){
                tmp_schema = 'files'
            } else {
                tmp_schema = schema
            }

            var data = JSON.stringify({"uri": uri, "name": name,"key1": accessKey, "key2": secretKey, "key3": region, "schema": tmp_schema})
            
            const response = await fetch('http://localhost:8000/init_web/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
            ).then((res) => res.json()).then(
                (res) => {
                    if (res.success) {
                        posthog.capture('Added a dataset and succeeded', { property: 'value' })
                        window.location.href='/dataset/'.concat(encodeURIComponent(name.toString()));
                    } else {
                        posthog.capture('Added a dataset and failed', { property: 'value' })
                        setLoading(false)
                        setFailed(true)
                    }
                }
            )
        }
    }

    const handleFileChange = async (e) => {
        setFile(e.target.files[0])
    }

    const awsKeys = (storage == 's3') ? [
        <div key={'awk'}>
            <form className="shadow-md rounded w-[320px]">
                <label className="block text-gray-700 text-base mt-2"> 
                    <div className="">
                        <input onChange={handleKey1Change} onInput={handleKey1Change}
                        className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="AWS Access Key Id" type="password" />   
                    </div>
                </label>
            </form>

            <form className="shadow-md rounded w-[320px] mt-2">
                <label className="block text-gray-700 text-base"> 
                    <div className="">
                        <input onChange={handleKey2Change}  onInput={handleKey2Change}
                        className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="AWS Secret Access Key" type="password" />   
                    </div>
                </label>
            </form>

            <form className="shadow-md rounded w-[320px] mt-2">
                <label className="block text-gray-700 text-base"> 
                    <div className="">
                        <input onChange={handleKey3Change} onInput={handleKey3Change}
                        className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="AWS Region (default us-east-1)" type="password" />   
                    </div>
                </label>
            </form>
        </div>
    ] : [<></>]

    const gsKeys = (storage == 'gs') ? [
        <div className="w-[400px]" key={'gck'}>
            <form className="flex justify-center p-2">
                    <label className="p-2 flex flex-col justify-center items-center w-full h-52 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                            <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <p className="mb-2 text-base text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> upload key file from GS </p>
                        </div>
                        <input onChange={handleFileChange} onInput={handleFileChange} id="dropzone-file" type="file" className="hidden" />
                    </label>
                </form>
        </div>
    ] : [<></>]

    var placehoder = ""
    var instructions = ""
    var tooltip_msg = ""
    var instruction_link = "https://stackai.gitbook.io/stack-beta-release/"

    if (storage == 's3'){
        placehoder = "e.g. s3://bucket/dataset"
        instructions = 'Please create an IAM user with AmazonS3FullAccess and add your keys'
        tooltip_msg = "This is the uri of your bucket e.g. s3://bucket/dataset"
        instruction_link = "https://stackai.gitbook.io/stack-beta-release/connect-to-cloud/aws-s3-bucket"
    } else if (storage == 'gs'){
        placehoder = "e.g. gs://bucket/dataset"
        instructions = 'Please create an Service Account with Storage Admin and add your keys'
        tooltip_msg = "This is the uri of your bucket e.g. gs://bucket/dataset"
        instruction_link = "https://stackai.gitbook.io/stack-beta-release/connect-to-cloud/google-cloud-storage"
    } else {
        placehoder = "e.g. path/relative/to/home"
        tooltip_msg = "This is a directory and can be relative to your home path\nExample: /Users/[Your user]/[PATH TO YOUR DATASET]"
        instructions = 'Please use directories relative to your home path'
        instruction_link = "https://stackai.gitbook.io/stack-beta-release/connect-to-local-storage"
    }
    

    const SelectForm = [
        <div key={'sfff'} className='flex justify-center mt-5'>
            <button onClick={()=>setStorage('local')} className={storage=='local' ? "py-2 px-4 text-sm font-body text-gray-900 bg-gray-100 rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" : "py-2 px-4 text-sm font-body text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"}> Local </button>
            <button onClick={()=>setStorage('s3')} className={storage=='s3' ? "py-2 px-4 text-sm font-body text-gray-900 bg-gray-100 border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" : "py-2 px-4 text-sm font-body text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"}> S3 </button>
            <button onClick={()=>setStorage('gs')} className={storage=='gs' ? "py-2 px-4 text-sm font-body text-gray-900 bg-gray-100 rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" : "py-2 px-4 text-sm font-body text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"}> GCS </button>
        </div>
    ]
    
    const InputForm = [
            <div className="flex"  key={'ip'}>
                <div className="p-5 mt-5 mb-5 w-[1000px] h-[600px] justify-between flex flex-col">    
                    
                    <div>

                        <div className="mb-2 flex justify-center w-full">
                            <form className="flex justify-center w-[560px]">
                                <div className="block mb-2 w-[160px] text-sm p-3 font-body text-gray-900 dark:text-gray-300">
                                    Dataset name:
                                </div>
                                <label className="block text-gray-700 text-sm w-[400px]"> 
                                    <div className="">
                                        <input onChange={handleNameChange} onInput={handleNameChange}
                                        className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="e.g. My Dataset" type="text" />   
                                    </div>
                                </label>
                            </form>
                        </div>

                        <div className="mb-5 flex justify-center">
                            <form className="flex justify-self-center w-[560px]">
                                <div className="block mb-2 w-[160px] text-sm p-3 font-body text-gray-900 dark:text-gray-300">
                                    Dataset path or URI: 
                                </div>
                                <label className="block text-gray-700 text-sm w-[400px]"> 
                                    <div className="">
                                    <Tooltip title={tooltip_msg} placement="bottom">
                                        <input  onChange={handleURIChange} onInput={handleURIChange}
                                        className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder={placehoder} type="text" />   
                                    </Tooltip>
                                    </div>
                                </label>
                            </form>
                        </div>

                        <div className="flex justify-center mt-5" >
                            <DropdownSchema schema={schema} setSchema={setSchema} />
                        </div>

                        <a className="text-base flex justify-center dark:text-white underline mt-2 
                        text-blue-500 hover:underline hover:text-gray-500" 
                        href={instruction_link}>
                            {instructions}
                        </a>

                        <div className="flex justify-center">
                            {gsKeys}
                            {awsKeys}
                        </div>
                    </div>

                    <div className="flex justify-end w-full mb-5">
                        <div className="flex justify-center">
                            <button onClick={() => handleSubmit()} className="w-52 h-[50px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Submit
                            </button>
                        </div>
                    </div>

                </div>
            </div>
    ]

    const LoadingComp = loading ? [<LoadingScreen msg={'Setting up'}  key={'ldc'}/>] : [<></>]

    return (
        <>  
            {
                failed 
                ?
                <>
                    <div onClick={() => {setFailed(false)}} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <button className="z-[99] w-screen h-screen bg-slate-500/30">
                        </button>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="z-[100] flex items-center w-max h-20 px-5 py-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                <CloseIcon className="h-5 w-5" />
                            </div>
                            <div className="ml-3 mr-3 text-sm">
                                Submission failure
                            </div>
                            <button className="hover:invert" onClick={() => {setFailed(false)}}>
                                <CloseIcon className="h-8 w-8" />
                            </button>
                        </div>
                    </div>
                </>
                :
                null
            }
            {LoadingComp}
            {SelectForm}
            {InputForm}
        </>
    )
}