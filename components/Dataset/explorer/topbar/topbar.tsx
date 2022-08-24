const TopBar = (props) => {
    return (    
        <div className="flex w-full justify-between ">
            <div className="pr-10 py-2 w-min">
                <div className="px-2 py-2 text-lg text-bolder"> {props.props.dataset} </div>
                <div className="px-2 py-2 text-sm underline"> 
                    <a href={props.props.URI}> {props.props.URI} </a>
                </div>
            </div>

            <div className="w-full py-6 text-black inline-block align-middle">
                <form className="px-5">
                    <label className="flex justify-end gap-2"> 
                        <div className="">
                            <input className="p-2 shadow-inner rounded-lg border 
                            border-gray-600 outline-2" placeholder="Filter" type="text" />   
                        </div>
                        <input className="bg-gray-200 rounded-lg px-2 shadow-inner hover:bg-gray-400 border-2 border-gray-400" type="submit"/>
                    </label> 
                </form> 
            </div>
        </div>
    )
}

export default TopBar;