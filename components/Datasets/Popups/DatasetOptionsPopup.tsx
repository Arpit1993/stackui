import React, { useEffect } from "react";
import { useState } from "react";
import FormData from "form-data";
import DropdownSchema from "../../Dataset/Items/DropdownSchema";
import LoadingScreen from "../../LoadingScreen";
import posthog from 'posthog-js'
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Toast } from "flowbite-react";

const DatasetOptionsPopup = (props) => {

    const [uri , setURI ] = useState<string>(props.dataset.storage)
    const [name, setName] = useState<string>(props.dataset.name)
    
    const [loading, setLoading] = useState<Boolean>(false)
    const [schema, setSchema] = useState<string>('Loading...')
    const [accessKey, setAccessKey] = useState<string>('NoKey')
    const [secretKey, setsecretKey] = useState<string>('NoKey')
    const [region, setRegion] = useState<string>('NoRegion')
    const [hierarchy, setHierarchy] = useState({'parent': '', 'children': Array(0)})
    const [selecting, setSelecting] = useState<Boolean>(false)
    const [selecting1, setSelecting1] = useState<Boolean>(false)

    useEffect(()=>{
        setLoading(true)
        fetch('http://localhost:8000/connect/?uri='.concat(encodeURIComponent(props.dataset.storage))).then(
            () => {
                fetch(`http://localhost:8000/schema/`).then((response) => response.json())
                .then((res) => setSchema(res.value)).then(() => setLoading(false))
            }
        ).then(() => {
            fetch('http://localhost:8000/get_current_hierarchy').then((res) => res.json()).then(setHierarchy)
        })
    },[props])

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
    }

    const handleSubmit = async () => {    
        if (uri.length > 0){
            setLoading(true)
            const data = JSON.stringify({"uri": uri, "name": name,"key1": accessKey, "key2": secretKey, "key3": region, "schema": schema})
            
            await fetch('http://localhost:8000/init_web/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
            )
            
            posthog.capture('Updated a dataset', { property: 'value' })
            setLoading(false)
            window.location.href='/Datasets';

        }
    }

    const handleFileChange = async (e) => {
        const data = new FormData();
        data.append(
            "file",
            e.target.files[0],
            e.target.files[0].name
        )
        await fetch('http://localhost:8000/init_gskey/', 
            {
                method: 'POST',
                body: data
            }
        )
    }

    const handleDeleteChild = (child) => {
        fetch(`http://localhost:8000/current_remove_child?uri=${child}`).then(() => {
            fetch('http://localhost:8000/get_current_hierarchy').then((res) => res.json()).then(setHierarchy)
        })
    }

    const handleAddParent = (parent) => {
        fetch(`http://localhost:8000/add_parent_to_current?parent=${parent}`).then(() => {
            fetch('http://localhost:8000/get_current_hierarchy').then((res) => res.json()).then(setHierarchy)
        })
        setSelecting1(false)
    }
    
    const handleAddChild = (child) => {
        fetch(`http://localhost:8000/add_child_to_current?child=${child}`).then(() => {
            fetch('http://localhost:8000/get_current_hierarchy').then((res) => res.json()).then(setHierarchy)
        })
        setSelecting(false)
    }

    return (
        <>
            {
                <button key={'ccdo'} onClick={() => props.setPopup(false)} className="z-30 bg-black/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
                    click to close
                </button>
            }
            <div className="z-40 text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-900 w-[1100px]  h-[700px]">
                <div className="w-full justify-between flex">
                    <div className="py-1 px-2">
                        <button onClick={() => props.setPopup(false)} className='text-xs px-1 w-[15px] h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                    </div> 
                    <div className="place-self-center py-2 font-bold">
                        Dataset Options
                    </div>
                    <div></div>
                </div>
                
                <div className="flex justify-center "  key={'ip'}>
                    <div className="p-5 mt-5 mb-5 w-[80%] h-[70%] justify-start flex flex-col">    

                        <div className="mb-2 flex justify-center w-full">
                            <form className="flex justify-center w-[560px]">
                                <div className="block mb-2 w-[160px] text-sm p-3 font-body text-gray-900 dark:text-gray-300">
                                    Dataset name:
                                </div>
                                <label className="block text-gray-700 text-sm w-[400px]"> 
                                    <div className="">
                                        <input onChange={handleNameChange} onInput={handleNameChange}
                                        className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder={props.dataset.name} type="text" />   
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
                                        <input onChange={handleURIChange} onInput={handleURIChange}
                                        className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder={props.dataset.storage} type="text" />   
                                    </div>
                                </label>
                            </form>
                        </div>

                        <div className="flex justify-center">
                            {
                                (props.dataset.storage.includes('gs://')) ? 
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
                                : <></>
                            }
                            {
                                (props.dataset.storage.includes('s3://')) ? 
                                    <div key={'awk'}>
                                        <form className="shadow-md rounded w-[320px]">
                                            <label className="block text-gray-700 text-base mt-2"> 
                                                <div className="">
                                                    AWS Access Key Id
                                                    <input onChange={handleKey1Change} onInput={handleKey1Change}
                                                    className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    placeholder="***************" type="password" />   
                                                </div>
                                            </label>
                                        </form>
                            
                                        <form className="shadow-md rounded w-[320px] mt-2">
                                            <label className="block text-gray-700 text-base"> 
                                                <div className="">
                                                    AWS Secret Access Key
                                                    <input onChange={handleKey2Change}  onInput={handleKey2Change}
                                                    className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    placeholder="***************" type="password" />   
                                                </div>
                                            </label>
                                        </form>
                            
                                        <form className="shadow-md rounded w-[320px] mt-2">
                                            <label className="block text-gray-700 text-base"> 
                                                <div className="">
                                                    AWS Region
                                                    <input onChange={handleKey3Change} onInput={handleKey3Change}
                                                    className= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    placeholder="***************" type="password" />   
                                                </div>
                                            </label>
                                        </form>
                                    </div>
                                : <></>
                            }
                        </div>

                        <div className="flex justify-center mt-5">
                            <div className="flex flex-col">
                                <div className="flex justify-center">
                                    <DropdownSchema schema={schema} setSchema={setSchema} />
                                </div>
                                <ol className="flex gap-0 justify-center w-full h-24">
                                    <li className="relative mb-0">
                                        <div className="mt-3">
                                            <ul className="w-48 text-sm h-24 font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="py-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Parent dataset
                                                    </h3>
                                                </li>
                                                <li className="py-2 px-4 w-full overflow-x-scroll border-b border-gray-200 dark:border-gray-600"> 
                                                    <button onClick={()=>{setSelecting1(!selecting1)}} className={"z-30 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                                                        {
                                                            hierarchy['parent'] == '' ? <AddIcon className="h-[20px] w-[20px]"/> : null
                                                        }
                                                        {hierarchy['parent'] == '' ? 'None' : hierarchy['parent']}
                                                    </button>
                                                    <div className={selecting1 ? 'absolute' : 'invisible absolute'}>
                                                        <ul className="w-48 h-60 overflow-y-scroll text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                            <li className="py-2 px-4 w-full overflow-clip text-center rounded-t-lg border-b border-gray-200 dark:border-gray-600">Datasets</li>
                                                            {
                                                                props.datasets.map(
                                                                    (dataset, idx) => {
                                                                        return (
                                                                            <button onClick={() => handleAddParent(dataset.storage)} key={`dataset in list ${idx} ${dataset}`} className="py-2 px-4 w-full border-b border-gray-200 hover:bg-gray-400 dark:border-gray-600">
                                                                                {dataset.storage}
                                                                            </button>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                            <li className="py-2 px-4 w-full rounded-b-lg"></li>
                                                        </ul>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <div className="flex flex-col justify-center">
                                        <ArrowRightAltIcon className="h-8 w-8"/>
                                    </div>
                                    <li className="relative mb-0">
                                        <div className="mt-3">             
                                            <ul className="w-50 h-24 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="py-2 flex gap-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Branches
                                                    </h3>
                                                    <div className="items-center relative">
                                                        <button onClick={()=>{setSelecting(!selecting)}} className={"flex justify-center items-center z-30 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"}>
                                                            <AddIcon className="h-[20px] w-[20px]"/>
                                                            {'Add'}
                                                        </button>
                                                        <div className={selecting ? 'absolute' : 'invisible absolute'}>
                                                            <ul className="w-48 h-48 overflow-y-scroll text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                                <li className="py-2 px-4 w-full text-center rounded-t-lg border-b border-gray-200 dark:border-gray-600">Datasets</li>
                                                                {
                                                                    props.datasets.map(
                                                                        (dataset, idx) => {
                                                                            return (
                                                                                <button onClick={() => handleAddChild(dataset.storage)} key={`dataset in list ${idx} ${dataset}`} className="py-2 px-4 w-full border-b border-gray-200 hover:bg-gray-400 dark:border-gray-600">
                                                                                    {dataset.storage}
                                                                                </button>
                                                                            )
                                                                        }
                                                                    )
                                                                }
                                                                <li className="py-2 px-4 w-full rounded-b-lg"></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                                <div className="overflow-x-scroll h-12">
                                                    {
                                                        hierarchy.children.map(
                                                            (child, idx) => {
                                                                return (
                                                                <li key={`dataset child${child}${idx}`} className="py-2 px-4 overflow-scroll border-b border-gray-200 dark:border-gray-600">
                                                                    <div className="flex gap-1">
                                                                        {child}
                                                                        <button onClick={() => handleDeleteChild(child)}>
                                                                            <ClearIcon className="h-4 w-[15px]"/>
                                                                        </button>
                                                                    </div>
                                                                </li>)
                                                            }
                                                        )
                                                    }
                                                </div>
                                                <li className="relative py-2 px-4 w-full rounded-b-lg">
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ol>

                                <div className="flex justify-center gap-2 mt-5">
                                    <button onClick={() => props.setPopup(false)} className="w-52 h-[50px] py-2.5 px-5 mr-2 mb-2 text-sm font-body text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                        Cancel
                                    </button>
                                    <button onClick={() => handleSubmit()} className="w-52 h-[50px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading ? <LoadingScreen msg={'Setting up'}  key={'ldcO'}/> : <></>}
        </>
    )
}

export default DatasetOptionsPopup;