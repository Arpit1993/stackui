import React from "react"
import { useState } from "react"
import LoadingScreen from "../components/LoadingScreen"
import FormData from "form-data";

export default function NewDatasets() {        

    const [loading , setLoading ] = useState(0)
    const [uri , setURI ] = useState('')
    const [storage , setStorage ] = useState('')
    const [name, setName] = useState('My Dataset')

    const [file, setFile] = useState(null)
    const [accessKey, setAccessKey] = useState('')
    const [secretKey, setsecretKey] = useState('')
    const [region, setRegion] = useState('us-east-1')

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
            setLoading(1)

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

            const data = JSON.stringify({"uri": uri, "name": name,"key1": accessKey, "key2": secretKey, "key3": region})
            
            const response = await fetch('http://localhost:8000/init_web/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
            )

            if (response.success) {
                window.location.href='/dataset/'.concat(encodeURIComponent(name));
            } else {
                window.location.href='/Datasets';
            }

        }
    }

    const handleFileChange = async (e) => {
        setFile(e.target.files[0])
    }

    const awsKeys = (storage == 's3') ? [
        <div key={'awk'}>
            <form className="bg-white shadow-md rounded w-[320px]">
                <label className="block text-gray-700 text-base mt-2"> 
                    <div className="">
                        <input onChange={handleKey1Change} onInput={handleKey1Change}
                        className= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="AWS Access Key Id" type="password" />   
                    </div>
                </label>
            </form>

            <form className="bg-white shadow-md rounded w-[320px] mt-2">
                <label className="block text-gray-700 text-base"> 
                    <div className="">
                        <input onChange={handleKey2Change}  onInput={handleKey2Change}
                        className= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="AWS Secret Access Key" type="password" />   
                    </div>
                </label>
            </form>

            <form className="bg-white shadow-md rounded w-[320px] mt-2">
                <label className="block text-gray-700 text-base"> 
                    <div className="">
                        <input onChange={handleKey3Change} onInput={handleKey3Change}
                        className= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="AWS Region (default us-east-1)" type="password" />   
                    </div>
                </label>
            </form>
        </div>
    ] : [<></>]

    const gsKeys = (storage == 'gs') ? [
        <div className="w-[400px]" key={'gck'}>
            <form className="flex justify-center p-2">
                    <label className="p-2 flex flex-col justify-center items-center w-full h-[200px] bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                            <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <p className="mb-2 text-base text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> upload key file from GS </p>
                        </div>
                        <input onChange={handleFileChange} onInput={handleFileChange} id="dropzone-file" type="file" className="hidden" />
                    </label>
                </form>
        </div>
    ] : [<></>]

    var placehoder = "e.g. s3://bucket/dataset or path/relative/to/home"
    var instructions = 'If using local storage, please use directories relative to your home path'
    if (storage == 's3'){
        placehoder = "e.g. s3://bucket/dataset"
        instructions = 'Please create an IAM user with AmazonS3FullAccess and add your keys'
    } else if (storage == 'gs'){
        placehoder = "e.g. gs://bucket/dataset"
        instructions = 'Please create an Service Account with Storage Admin and add your keys'
    } else {
        placehoder = "e.g. path/relative/to/home"
        instructions = 'Please use directories relative to your home path'
    }
    

    const SelectForm = [
        <div key={'sfff'} className='flex justify-center mt-5'>
            <button onClick={()=>setStorage('local')} className="hover:bg-blue-900 w-[100px] border-r-2 border-black text-sm rounded-l-md px-5 text-white p-2 bg-blue-700"> Local </button>
            <button onClick={()=>setStorage('s3')} className="hover:bg-blue-900 w-[100px] text-sm px-5 text-white p-2 bg-blue-700"> S3 </button>
            <button onClick={()=>setStorage('gs')} className="hover:bg-blue-900 w-[100px]  border-l-2 border-black text-sm px-5 rounded-r-md text-white p-2 bg-blue-700"> GCS </button>
        </div>
    ]
    
    const InputForm = [
            <div className="flex justify-center "  key={'ip'}>
                <div className="p-5 mt-5 mb-5 w-[1000px] h-[600px] justify-start flex flex-col">    
                    
                    <div className="text-lg flex justify-center w-full">
                        Dataset name: 
                    </div>
                    
                    <div className="mb-2 flex justify-center w-full">
                        <form className="bg-white flex justify-center shadow-md rounded w-[500px]">
                            <label className="block text-gray-700 text-sm w-[500px]"> 
                                <div className="w-[500px]">
                                    <input onChange={handleNameChange} onInput={handleNameChange}
                                    className= "shadow appearance-none text-lg border rounded w-[500px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    placeholder="e.g. My Dataset" type="text" />   
                                </div>
                            </label>
                        </form>
                    </div>

                    <div className="text-lg mt-5 flex justify-center w-full">
                        Dataset path or URI: 
                    </div>

                    <div className="mb-5 flex justify-center">
                        
                        <form className="bg-white flex justify-self-center shadow-md rounded w-[500px]">
                            <label className="block text-gray-700 text-sm"> 
                                <div className="">
                                    <input onChange={handleURIChange} onInput={handleURIChange}
                                    className= "shadow appearance-none text-lg  border rounded w-[500px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    placeholder={placehoder} type="text" />   
                                </div>
                            </label>
                        </form>
                    </div>

                    <a className="text-base flex justify-center dark:text-white underline mt-2 
                    text-blue-500 hover:underline hover:text-gray-500" 
                    href="https://docs.google.com/document/d/1ibEXIG_aD0RgRUkz-LbgBrfhdSj1Pf_0nWppmOcsNcQ/">
                        {instructions}
                    </a>

                    <div className="flex justify-center">
                        {gsKeys}
                        {awsKeys}
                    </div>


                    <div className="mt-5  flex justify-center">
                        <button onClick={() => handleSubmit()} className="w-[200px] text-center transition p-3 bg-black font-thin text-white hover:bg-gray-300 hover:text-black">
                            SUBMIT
                        </button>
                    </div>

                </div>
            </div>
    ]

    const LoadingComp = loading ? [<LoadingScreen msg={'Setting up'}  key={'ldc'}/>] : [<></>]

    return (
        <>  
            {LoadingComp}
            {SelectForm}
            {InputForm}
        </>
    )
}