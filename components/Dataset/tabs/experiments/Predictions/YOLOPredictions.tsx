import React, { useRef } from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Pagination } from "flowbite-react"

const YOLOPredictions = (props) => {
    const [page, setPage]= useState<number>(0)
	const [predictions, setPredictions]= useState<Array<any>>([])
	const cancelRequest = useRef([])

    useEffect(()=>{
        fetch(`http://localhost:8000/get_prediction?prediction=${props.prediction.current}`).then((res) => res.json()).then((res) => {setPredictions(res['prediction'][0]); console.log(res['prediction'][0])})
    },[props.prediction])

    return (
        <div className="w-full h-full bg-white dark:bg-black">
            <div className="w-full flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Predictions
                </h3>
                <button onClick={() => {props.setPopup(false)}} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <div className="z-[48] p-2 grid grid-cols-4 justify-items-center gap-2 w-full h-full">
                {
                    (Object.keys(predictions).length > 0 && predictions) ?
                    Object.keys(predictions).filter((v, i) => (i >= page*16 && i < (page+1)*16) ).map(
                        (res, idx) => {
                            return <PredThumbnail keyIdx={idx} key={`thumbnail-${res}`} labels={predictions} keys={Object.keys(predictions)} cancelRequest={cancelRequest}/>
                        }
                    )
                    :
                    'No predictions yet'
                }
            </div>
			{
				(Object.keys(predictions).length > 0 && predictions)
				?
				<Pagination
					currentPage={page+1}
					totalPages={Math.ceil(Object.keys(predictions).length/16)}
					onPageChange={(n) => {setPage(n-1)}}
					/>
				:
				null
			}
        </div>
    )
}

export default YOLOPredictions

const PredThumbnail = (props) => {

    const [thumbnail, setThumbnail] = useState<any>(null)
    const [waiting, setWaiting] = useState<Boolean>(false)
	const [modal, setModal] = useState<Boolean>(false)

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        if (props.cancelRequest.current) {
            props.cancelRequest.current.push(controller)
        } else {
            props.cancelRequest.current = []
            props.cancelRequest.current.push(controller)
        }
        setWaiting(true)
        fetch(`http://localhost:8000/get_thumbnail?file=${props.keys[props.keyIdx]}`, { signal })
            .then((res: any) => res.body.getReader()).then((reader) =>
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
            .then((res) => setThumbnail(res)).then(
                () => setWaiting(false)
            ).catch(() => {});
    }, [props.cancelRequest, props.keyId])

    const width: number = Math.ceil(1100 / 4)
    const height: number = Math.ceil(465 / 4)

    return (
		<>
			{
				modal ?
				<ComparePrediction keyIdx={props.keyIdx} keys={props.keys} setModal={setModal} labels={props.labels}/>
				: null
			}
			<button onClick={() => {setModal(!modal)}} className={`justify-center flex flex-col z-10 h-[${height}px] w-[${width}px] bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-black border-[0.5px] border-gray-400 text-left text-xs`} key={`${props.keys[props.keyIdx].toString()}defg`}>
				{
					waiting ?
						<div className='relative h-max flex justify-center'>
							<div className="absolute top-1/2 left-1/2 animate-pulse transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-slate-400 w-full h-full">
							</div>
							<Image
								className="invisible z-20"
								src={'/Icons/icon-image-512.webp'}
								width={width}
								height={height * 0.99}
								objectFit={'contain'}
								alt='.'
							/>
						</div>
						:
						<Image
							className={props.thumbnailView ? "z-20 w-full justify-center" : "z-20"}
							src={(thumbnail) ? thumbnail : ''}
							width={width}
							height={height * 0.99}
							objectFit={props.thumbnailView ? 'cover' : 'contain'}
							alt='.'
						/>
				}
			</button>
		</>
    )

}

import CanvasBoundingBoxes from "../../../Visualizers/Items/CanvasBoundingBoxes"

