const DashboardHeader = ({ truckDealer, onAddTrucks }) => {
    return (
        <header className="h-20 bg-white border-b flex items-center justify-between px-8">
            <div>
                <h1 className="text-xl font-semibold">{truckDealer.companyName}</h1>
                <p className="text-sm text-gray-500">{truckDealer.address}</p>
            </div>

            <button
                onClick={onAddTrucks}
                className="px-4 py-2 bg-black text-white rounded hover:cursor-pointer"
            >
                Add Trucks
            </button>
        </header>
    );
};

export default DashboardHeader;
