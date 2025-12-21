import { useState } from "react";
import APIS, { privateApi } from "../../apis.js";

const emptyTruck = {
    modelCode: "",
    vin: "",
    modelYear: null,
    manufacturer: "",
    primaryType: "",
    pickupClass: null,
    engineType: null,
    engineCapacity: null,
    transmissionType: null,
    axleCount: null,
    wheelDrive: null,
    bedLength: null,
    maxWeightTons: null,
    maxVolumeM3: null,
    capabilities: [],
    status: "ACTIVE",
    lastServiceDate: null,
    registrationNumber: null,
    fuelType: null,
    grossVehicleWeightRating: null,
    serviceRoutes: []
};

const cloneTruck = truck => ({
    ...truck,
    vin: "",
    registrationNumber: ""
});

const Field = ({ label, required, children }) => (
    <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-600">
            {label} {required && <span className="text-red-500">*</span>}
        </span>
        {children}
    </label>
);

const inputClass =
    "px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black/20 bg-white";

const AddTrucks = ({ onClose, onSuccess }) => {
    const [trucks, setTrucks] = useState([{ ...emptyTruck }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateTruck = (index, key, value) => {
        setTrucks(t =>
            t.map((truck, i) => (i === index ? { ...truck, [key]: value } : truck))
        );
    };

    const addEmptyTruck = () => {
        setTrucks(t => [...t, { ...emptyTruck }]);
    };

    const copyTruck = index => {
        setTrucks(t => [...t, cloneTruck(t[index])]);
    };

    const removeTruck = index => {
        setTrucks(t => t.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);
        try {
            await privateApi.post(APIS.createTrucks, trucks);
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
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                        {error && <div className="text-sm text-red-600">{error}</div>}

                        {trucks.map((truck, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 border rounded-xl p-5 space-y-5"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">Truck #{index + 1}</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyTruck(index)}
                                            className="px-3 py-1 text-sm border rounded hover:cursor-pointer"
                                        >
                                            Copy
                                        </button>
                                        {trucks.length > 1 && (
                                            <button
                                                onClick={() => removeTruck(index)}
                                                className="px-3 py-1 text-sm border text-red-600 rounded"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Field label="Model Code" required>
                                        <input
                                            className={inputClass}
                                            value={truck.modelCode}
                                            onChange={e =>
                                                updateTruck(index, "modelCode", e.target.value)
                                            }
                                        />
                                    </Field>

                                    <Field label="VIN(unique can't clone)" required>
                                        <input
                                            className={inputClass}
                                            value={truck.vin}
                                            onChange={e => updateTruck(index, "vin", e.target.value)}
                                        />
                                    </Field>

                                    <Field label="Registration Number(unique can't clone)" required>
                                        <input
                                            className={inputClass}
                                            value={truck.registrationNumber || ""}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "registrationNumber",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Field>

                                    <Field label="Manufacturer" required>
                                        <input
                                            className={inputClass}
                                            value={truck.manufacturer}
                                            onChange={e =>
                                                updateTruck(index, "manufacturer", e.target.value)
                                            }
                                        />
                                    </Field>

                                    <Field label="Model Year" required>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={truck.modelYear ?? ""}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "modelYear",
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </Field>

                                    <Field label="Primary Type" required>
                                        <select
                                            className={inputClass}
                                            value={truck.primaryType}
                                            onChange={e =>
                                                updateTruck(index, "primaryType", e.target.value)
                                            }
                                        >
                                            <option value=""></option>
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
                                            ].map(v => (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>

                                    <Field label="Pickup Class">
                                        <input
                                            className={inputClass}
                                            value={truck.pickupClass || ""}
                                            onChange={e =>
                                                updateTruck(index, "pickupClass", e.target.value)
                                            }
                                        />
                                    </Field>

                                    <Field label="Engine Type">
                                        <input
                                            className={inputClass}
                                            value={truck.engineType || ""}
                                            onChange={e =>
                                                updateTruck(index, "engineType", e.target.value)
                                            }
                                        />
                                    </Field>

                                    <Field label="Engine Capacity">
                                        <input
                                            className={inputClass}
                                            value={truck.engineCapacity || ""}
                                            onChange={e =>
                                                updateTruck(index, "engineCapacity", e.target.value)
                                            }
                                        />
                                    </Field>

                                    <Field label="Transmission">
                                        <input
                                            className={inputClass}
                                            value={truck.transmissionType || ""}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "transmissionType",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Field>

                                    <Field label="Axle Count">
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={truck.axleCount ?? ""}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "axleCount",
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </Field>

                                    <Field label="Wheel Drive">
                                        <select
                                            className={inputClass}
                                            value={truck.wheelDrive || ""}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "wheelDrive",
                                                    e.target.value || null
                                                )
                                            }
                                        >
                                            <option value=""></option>
                                            <option value="TWO_WHEEL">TWO_WHEEL</option>
                                            <option value="FOUR_WHEEL">FOUR_WHEEL</option>
                                        </select>
                                    </Field>

                                    <Field label="Bed Length">
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={truck.bedLength ?? ""}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "bedLength",
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </Field>

                                    <Field label="Max Weight (tons)" required>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={truck.maxWeightTons ?? ""}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "maxWeightTons",
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </Field>

                                    <Field label="Max Volume (m³)" required>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={truck.maxVolumeM3 ?? ""}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "maxVolumeM3",
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </Field>

                                    <Field label="Fuel Type">
                                        <input
                                            className={inputClass}
                                            value={truck.fuelType || ""}
                                            onChange={e =>
                                                updateTruck(index, "fuelType", e.target.value)
                                            }
                                        />
                                    </Field>

                                    <Field label="Gross Vehicle Weight Rating">
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={truck.grossVehicleWeightRating ?? ""}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "grossVehicleWeightRating",
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </Field>

                                    <Field label="Last Service Date">
                                        <input
                                            type="date"
                                            className={inputClass}
                                            value={truck.lastServiceDate || ""}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "lastServiceDate",
                                                    e.target.value || null
                                                )
                                            }
                                        />
                                    </Field>

                                    <Field label="Capabilities">
                                        <input
                                            className={inputClass}
                                            value={truck.capabilities.join(", ")}
                                            onChange={e =>
                                                updateTruck(
                                                    index,
                                                    "capabilities",
                                                    e.target.value
                                                        .split(",")
                                                        .map(v => v.trim())
                                                        .filter(Boolean)
                                                )
                                            }
                                        />
                                    </Field>




                                    <Field label="Service Routes (one per line)" required>
                                        <textarea
                                            rows={4}
                                            className={inputClass}
                                            placeholder={
                                                `Format: Name | Start Location | End Location | Distance (km)
Example:
Route 1 | Warehouse A | Warehouse B | 120
Route 2 | Warehouse B | Warehouse C | 200`
                                            }
                                            value={truck._serviceRoutesText ?? truck.serviceRoutes
                                                .map(r => `${r.name} | ${r.startLocation} | ${r.endLocation} | ${r.distanceKm ?? ""}`)
                                                .join("\n")}
                                            onChange={e => {
                                                const text = e.target.value;
                                                updateTruck(index, "_serviceRoutesText", text);
                                            }}
                                            onBlur={e => {
                                                const text = e.target.value;
                                                const routes = text
                                                    .split("\n")
                                                    .filter(Boolean)
                                                    .map(line => {
                                                        const [name, startLocation, endLocation, distanceKm] = line.split("|").map(s => s.trim());
                                                        return {
                                                            name,
                                                            startLocation,
                                                            endLocation,
                                                            distanceKm: distanceKm ? Number(distanceKm) : null
                                                        };
                                                    });
                                                updateTruck(index, "serviceRoutes", routes);
                                                updateTruck(index, "_serviceRoutesText", undefined); // optional, remove temp
                                            }}
                                        />
                                    </Field>



                                    <Field label="Status">
                                        <select
                                            className={inputClass}
                                            value={truck.status}
                                            onChange={e =>
                                                updateTruck(index, "status", e.target.value)
                                            }
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

                    <div className="px-6 py-4 border-t flex justify-between">
                        <button
                            onClick={addEmptyTruck}
                            className="px-4 py-2 border rounded hover:cursor-pointer"
                        >
                            + Add Truck
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border rounded hover:cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-black text-white rounded disabled:opacity-60 hover:cursor-pointer"
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
