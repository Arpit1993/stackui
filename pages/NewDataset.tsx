import { useState } from "react"
import LoadingScreen from "../components/LoadingScreen"

export default function NewDatasets() {        

    const [loading , setLoading ] = useState(0)
    const [uri , setURI ] = useState('')
    const [name, setName] = useState('')
    const [instructions, setInstruction] = useState('If using cloud storage (GCS or AWS S3) please setup your API keys in a .env file')

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleURIChange = (event) => {
        setURI(event.target.value)
        if (uri.includes('s3')){
            setInstruction('Add your AWS Access Key ID and AWS Secret Access Key to /home/.env')
        } else if (uri.includes('gs')) {
            setInstruction('Add your service account credentials .json as GOOGLE_APPLICATION_CREDENTIALS to /home/.env')
        } else {
            setInstruction('If using cloud storage (GCS or AWS S3) please setup your API keys in a .env file')
        }
    }

    const handleSubmit = async () => {    
        if (uri.length > 0){
            setLoading(true)
            const response = await fetch('http://127.0.0.1:8000/init?uri='.concat(encodeURIComponent(uri)).concat('&name=').concat(encodeURIComponent(name))).then( (res) => res.json())
            if (response.success) {
                window.location.href='/dataset/'.concat(encodeURIComponent(name));
            } else {
                window.location.href='/';
            }

        }
    }

    const InputForm = [
            <div className="p-5 mt-5 mb-5 h-[600px] shadow-lg flex flex-col"  key={'ip'}>
                
                <div className="flex mb-2">
                    <div className="align-middle flex flex-col justify-center text-sm w-[130px] mr-2">
                        Dataset name: 
                    </div>
                    <form className="bg-white shadow-md rounded w-[320px]">
                        <label className="block text-gray-700 text-sm"> 
                            <div className="">
                                <input onChange={handleNameChange}
                                className= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                placeholder="e.g. My Dataset" type="text" />   
                            </div>
                        </label>
                    </form>
                </div>

                <div className="flex">
                    <div className="align-middle flex flex-col justify-center w-[130px] text-sm mr-2">
                        Dataset path or URI: 
                    </div>
                    <form className="bg-white shadow-md rounded w-[320px]">
                        <label className="block text-gray-700 text-sm"> 
                            <div className="">
                                <input onChange={handleURIChange}
                                className= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                placeholder="e.g. s3://bucket/dataset or /path/to/dataset/" type="text" />   
                            </div>
                        </label>
                    </form>
                </div>

                <a className="text-xs underline mt-2 text-blue-500 hover:underline hover:text-gray-500" href="https://www.getstack.ai/">
                    {instructions}
                </a>

                <div className="mt-5 justify-self-end">
                    <button onClick={() => handleSubmit()} className="w-[200px] text-center transition p-3 bg-black font-thin text-white hover:bg-gray-300 hover:text-black">
                        SUBMIT
                    </button>
                </div>

            </div>
    ]

    const LoadingComp = loading ? [<LoadingScreen msg={'Setting up'}  key={'ldc'}/>] : [<></>]

    return (
        <>  
            {LoadingComp}
            {InputForm}
        </>
    )
}