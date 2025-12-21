import { useState } from "react";
import APIS, { privateApi } from "../../apis.js";

const UpdateTruck = ({ truck, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        status: truck.status || "",
        lastServiceDate: truck.lastServiceDate
            ? truck.lastServiceDate.split("T")[0]
            : "",
        registrationNumber: truck.registrationNumber || "",
        fuelType: truck.fuelType || "",
        capabilities: truck.capabilities?.join(", ") || "",
        maxWeightTons: truck.maxWeightTons ?? "",
        maxVolumeM3: truck.maxVolumeM3 ?? ""
    });

    const [error, setError] = useState("");

    const handleUpdate = async () => {
        setError("");

        const payload = {
            truckId: truck._id
        };

        if (form.status && form.status !== truck.status) {
            payload.status = form.status;
        }

        if (form.lastServiceDate) {
            payload.lastServiceDate = new Date(form.lastServiceDate).toISOString();
        }

        if (form.registrationNumber !== truck.registrationNumber) {
            payload.registrationNumber = form.registrationNumber;
        }

        if (form.fuelType !== truck.fuelType) {
            payload.fuelType = form.fuelType;
        }

        if (form.capabilities !== truck.capabilities?.join(", ")) {
            payload.capabilities = form.capabilities
                .split(",")
                .map(c => c.trim())
                .filter(Boolean);
        }

        if (form.maxWeightTons !== "" && form.maxWeightTons !== truck.maxWeightTons) {
            payload.maxWeightTons = Number(form.maxWeightTons);
        }

        if (form.maxVolumeM3 !== "" && form.maxVolumeM3 !== truck.maxVolumeM3) {
            payload.maxVolumeM3 = Number(form.maxVolumeM3);
        }

        if (Object.keys(payload).length === 1) {
            setError("No changes to update.");
            return;
        }

        try {
            await privateApi.patch(APIS.updateTruck, payload);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Error updating truck");
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
                    <h2 className="text-xl font-semibold mb-6">Update Truck</h2>

                    {error && (
                        <div className="mb-4 text-red-600 text-sm">{error}</div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Status
                            </label>
                            <select
                                value={form.status}
                                onChange={e =>
                                    setForm(f => ({ ...f, status: e.target.value }))
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value="">Select status</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="MAINTENANCE">MAINTENANCE</option>
                                <option value="RETIRED">RETIRED</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Last Service Date
                            </label>
                            <input
                                type="date"
                                value={form.lastServiceDate}
                                onChange={e =>
                                    setForm(f => ({ ...f, lastServiceDate: e.target.value }))
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Registration Number
                            </label>
                            <input
                                type="text"
                                value={form.registrationNumber}
                                onChange={e =>
                                    setForm(f => ({ ...f, registrationNumber: e.target.value }))
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Fuel Type
                            </label>
                            <input
                                type="text"
                                value={form.fuelType}
                                onChange={e =>
                                    setForm(f => ({ ...f, fuelType: e.target.value }))
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Capabilities (comma separated)
                            </label>
                            <input
                                type="text"
                                value={form.capabilities}
                                onChange={e =>
                                    setForm(f => ({ ...f, capabilities: e.target.value }))
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Max Weight (tons)
                            </label>
                            <input
                                type="number"
                                value={form.maxWeightTons}
                                onChange={e =>
                                    setForm(f => ({ ...f, maxWeightTons: e.target.value }))
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Max Volume (m³)
                            </label>
                            <input
                                type="number"
                                value={form.maxVolumeM3}
                                onChange={e =>
                                    setForm(f => ({ ...f, maxVolumeM3: e.target.value }))
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="px-5 py-2 bg-black text-white rounded-lg text-sm"
                        >
                            Update Truck
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateTruck;
