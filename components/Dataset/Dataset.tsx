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
            thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX///9Nlcs1d6tHjcNDkcmtyeSvzuY9jshHkspSmMybweDc6POFs9lgn9Dy9/vL3e1opNI9gLXt8/nj7fZ9r9iixeK20ejD2uzg6/XR4e90qtWUvN5Pl8xenc86icIqcaZOhrQYbKa90OOvxtyhvNWXttKKrs13ocZrmsFZjroze7Jak8GWNooZAAADIklEQVR4nO3diVKjQBCA4YmDAnFzHxpjxOx9vP/7LdHVdQOZrNA9jfH/X2DqKwaKTihwjoiIiIiIiIiIiIiITr/Z6CJOo5kJr7/J0iROabbpx0ZO52nSi1mSzqcxgVdJFtW3K0uu4gEXcY/fU+kiFnCdmgBL4joOcGkFLInLGMCZzRZ9LIlxSZ3Hv8j8LZvrAy/t9uiu9FJduLbcpOU21b/Y3JoCe71cGziz3aTlNtW+1lyZC7XvbJa2p2F5Il4oC8/NhecIESJEiBBhF4WqP7N1QZgv+notcnthNlZdb7w/byNsHULpEMqHUDqE8iGUDqF81fvSwexSr9lgfzmL2SLVrLIa8yFChAgRIkSIECHCeuHJ/+Y9uFacLa47MFuc/nyIsGUI5UMoHUL5EEqHUL53KOzlHzTrwLMY5VHUrLIa8yFChAgRIkSIECHCeuFAsw4IT396QtgyhPIhlA6hfAilQyjfOxT2xm6olxvvL2dx551rVlmN6QkhQoQIESJEiBBhvVDjWedOCTft3/xRfb9Hl4Qi82FlRkKoGMJmIUQoGcJmIUQo2TsU9garUdtWm04LJd788f9A5kOECBEiRIgQIUKECBEiRIgQIUKECBE+54PdvX3h5CxUcT9860IfFOoD1YU+KCwm6kBtoQ8KYwCVhT4oLCYxPs2tKvRBYXEW5dvjmkIfFsYBagr9EeF1FKCi0B8R6n/qWFnojwhjAdWEWVhYrGIB1YQ+KCxG0YBaQh8UbrW/cqwv9EFh8TEiUEfog8JtVKCK0AeFkYEaQh8Ubj/FBSoI94f4iS3QXUgLKz9TTGyB4l+PrwD/EW4/Rwe61WueQWsCfCm0ALqhqLAG+EK4/WIAdO6m+tLUxmVB4farCdAt5Q5iLfBZaAV07hVPux6pFvgktAPKHcR64B9h8c0MKHYmHgA+CovvhkA3zCWIh4APQlugc1MB4kHgTmgNLInjtufiYWApLH5YA8sWaau7twDQT4p7a91Dw3WeJk03awjof3bhCD626t8MNg1eG3R7F+xXhH9fXlGjlz9Ng1mTiIiIiIiIiIiIiIi62m/3JKFiYLuEDwAAAABJRU5ErkJggg=='
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