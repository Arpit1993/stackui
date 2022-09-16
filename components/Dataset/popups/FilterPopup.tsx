import React from "react"

const FilterPopup = (props) => {

    const component = props.popup ? [
        <div className="bg-white w-full h-[100px] border-[0.5px] border-gray-500">
            <div className="w-full justify-between flex h-[30px]">
                <button onClick={() => props.setPopup(0)} className= 'flex justify-center text-center w-[50px] h-[30px] flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
                <div></div>
            </div>
        </div>
    ] : [<></>]

    return (
        <>
            {component}
        </>
    )
}

export default FilterPopup