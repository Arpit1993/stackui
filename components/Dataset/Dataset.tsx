import React from "react";
import { useEffect, useState } from "react";
import Explorer from "./explorer/Explorer";
import Infobar from "./infobar/Infobar"
import Stats from "./stats/Stats"

const Dataset = () => {
    const files = [];

    // states for each json
    const [currentJson, setCurrent] = useState({keys: [], lm: []});
    const [URI, setURI] = useState({storage: '', dataset: ''});
    const [commits, setCommits] = useState([]);    

    // reads the API endpoints
    useEffect(() => {
        fetch(`http://localhost:8000/status/`)
         .then((response) => response.json()).then(setCurrent);
    }, [setCurrent])

    useEffect(() => {
        fetch(`http://localhost:8000/uri/`)
         .then((response) => response.json()).then(setURI);
    }, [setURI])

    useEffect(() => {
        const newLocal: number = 5;
        const data = fetch(`http://localhost:8000/last_n_commits/?n=`.concat(newLocal.toString()))
            .then((response) => response.json()).then((data) => Object.values(data)).then((res) => setCommits(res as []));
    }, [setCommits])

    for(var i = 0; i < currentJson.keys.length; i++){
        files.push({
            name: currentJson.keys[i],
            last_modified: currentJson.lm[i],
            thumbnail: 'https://icon-library.com/images/png-file-icon/png-file-icon-6.jpg'
        })
    }

    const description = "placeholder text";
    const dataprops = {dataset: URI.dataset, URI: URI.storage};

    let props = {files: files, dataprops: dataprops, dataset: URI.dataset};

    return (
        <div className='flex justify-between h-full'>
            <div className='w-full h-full'> 
                <Stats props={files}/>
                <Explorer props={props} />
            </div>
            <Infobar commits={commits} description={description}/>
        </div>
    )
}

export default Dataset;