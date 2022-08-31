import LoadingScreen from "../components/LoadingScreen"
import { useState, useEffect } from 'react'


function datasetComponent(dataset, setLoading) {
    
    const handleClick = async (dataset, setLoading) => {
        setLoading(1)
        const response = await fetch('http://localhost:8000/init?uri='.concat(encodeURIComponent(dataset.storage)).concat('&name=').concat(encodeURIComponent(dataset.name))).then( (res) => res.json())
        window.location.href='/dataset/'.concat(encodeURIComponent(dataset.name));
    }

    const handleDisconnect = async (dataset) => {
        const response = await fetch('http://localhost:8000/disconnect?uri='.concat(encodeURIComponent(dataset.storage)))
        window.location.reload(true);
    }

    var component = [
        <div className="w-full flex" key={'cp'}>
            <button onClick={() => handleClick(dataset,setLoading)} className='w-3/4'>
                <ul className=" text-start mt-3 font-normal text-sm">
                    <li className="dark:hover:text-black py-4 px-4 justify-between flex-col w-full hover:bg-gray-300 border-b border-gray-200 dark:border-gray-600">
                        <div className="w-full flex truncate">
                            <div className="w-[100px]"> Dataset: </div>
                            <div className="w-full truncate"> {dataset.name} </div>
                        </div>
                        <div className="w-full flex truncate">
                            <div className="w-[100px]"> Location</div> 
                            <div className="w-full truncate underline"> {dataset.storage} </div>
                        </div>
                        <div className="w-full truncate flex">
                            <div className="w-[100px]"> Access</div>
                            <div className="w-full truncate"> Not available yet... </div>
                        </div>
                    </li>
                </ul>
            </button>
            <button  onClick={() => handleDisconnect(dataset)} className='w-1/4 mt-3 dark:text-black bg-red-200 hover:bg-red-400 border-b border-gray-200 dark:border-gray-600'>
                Disconnect
            </button>
        </div>
    ]

    return component
}

export default function Datasets() { 
    
    const [loading , setLoading ] = useState(0)
    const [datasets, setDatasets] = useState([])

    useEffect(() => {
        fetch(`http://localhost:8000/get_datasets/`)
         .then((response) => response.json()).then((data) => setDatasets(Object.values(data)));
    }, [])

    const LoadingComp = loading ? [<LoadingScreen msg={'Connecting...'}  key={'ld'}/>] : [<></>]

    return (
        <>
            {datasets.map( (dataset) => datasetComponent(dataset,setLoading) )}
            {LoadingComp}
        </>
    )
}