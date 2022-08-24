import TopBar from "./topbar/topbar";
import FileExplorer from "./FileExplorer/FileExplorer";

const Explorer = (props) => {

    return (
        <div className="p-2">
            <div className="shadow-">
                <TopBar props={props.props.dataprops} />
            </div>

            <div className="h-30 py-5 px-5 shadow-md">
                <FileExplorer files={props.props.files}/>
            </div>
        </div>
    )
}

export default Explorer;