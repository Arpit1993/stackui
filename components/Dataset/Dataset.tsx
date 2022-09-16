import React from "react";
import { useEffect, useState } from "react";
import Explorer from "./explorer/Explorer";
import Infobar from "./infobar/Infobar"
import Stats from "./stats/Stats"

const Dataset = () => {
    // states for each json
    const [files, setFiles] = useState([])
    const [URI, setURI] = useState({storage: '', dataset: '', storage_dataset: ''});
    const [commits, setCommits] = useState([]);
    const [len, setLen] = useState(0);
    const [page, setPage] = useState(0);
    const [view, setView] = useState(1);

    // reads the API endpoints
    useEffect(() => {
        
        const fetchFiles = async () => {
            const max_view = view ? 11 : 9
            const current = await fetch(`http://localhost:8000/current/?page=${page}&max_pp=${max_view}`)
            .then((response) => response.json());
            setLen(await current.len)

            const uri = await fetch(`http://localhost:8000/uri/`).then((response) => response.json())
            setURI(await uri);

            var files_ = [];

            for(var i = 0; i < current.keys.length; i++){
                const isImage = ['jpg','png','jpeg','tiff','bmp','eps'].includes(current.keys[i].split('.').pop())
                if (isImage && (view == 0)){
                    const thumbnail_  = 
                    await fetch('http://localhost:8000/pull_file_api?file='.concat(current.keys[i].substring(await uri.storage_dataset.length)))
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
                    
                    console.log(current.keys[i].substring(await uri.storage_dataset.length))

                    files_.push({
                        name: current.keys[i],
                        last_modified: current.lm[i],
                        thumbnail: thumbnail_
                    })
                } else{
                    const thumbnail_  = '/Icons/file-icon.jpeg'
                    if (isImage){
                        const thumbnail_ = 'icon-image-512.webp'
                    }
                    files_.push({
                        name: current.keys[i],
                        last_modified: current.lm[i],
                        thumbnail: thumbnail_
                    })
                }
            }

            setFiles(await files_)
        }

        fetchFiles()

    }, [setFiles, page, view])

    useEffect(() => {
        const newLocal: number = 5;
        const data = fetch(`http://localhost:8000/last_n_commits/?n=`.concat(newLocal.toString()))
            .then((response) => response.json()).then((data) => Object.values(data)).then((res) => setCommits(res as []));
    }, [setCommits])

    const description = "placeholder text";
    const dataprops = {dataset: URI.dataset, URI: URI.storage, storage_dataset: URI.storage_dataset};

    let props = {files: files, dataprops: dataprops, dataset: URI.storage_dataset};

    return (
        <div className='flex justify-between h-full'>
            <div className='w-full h-full'> 
                {/* <Stats props={files}/> */}
                <Explorer props={props} page={page} setPage={setPage} view={view} setView={setView} len={len} />
            </div>
            <Infobar commits={commits} description={description}/>
        </div>
    )
}

export default Dataset;