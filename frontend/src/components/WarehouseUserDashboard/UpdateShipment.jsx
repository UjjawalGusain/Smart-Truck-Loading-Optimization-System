import { useState } from "react";
import APIS, { privateApi } from "../../apis.js";

const shipmentStatusChangeAllowed = {
    "PENDING": "OPTIMIZED",
    "OPTIMIZED": "BOOKED",
    "BOOKED": "IN-TRANSIT",
    "IN-TRANSIT": "DELIVERED"
};

const UpdateShipment = ({ shipment, onClose, onSuccess }) => {
    const nextStatus = shipmentStatusChangeAllowed[shipment.status] || "";

    const [form, setForm] = useState({
        deadline: shipment.deadline ? shipment.deadline.split("T")[0] : "",
        changeStatus: nextStatus,
        truckId: shipment.assignedTruckId || ""
    });

    const [error, setError] = useState("");

    const handleUpdate = async () => {
        setError("");

        if (form.changeStatus && form.changeStatus !== nextStatus) {
            setError(`Cannot skip status. Next allowed status is ${nextStatus}.`);
            return;
        }

        if (form.changeStatus === "BOOKED" && !form.truckId) {
            setError("Truck ID is required to book a shipment.");
            return;
        }

        const payload = {
            shipmentId: shipment._id,
            ...(form.deadline && { deadline: form.deadline }),
            ...(form.changeStatus && { changeStatus: true }),
            ...(form.truckId && { truckId: form.truckId })
        };

        try {
            await privateApi.patch(APIS.updateShipment, payload);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Error updating shipment");
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-2xl border">
                    <h2 className="text-xl font-semibold mb-6">Update Shipment</h2>

                    {error && (
                        <div className="mb-4 text-red-600 text-sm">{error}</div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Update Deadline
                            </label>
                            <input
                                type="date"
                                value={form.deadline}
                                onChange={e =>
                                    setForm(f => ({ ...f, deadline: e.target.value }))
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black hover:cursor-pointer"
                            />
                        </div>


                        <div className="col-span-2 flex items-center justify-between border rounded-lg px-4 py-3 mt-2">
                            <span className="text-sm font-medium">
                                Change status to {nextStatus}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setForm(f => ({ ...f, changeStatus: f.changeStatus ? "" : nextStatus }))
                                }
                                className={`w-10 h-5 flex items-center rounded-full p-1 hover:cursor-pointer transition ${form.changeStatus === nextStatus ? "bg-black" : "bg-gray-300"
                                    }`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full shadow transform transition ${form.changeStatus === nextStatus ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>


                        {form.changeStatus === "BOOKED" && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Assign Truck (required for BOOKED)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Truck ID"
                                    value={form.truckId}
                                    onChange={e =>
                                        setForm(f => ({ ...f, truckId: e.target.value }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg text-sm hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="px-5 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 hover:cursor-pointer"
                        >
                            Update Shipment
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateShipment;
