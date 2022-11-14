import React from "react";
import { useEffect, useState } from "react";
import Explorer from "./explorer/Explorer";
import Infobar from "./infobar/Infobar";

const Dataset = () => {
    // states for each json
    const [files, setFiles]: Array<any> = useState([])
    const [URI, setURI] = useState({schema: '', storage: '', dataset: '', storage_dataset: ''});
    const [commits, setCommits] = useState([]);
    const [len, setLen] = useState(0);
    const [page, setPage] = useState(0);
    const [waiting, setWaiting] = useState(0);
    const [view, setView] = useState(1);
    const [filtering, setFiltering] = useState('x');
    const [max_view, setMaxView] = useState(36)

    const [schema, setSchema] = useState('files')

    // reads the API endpoints
    useEffect(() => {
        
        const fetchFiles = async () => {
            const current = await fetch(`http://localhost:8000/current/?page=${page}&max_pp=${max_view}`)
            .then((response) => response.json());
            setLen(await current.len)

            const uri = await fetch(`http://localhost:8000/uri/`).then((response) => response.json())
            setURI(await uri);

            const schema_res = await fetch(`http://localhost:8000/schema/`).then((response) => response.json())
            setSchema(await schema_res.value);
            if(schema_res.value == 'yolo' || schema_res.value == 'labelbox'){
                setView(0)
            }

            var files_: Array<any> = [];

            for(var i = 0; i < current.keys.length; i++){
                const isImage = ['jpg','png','jpeg','tiff','bmp','eps'].includes(current.keys[i].split('.').pop())
                if (isImage && (view == 0)){
                    setWaiting(1)
                    const thumbnail_  = 
                    await fetch(`http://localhost:8000/get_thumbnail?file=${current.keys[i].substring(await uri.storage_dataset.length)}`)
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

                    const tags = await fetch(`http://localhost:8000/get_tags?file=${current.keys[i].substring(await uri.storage_dataset.length)}`)
                    .then((res) => res.json())

                    files_.push({
                        name: current.keys[i],
                        base_name: current.keys[i].substring(await uri.storage_dataset.length),
                        last_modified: current.lm[i],
                        thumbnail: thumbnail_,
                        tags: tags
                    })

                    setWaiting(0)
                } else{
                    const tags = await fetch(`http://localhost:8000/get_tags?file=${current.keys[i].substring(await uri.storage_dataset.length)}`)
                    .then((res) => res.json())
                    
                    files_.push({
                        name: current.keys[i],
                        base_name: current.keys[i].substring(await uri.storage_dataset.length),
                        last_modified: current.lm[i],
                        thumbnail: isImage ? '/Icons/icon-image-512.webp' : '/Icons/file-icon.jpeg',
                        tags: tags
                    })
                }
            }

            setFiles(await files_)
        }
    
        fetchFiles()

        const newLocal: number = 4;
        fetch(`http://localhost:8000/last_n_commits/?n=`.concat(newLocal.toString()))
            .then((response) => response.json()).then((data) => Object.values(data)).then((res) => setCommits(res as []));

    }, [setFiles, page, view, filtering, setCommits, max_view])

    const description = "placeholder text";
    const dataprops = {dataset: URI.dataset, URI: URI.storage, storage_dataset: URI.storage_dataset};

    let props = {files: files, dataprops: dataprops, dataset: URI.storage_dataset};

    return (
        <div className='flex justify-between h-full w-full'>
            <div className='w-full h-full'> 
                <Explorer props={props} page={page} setPage={setPage} max_view={max_view} setMaxView={setMaxView} view={view} setView={setView} len={len} waiting={waiting} setFiltering={setFiltering} schema={schema}/>
            </div>
            <Infobar commits={commits} description={description}/>
        </div>
    )
}

export default Dataset;