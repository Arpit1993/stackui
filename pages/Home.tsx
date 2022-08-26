import Dataset from "../components/Dataset/Dataset"
export default function Main () {    
    return (
        <div>
            <div className='p-10 text-5xl flex flex-col justify-center items-center font-bold h-max text-center'>
                Welcome to stack! 👋 
            </div>
            <div className='text-xl  flex flex-col justify-center items-center text-center p-20'> 
                You don't have any updates 
            </div>

            <div className='px-20 flex justify-between gap-2'> 
                <a href='/dataset/test'>
                    <div className='border-2  flex flex-col justify-center items-center border-blue-300 text-center rounded-3xl w-[300px] h-[300px] p-20'> 
                        See your dataset 
                    </div>
                </a>
                <a href ='/Pulls'>
                    <div className='border-2  flex flex-col justify-center items-center border-blue-300 text-center rounded-3xl w-[300px] h-[300px] p-20'> 
                        See your pull requests
                    </div>
                </a>
                <a href ='https://www.getstack.ai/'>
                    <div className='border-2  flex flex-col justify-center items-center border-blue-300 text-center rounded-3xl w-[300px] h-[300px] p-20'> 
                        Learn more about stack
                    </div>
                </a>
            </div>
        </div>
    )
}