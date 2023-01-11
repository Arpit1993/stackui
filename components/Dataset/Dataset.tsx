import React from "react";
import { useEffect, useState, useRef } from "react";
import Explorer from "./explorer/Explorer";
import Infobar from "./infobar/Infobar";
import { useRouter } from "next/router"
import LoadingScreen from "../LoadingScreen";

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
    // reads the API endpoints
    
    useEffect(() => {
        const fetchFiles = async () => {
            var view_ex = view
            var max_view_var = max_view

            if (first.current){
                shortcuts.current = true
                await fetch('http://localhost:8000/connect/?uri='.concat(dataset as string))
                const schema_res = await fetch(`http://localhost:8000/schema`).then((response) => response.json())
                setSchema(await schema_res.value);
                if(await schema_res.value == 'yolo' || await schema_res.value == 'labelbox'){
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
                first.current = false
            }

            const uri = await fetch(`http://localhost:8000/uri`).then((response) => response.json())
            setURI(await uri);
            const length = await uri.storage_dataset.length

            const current = await fetch(`http://localhost:8000/current?page=${page}&max_pp=${max_view_var}`)
            .then((response) => response.json());
            setLen(await current.len)

            var files_: Array<any> = [];

            for(var i = 0; i < await current.keys.length; i++){
                const isImage =  [current.keys[i].includes('.jpg'),current.keys[i].includes('.png'),current.keys[i].includes('.jpeg'),current.keys[i].includes('.tiff'),current.keys[i].includes('.bmp'),current.keys[i].includes('.eps')].includes(true)
                if (isImage && !view_ex){
                    setWaiting(true)
                    const thumbnail_  = 
                    await fetch(`http://localhost:8000/get_thumbnail?file=${await current.keys[i]}`)
                    .then((res) => res.body.getReader()).then((reader) =>
                    new ReadableStream({
                        start(controller) {
                            return pump();
                            function pump() {
                                return reader.read().then(({ done, value }) => {
                                    if (done) {
                                        controller.close();
                                        return;
                                    }
                                    controller.enqueue(value);
                                    return pump();
                                });
                            }
                        }
                    }))
                    .then((stream) => new Response(stream)).then((response) => response.blob())
                    .then((blob) => URL.createObjectURL(blob))
                    const tags = await fetch(`http://localhost:8000/get_tags?file=${await current.keys[i]}`)
                    .then((res) => res.json())

                    files_.push({
                        name: await current.keys[i],
                        base_name: await current.keys[i].substring(length),
                        last_modified: current.lm[i],
                        thumbnail: await thumbnail_,
                        tags: await tags
                    })
                } else{
                    const tags = await fetch(`http://localhost:8000/get_tags?file=${await current.keys[i]}`)
                    .then((res) => res.json())
                    
                    files_.push({
                        name: await current.keys[i],
                        base_name: await current.keys[i].substring(length),
                        last_modified: await current.lm[i],
                        thumbnail: (await isImage) ? '/Icons/icon-image-512.webp' : '/Icons/file-icon.jpeg',
                        tags: await tags
                    })
                }
            }
        
            setWaiting(false)
            setFiles([])
            setFiles(() => {console.log(files_) ;return files_})
            setLoading(false)
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
            <div className='w-4/5 h-full'> 
                <Explorer shortcuts={shortcuts} props={props} page={page} setPage={setPage} max_view={max_view} setMaxView={setMaxView} view={view} setView={setView} len={len} waiting={waiting} filtering={filtering} setFiltering={setFiltering} schema={schema}/>
            </div>
            <div  className='w-1/5 h-full'>
                <Infobar shortcuts={shortcuts} commits={commits} dataset={URI.storage_dataset}/>
            </div>
        </div>
    )
}

export default Dataset;