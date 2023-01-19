import React from "react";
import { useEffect, useState, useRef } from "react";
import Infobar from "./infobar/Infobar";
import { useRouter } from "next/router"
import LoadingScreen from "../LoadingScreen";
import TopBar from "./explorer/topbar/topbar";
import FileExplorer from "./explorer/FileExplorer/FileExplorer";
import NERExplorer from "./explorer/FileExplorer/NERExplorer";
import YOLOExplorer from "./explorer/FileExplorer/YOLOExplorer";

const Dataset = () => {
    // states for each json
    const [files, setFiles] = useState<Array<any>>([])
    const [URI, setURI] = useState({schema: '', storage: '', dataset: '', storage_dataset: ''});
    const [commits, setCommits] = useState<Array<any>>([]);
    const [len, setLen] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [waiting, setWaiting] = useState<Boolean>(true);
    const [schema, setSchema] = useState<string>('files');
    const [view, setView] = useState<Boolean>((schema == 'yolo' || schema == 'labelbox') ? false : true);
    const [filtering, setFiltering] = useState<string>('x');
    const [max_view, setMaxView] = useState<number>(view ? 36 : 36)
    const first = useRef(true)
    const router = useRouter()
    const shortcuts = useRef<Boolean>(false)
    const [loading, setLoading] = useState<Boolean>(true)
    const dataset = router.query.dataset

    const cancelRequest = useRef<any>(null)

    // reads the API endpoints
    
    useEffect(() => {
        const fetchFiles = async () => {
            var view_ex = view
            var max_view_var = max_view

            if(cancelRequest.current){
                for(var i = 0; i < cancelRequest.current.length; i++){
                    cancelRequest.current[i].abort()
                }
                cancelRequest.current = []
            } else {
                cancelRequest.current = []
            }

            if (first.current){
                shortcuts.current = true
                fetch('http://localhost:8000/connect/?uri='.concat(dataset as string)).then(
                    () => {
                        fetch(`http://localhost:8000/schema`).then((response) => response.json()).then(
                            (res) => {
                                setSchema(res.value);
                                if(res.value == 'yolo' || res.value == 'labelbox'){
                                    view_ex = false
                                    max_view_var = 36
                                    setView(false)
                                    setMaxView(36)
                                    setFiles( () => {
                                        return Array(1).fill({
                                            name: '',
                                            base_name: '',
                                            last_modified: '',
                                            thumbnail: '/Icons/icon-image-512.webp',
                                            tags: []
                                        })
                                    })
                                }
                                if(res.value.includes('ner')){
                                    view_ex = false
                                    max_view_var = 7
                                    setView(false)
                                    setMaxView(7)
                                }
                                first.current = false
                
                            }
                        ).then(
                            () => {
                                var length = 0
                    
                                fetch(`http://localhost:8000/uri`).then((response) => response.json()).then(
                                    (res) => {
                                        console.log(res)
                                        setURI(res);
                                        if (res.storage_dataset){
                                            fetch('http://localhost:8000/connect/?uri='.concat(dataset as string))
                                        }
                                        length = res.storage_dataset.length;
                    
                                        fetch(`http://localhost:8000/current?page=${page}&max_pp=${max_view_var}`)
                                        .then((response) => response.json()).then(
                                            async (current) => {
                    
                                                setLen(current.len)
                                    
                                                var files_: Array<any> = [];
                                                for(var i = 0; i < current.keys.length; i++){
                                                    const isImage =  [current.keys[i].includes('.jpg'),current.keys[i].includes('.png'),current.keys[i].includes('.jpeg'),current.keys[i].includes('.tiff'),current.keys[i].includes('.bmp'),current.keys[i].includes('.eps')].includes(true)
                                                    if (isImage && !view_ex){
                                                        setWaiting(true)
                                                        const controller = new AbortController();
                                                        const { signal } = controller;
                                                        
                                                        cancelRequest.current.push(controller)
                                                        try {
                                                            const tags = await fetch(`http://localhost:8000/get_tags?file=${current.keys[i]}`, { signal })
                                                            .then((res) => res.json())
                                    
                                                            files_.push({
                                                                name: current.keys[i],
                                                                base_name: current.keys[i].substring(length),
                                                                last_modified: current.lm[i],
                                                                // thumbnail: await thumbnail_,
                                                                thumbnail: null,
                                                                tags: await tags
                                                            })
                                                        } catch {
                                                            return
                                                        }
                                                    } else{
                                                        const controller = new AbortController();
                                                        const { signal } = controller;
                                    
                                                        cancelRequest.current.push(controller)
                                                        
                                                        try {
                                                            const tags = await fetch(`http://localhost:8000/get_tags?file=${current.keys[i]}`, { signal })
                                                            .then((res) => res.json())
                                                            
                                                            files_.push({
                                                                name: current.keys[i],
                                                                base_name: current.keys[i].substring(length),
                                                                last_modified: current.lm[i],
                                                                thumbnail: (await isImage) ? '/Icons/icon-image-512.webp' : '/Icons/file-icon.jpeg',
                                                                tags: await tags
                                                            })
                                                        } catch {
                                                            return
                                                        }
                                                    }
                                                }
                                            
                                                setWaiting(false)
                                                setFiles([])
                                                setFiles(() => {console.log(files_) ;return files_})
                                                setLoading(false)
                                            }
                                        );
                                    }
                                )
                            }
                        )
                    }
                )
                

            } else {

                var length = 0
    
                fetch(`http://localhost:8000/uri`).then((response) => response.json()).then(
                    (res) => {
                        console.log(res)
                        setURI(res);
                        length = res.storage_dataset.length;
    
                        fetch(`http://localhost:8000/current?page=${page}&max_pp=${max_view_var}`)
                        .then((response) => response.json()).then(
                            async (current) => {
    
                                setLen(current.len)
                    
                                var files_: Array<any> = [];
                                for(var i = 0; i < current.keys.length; i++){
                                    const isImage =  [current.keys[i].includes('.jpg'),current.keys[i].includes('.png'),current.keys[i].includes('.jpeg'),current.keys[i].includes('.tiff'),current.keys[i].includes('.bmp'),current.keys[i].includes('.eps')].includes(true)
                                    if (isImage && !view_ex){
                                        setWaiting(true)
                                        const controller = new AbortController();
                                        const { signal } = controller;
                                        
                                        cancelRequest.current.push(controller)
                                        try {
                                            const tags = await fetch(`http://localhost:8000/get_tags?file=${current.keys[i]}`, { signal })
                                            .then((res) => res.json())
                    
                                            files_.push({
                                                name: current.keys[i],
                                                base_name: current.keys[i].substring(length),
                                                last_modified: current.lm[i],
                                                // thumbnail: await thumbnail_,
                                                thumbnail: null,
                                                tags: await tags
                                            })
                                        } catch {
                                            return
                                        }
                                    } else{
                                        const controller = new AbortController();
                                        const { signal } = controller;
                    
                                        cancelRequest.current.push(controller)
                                        
                                        try {
                                            const tags = await fetch(`http://localhost:8000/get_tags?file=${current.keys[i]}`, { signal })
                                            .then((res) => res.json())
                                            
                                            files_.push({
                                                name: current.keys[i],
                                                base_name: current.keys[i].substring(length),
                                                last_modified: current.lm[i],
                                                thumbnail: (await isImage) ? '/Icons/icon-image-512.webp' : '/Icons/file-icon.jpeg',
                                                tags: await tags
                                            })
                                        } catch {
                                            return
                                        }
                                    }
                                }
                            
                                setWaiting(false)
                                setFiles([])
                                setFiles(() => {console.log(files_) ;return files_})
                                setLoading(false)
                            }
                        );
                    }
                )
            }


        }
        if(dataset){
            fetchFiles()
            const newLocal: number = 4;
            fetch(`http://localhost:8000/last_n_commits/?n=`.concat(newLocal.toString()))
                .then((response) => response.json()).then((data) => Object.values(data)).then((res) => setCommits(res as []));
        }

    }, [page, view, filtering, max_view, router.query, dataset])

    const dataprops = {dataset: URI.dataset, URI: URI.storage, storage_dataset: URI.storage_dataset};

    let props = {files: files, dataprops: dataprops, dataset: URI.storage_dataset};

    return (
        <div className='flex justify-between h-full w-full'>
            {
                loading ?
                <LoadingScreen key={'loading_screen_dataset'}/>
                : null
            }
            <div className='w-full h-full'>
                <div className="h-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-full">
                        <TopBar shortcuts={shortcuts} props={props.dataprops} setFiltering={setFiltering} schema={schema} setPage={setPage} filtering={filtering}/>
                    </div>
                </div>
                <div className="flex w-full h-full">
                    <div className="px-5 w-[80%] h-[80%] mt-2">
                        {
                            schema.includes('ner') ? 
                            <NERExplorer shortcuts={shortcuts} schema={schema} max_view={max_view} setFiltering={setFiltering} setMaxView={setMaxView} waiting={waiting} files={files} dataset={URI.dataset} page={page} setPage={setPage} view={view} setView={setView} len={len}/>
                            :
                            (schema == 'yolo' || schema == 'labelbox') ? 
                            <YOLOExplorer cancelRequest={cancelRequest} shortcuts={shortcuts} schema={schema} max_view={max_view} setFiltering={setFiltering} setMaxView={setMaxView} waiting={waiting} files={files} dataset={URI.dataset} page={page} setPage={setPage} view={view} setView={setView} len={len}/>
                            :
                            <FileExplorer cancelRequest={cancelRequest} shortcuts={shortcuts} schema={schema} max_view={max_view} setFiltering={setFiltering} setMaxView={setMaxView} waiting={waiting} files={files} dataset={URI.dataset} page={page} setPage={setPage} view={view} setView={setView} len={len}/>
                        }
                    </div>
                    <div className="px-5 w-[20%]">
                        <Infobar shortcuts={shortcuts} commits={commits} dataset={URI.storage_dataset}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dataset;