const ComparePrediction = (props) => {
	const [image, setImage] = useState<any>(null)
	const newRef = useRef<Array<any>>([])
	const [labelMap, setLabelMap] = useState<any>({})
	const updated_labels = useRef<Array<any>>([])
	const [labels, setLabels] = useState<Array<any>>([])
	const [active, setActive] = useState<Array<any>>([])
	const [selectedLabel, setSelectedLabel] = useState<Array<any>>([])

    useEffect(() => {
		fetch('http://localhost:8000/pull_file_api?file='.concat(props.keys[props.keyIdx])).
		then((res: any) => res.body.getReader()).then((reader) =>
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
		})).then((stream) => new Response(stream)).then((response) => response.blob())
		.then((blob) => URL.createObjectURL(blob)).then(setImage).then(() => {
			fetch(`http://localhost:8000/get_labels?filename=${props.keys[props.keyIdx]}`)
			.then((response) => response.json()).then((res) => {
				setLabels(Object.values(res))
				setSelectedLabel(() => {return Array(Object.values(res).length).fill(false)})
				setActive(()=> {return Array(Object.values(res).length).fill(true)})
				updated_labels.current = res
				newRef.current = Array(Object.values(res).length).fill(false)
			}).then(
				() => {
					fetch(`http://localhost:8000/get_class_map`)
					.then((response) => response.json()).then((res) => {
						setLabelMap(() => {return res});
					});
				}
			)
		})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
	var im =  document.createElement('img');
    const [width, setWidth] = useState<number>(500)
    const [height, setHeight] = useState<number>(500)
    
	if(image){
		im.src = image
	}

	im.onload = () => {   
        if(500/im.height*im.width < 500){
            setWidth(500/im.height*im.width)
            setHeight(500)
        }
        else {
            setWidth(500)
            setHeight(500/im.width*im.height)
        }
    }

	console.log(props.labels)

	var rect: Array<any> = []

	if (props.labels[props.keys[props.keyIdx]].length > 0){
		for(var i = 0; i < props.labels[props.keys[props.keyIdx]].length; i++){
			const w = props.labels[props.keys[props.keyIdx]][i][3]*width
			const h = props.labels[props.keys[props.keyIdx]][i][4]*height
	
			const x = (500 - width)/2 + props.labels[props.keys[props.keyIdx]][i][1]*width  - w/2
			const y = (500 - height)/2 + props.labels[props.keys[props.keyIdx]][i][2]*height - h/2
	
			rect.push({x: Math.floor(x), y: Math.floor(y), h: Math.floor(h), w: Math.floor(w), class: props.labels[props.keys[props.keyIdx]][i][0], new: newRef})
		}
	}
	
	var rectGT: Array<any> = []

	if (labels.length > 0 && image) {

		for(var i = 0; i < labels.length; i++){
			const w = labels[i][3]*width
			const h = labels[i][4]*height

			const x = (500 - width)/2 + labels[i][1]*width  - w/2
			const y = (500 - height)/2 + labels[i][2]*height - h/2

			rectGT.push({x: Math.floor(x), y: Math.floor(y), h: Math.floor(h), w: Math.floor(w), class: labels[i][0], new: newRef})
		}
	}


	return(
		<>
			{
				<button key={'ccb'} onClick={() => {
					props.setModal(false)
					}} className="z-[39] bg-black/50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
					click to close
				</button>
			}
			<div className="text-sm z-40 dark:bg-gray-900 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white w-[1100px]  h-[650px]">
				<div className="flex flex-col h-full">
					<div className="w-full h-[50px] flex items-center justify-between p-2">
						<button onClick={() => {props.setModal(false)}} className="bg-red-500 w-4 h-4 hover:bg-red-300 rounded-full"></button>
						<div className="text-sm font-medium">{props.keys[props.keyIdx]}</div>
						<div></div>
					</div>
					<div className="w-full h-[550px] items-center justify-center flex gap-2">
						<div className="w-1/2 h-[500px] flex flex-col justify-start items-center text-sm font-medium">
							{
								'Prediction'
							}
							{
								(Object.keys(labelMap).length > 0 && image) ? 
								<CanvasBoundingBoxes new={newRef} loading={false} rect={rect}
								ww={500} wh={500} width={width} height={height} 
								updated_labels={updated_labels} setUsableStr={()=>{}}
								setUsableStr2={()=>{}} img={im}
								keyId={props.keyId} setEditing={()=>{}} labelMap={labelMap}
								selected={selectedLabel} setEdit={()=>{}}
								setSubmit={()=>{}} setnewLabels={()=>{}}
								editing={false} diff={true} setLabels={()=>{}} active={active}/> 
								: null
							}
						</div>
						<div className="w-1/2 h-[500px] flex flex-col justify-start items-center text-sm font-medium">
							{
								'Ground truth'
							}
							{
								(Object.keys(labelMap).length > 0 && image) ? 
								<CanvasBoundingBoxes new={newRef} loading={false} rect={rectGT}
								ww={500} wh={500} width={width} height={height} 
								updated_labels={updated_labels} setUsableStr={()=>{}}
								setUsableStr2={()=>{}} img={im}
								keyId={props.keyId} setEditing={()=>{}} labelMap={labelMap}
								selected={selectedLabel} setEdit={()=>{}}
								setSubmit={()=>{}} setnewLabels={()=>{}}
								editing={false} diff={true} setLabels={()=>{}} active={active}/> 
								: null
							}
						</div>
					</div>
					<div className="w-full px-5 h-fit flex gap-2 justify-end">
						<button onClick={()=>{fetch(`http://localhost:8000/add_tag?file=${props.keys[props.keyIdx]}&tag=${'prediction: false positive'}`)}} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
							False Positive
						</button>
						<button onClick={()=>{fetch(`http://localhost:8000/add_tag?file=${props.keys[props.keyIdx]}&tag=${'prediction: false negative'}`)}} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
							False Negative
						</button>
						<button onClick={()=>{fetch(`http://localhost:8000/add_tag?file=${props.keys[props.keyIdx]}&tag=${'To relabel'}`)}} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
							Relabel
						</button>
					</div>
				</div>
			</div>
		</>
	)
}