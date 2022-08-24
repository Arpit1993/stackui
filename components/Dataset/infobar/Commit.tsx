const Commit = (props) => {
    return (
        <div>
            <li className=" py-4 px-4 justify-between flex w-full hover:bg-gray-300 rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                <div className="underline w-10 truncate">
                    {props.author}
                </div>
                <div className="w-30 truncate">
                    {props.comment}
                </div>
                <div className="underline w-20 truncate">
                    {props.date}
                </div>
            </li>
        </div>
    )
}

export default Commit;