import React, { useEffect, useState } from "react"
import ItemFileVersion from "../../Items/ItemFileVersion"

const FileHistoryList = (props) => {

    const [versions, setVersion] = useState([])

    useEffect(() => {
        const fetchVersions = () => {
            fetch('http://localhost:8000/key_versions?key='.concat(props.keyId).concat('&l=4&page=0'))
            .then((data) => data.json()).then((res) => {
                setVersion(Object.values(res.commits))
            })
        }

        fetchVersions()
    }, [])

    return (
        <>
            <div className="text-center py-5 font-light text-base flex flex-col">
                Datapoint Versions
            </div>
            <div className="w-[300px]">
                {
                    versions.map((data, index) => <ItemFileVersion  key={index.toString()} keyId={props.keyId} version={data.version} date={data.date} commit={data.commit}/>)
                }
            </div>
        </>
    )
}

export default FileHistoryList