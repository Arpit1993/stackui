import { useEffect } from "react";
import Explorer from "./explorer/Explorer";
import Infobar from "./infobar/Infobar"
import Stats from "./stats/Stats"

// Surrogate JSONs in the meantime
import currentJson from "/Users/bernardo/.stack/Users/bernardo/dataset1/current.json"
import historyJson from "/Users/bernardo/.stack/Users/bernardo/dataset1/history.json"

const Dataset = () => {
    const files = [];
    const commits = [];
    
    console.log(currentJson)

    for(var i = 0; i < currentJson.keys.length; i++){
        files.push({
            name: currentJson.keys[i],
            last_modified: Date(currentJson.lm[i]*1000),
            thumbnail: 'data:image/png;base64,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'
        })
    }

    for(var i = Object.keys(historyJson).length; i > 0; i--){
        for (var k = 0; k < historyJson[i]['commits'].length; k++){
            console.log()
            commits.push({
                author: 'a',
                comment: 'b',
                date: historyJson[i]['date']
            })
        }
    }

    const description = "placeholder text";
    const dataprops = {dataset: 'Dataset1', URI: 's3://stacktest123/dataset1'};

    let props = {files: files, dataprops: dataprops};

    return (
        <div className='flex justify-between'>
            <div className='w-full'> 
                <Stats props={files}/>
                <Explorer props={props} />
            </div>
            <Infobar commits={commits} description={description}/>
        </div>
    )
}

export default Dataset;