const DeleteShipment = ({ shipmentId, onClose, onDelete }) => {
    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-2xl border">
                    <h2 className="text-xl font-semibold mb-4 text-red-600">
                        Delete Shipment
                    </h2>

                    <p className="text-gray-600 text-sm mb-6">
                        Are you sure you want to delete this shipment? This action cannot be undone.
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg text-sm hover:cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => onDelete(shipmentId)}
                            className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm hover:opacity-90 hover:cursor-pointer"
                        >
                            Delete Shipment
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteShipment;

