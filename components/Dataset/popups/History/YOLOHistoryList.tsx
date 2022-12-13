import React, { useEffect, useState } from "react"
import ItemFileVersion from "../../Items/ItemFileVersion"

const YOLOHistoryList = (props) => {

    const [versionsImage, setVersionImage] = useState([])
    const [versionsLabel, setVersionLabel] = useState([])
    const [labelName, setlabelName] = useState('')

    useEffect(() => {
        const fetchVersions = () => {
            fetch('http://localhost:8000/key_versions?key='.concat(props.keyId).concat('&l=2&page=0'))
            .then((data) => data.json()).then((res) => {
                setVersionImage(Object.values(res.commits))
            })
            fetch('http://localhost:8000/label_versions?key='.concat(props.keyId).concat('&l=2&page=0'))
            .then((data) => data.json()).then((res) => {
                if (!(Object.keys(res).length == 0)){
                    setVersionLabel(Object.values(res.commits))
                    setlabelName(res.keyId)
                }
            })
        }
        fetchVersions()
    }, [props])

    return (
        <>
            <div className="text-center py-5 font-light text-base flex flex-col">
                Image Versions
            </div>
            <div className="w-full">
                {
                    versionsImage.map((data, index) => <ItemFileVersion noClick={index == 0} key={`${index.toString()}image`} keyId={props.keyId} version={data.version} date={data.date} commit={data.commit}/>)
                }
            </div>
            <div className="text-center py-5 font-light text-base flex flex-col">
                Label Versions
            </div>
            <div className="w-full">
                {
                    versionsLabel.map((data, index) => <ItemFileVersion noClick={index == 0} key={`${index.toString()}label`} keyId={labelName} version={data.version} date={data.date} commit={data.commit}/>)
                }
            </div>
        </>
    )
}

export default YOLOHistoryList