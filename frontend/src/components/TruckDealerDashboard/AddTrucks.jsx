import { useState } from "react";
import APIS, { privateApi } from "../../apis.js";

const emptyTruck = {
    modelCode: "",
    vin: "",
    modelYear: "",
    manufacturer: "",
    primaryType: "",
    pickupClass: "",
    engineType: "",
    engineCapacity: "",
    transmissionType: "",
    axleCount: "",
    wheelDrive: "",
    bedLength: "",
    maxWeightTons: "",
    maxVolumeM3: "",
    capabilities: [],
    status: "ACTIVE",
    lastServiceDate: "",
    registrationNumber: "",
    fuelType: "",
    grossVehicleWeightRating: "",
    serviceRoutes: []
};

const cloneTruck = (truck) => ({
    ...truck,
    vin: "",
    registrationNumber: ""
});

const Field = ({ label, children }) => (
    <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-600">{label}</span>
        {children && (
            <div className="children">
                {children}
            </div>
        )}
    </label>
);

const AddTrucks = ({ onClose, onSuccess }) => {
    const [trucks, setTrucks] = useState([{ ...emptyTruck }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateTruck = (index, key, value) => {
        setTrucks(t =>
            t.map((truck, i) =>
                i === index ? { ...truck, [key]: value } : truck
            )
        );
    };

    const addEmptyTruck = () => {
        setTrucks(t => [...t, { ...emptyTruck }]);
    };

    const copyTruck = (index) => {
        setTrucks(t => [...t, cloneTruck(t[index])]);
    };

    const removeTruck = (index) => {
        setTrucks(t => t.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            await privateApi.post(APIS.createTrucks, { trucks });
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add trucks");
        } finally {
            setLoading(false);
        }
    };

    return (

        <>
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <div
                    className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold">Add Trucks</h2>
                        <p className="text-sm text-gray-500">
                            Add one or multiple trucks. You can copy existing entries.
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                        {error && (
                            <div className="text-sm text-red-600">{error}</div>
                        )}

                        {trucks.map((truck, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 border rounded-xl p-5 space-y-5"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-800">
                                        Truck #{index + 1}
                                    </h3>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyTruck(index)}
                                            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                                        >
                                            Copy
                                        </button>

                                        {trucks.length > 1 && (
                                            <button
                                                onClick={() => removeTruck(index)}
                                                className="px-3 py-1 text-sm border text-red-600 rounded hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Field label="Model Code">
                                        <input
                                            value={truck.modelCode}
                                            onChange={e => updateTruck(index, "modelCode", e.target.value)}
                                            className="border-1 border-black outline-none ring-0 focus:ring-0 focus:outline-none shadow-none bg-transparent hover:cursor-pointer"
                                        />
                                    </Field>

                                    <Field label="VIN">
                                        <input
                                            value={truck.vin}
                                            onChange={e => updateTruck(index, "vin", e.target.value)}
                                            className="border-1 border-black outline-none ring-0 focus:ring-0 focus:outline-none shadow-none bg-transparent hover:cursor-pointer"
                                        />

                                    </Field>

                                    <Field label="Registration Number">
                                        <input
                                            value={truck.registrationNumber}
                                            onChange={e =>
                                                updateTruck(index, "registrationNumber", e.target.value)
                                            }
                                            className="border-1 border-black outline-none ring-0 focus:ring-0 focus:outline-none shadow-none bg-transparent hover:cursor-pointer"
                                        />
                                    </Field>

                                    <Field label="Manufacturer">
                                        <input
                                            value={truck.manufacturer}
                                            onChange={e =>
                                                updateTruck(index, "manufacturer", e.target.value)
                                            }
                                            className="border-1 border-black outline-none ring-0 focus:ring-0 focus:outline-none shadow-none bg-transparent hover:cursor-pointer"
                                        />
                                    </Field>

                                    <Field label="Model Year">
                                        <input
                                            type="number"
                                            value={truck.modelYear}
                                            onChange={e =>
                                                updateTruck(index, "modelYear", e.target.value)
                                            }
                                            className="border-1 border-black outline-none ring-0 focus:ring-0 focus:outline-none shadow-none bg-transparent hover:cursor-pointer"
                                        />
                                    </Field>

                                    <Field label="Primary Type">
                                        <select
                                            value={truck.primaryType}
                                            onChange={e =>
                                                updateTruck(index, "primaryType", e.target.value)
                                            }
                                            className="border-1 border-black outline-none ring-0 focus:ring-0 focus:outline-none shadow-none bg-transparent hover:cursor-pointer"
                                        >
                                            <option value="">Select</option>
                                            {[
                                                "GENERAL_OPEN",
                                                "GENERAL_CLOSED",
                                                "REFRIGERATED",
                                                "TANKER",
                                                "BULK",
                                                "CAR_CARRIER",
                                                "LIVESTOCK",
                                                "LOW_BED",
                                                "COMBINATION"
                                            ].map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </Field>

                                    <Field label="Max Weight (tons)">
                                        <input
                                            type="number"
                                            value={truck.maxWeightTons}
                                            onChange={e =>
                                                updateTruck(index, "maxWeightTons", e.target.value)
                                            }
                                            className="border-none outline-none ring-0 focus:ring-0 focus:outline-none shadow-none bg-transparent hover:cursor-pointer"
                                        />
                                    </Field>

                                    <Field label="Max Volume (m³)">
                                        <input
                                            type="number"
                                            value={truck.maxVolumeM3}
                                            onChange={e =>
                                                updateTruck(index, "maxVolumeM3", e.target.value)
                                            }
                                            className="border-none outline-none ring-0 focus:ring-0 focus:outline-none shadow-none bg-transparent hover:cursor-pointer"
                                        />
                                    </Field>

                                    <Field label="Status">
                                        <select
                                            value={truck.status}
                                            onChange={e =>
                                                updateTruck(index, "status", e.target.value)
                                            }
                                            className="border-none outline-none ring-0 focus:ring-0 focus:outline-none shadow-none bg-transparent hover:cursor-pointer"
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="MAINTENANCE">MAINTENANCE</option>
                                            <option value="RETIRED">RETIRED</option>
                                        </select>
                                    </Field>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 py-4 border-t flex justify-between items-center bg-white">
                        <button
                            onClick={addEmptyTruck}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            + Add Truck
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-black text-white rounded disabled:opacity-60"
                            >
                                {loading ? "Adding..." : "Add Trucks"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddTrucks;
