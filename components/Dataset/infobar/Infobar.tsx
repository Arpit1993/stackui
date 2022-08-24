import Commit from "./Commit";
const Infobar = (props) => {
    return (
        <div className='h- p-2 w-80 flex-none shadow-lg'>
            <div className="p-4">
                <h2 className='text-center p-4'>
                    Description
                </h2>
                <p className='text-xs p-4 '>
                    {props.description} 
                </p>
            </div>

            <div className="p-1">
                <h2 className='text-center p-4 text-bold under'>
                    Activity
                </h2>
                <ul className="text-xs font-medium rounded-lg border 
                text-gray-900 bg-white border-gray-200
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {props.commits.map((cmit) => <Commit author={cmit.author} comment={cmit.comment} date={cmit.date}/>)}
                </ul>
            </div>
        </div>
    )
}

export default Infobar;