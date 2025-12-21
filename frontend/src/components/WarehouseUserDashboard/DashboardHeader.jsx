const DashboardHeader = ({ warehouse, onAddShipment }) => {
    return (
        <header className="h-20 bg-white border-b flex items-center justify-between px-8">
            <div>
                <h1 className="text-xl font-semibold">{warehouse.name}</h1>
                <p className="text-sm text-gray-500">{warehouse.address}</p>
            </div>

            <button
                onClick={onAddShipment}
                className="px-4 py-2 bg-black text-white rounded hover:cursor-pointer"
            >
                Add Shipment
            </button>
        </header>
    );
};

export default DashboardHeader;
