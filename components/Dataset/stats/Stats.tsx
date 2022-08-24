const Stats = (props) => {
    return (
        <div className="flex-auto">
            <div className='py-2'>
                Stats
            </div>
            
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                <div className="p-4 bg-black text-white rounded-md flex items-center justify-center shadow-sm">Datapoints</div>
                <div className="p-4 bg-black text-white rounded-md flex items-center justify-center shadow-sm">Commits</div>
                <div className="p-4 bg-black text-white rounded-md flex items-center justify-center shadow-sm">Collaborators</div>
            </div>
        </div>
    )
}

export default Stats;