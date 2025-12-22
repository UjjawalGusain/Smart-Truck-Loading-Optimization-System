import { MdDeleteOutline, MdBuild } from "react-icons/md";
import { useState } from "react";
import APIS, { privateApi } from "../../apis.js";
import UpdateTruck from "./UpdateTruck.jsx";

const TruckSection = ({
    trucks,
    filters,
    setFilters,
    page,
    setPage,
    totalPages,
    setTrucks,
}) => {
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDeleteTruck = async (truckId) => {
        try {
            await privateApi.delete(APIS.deleteTruck, {
                data: { truckId }
            });
            setTrucks(t => t.filter(tr => tr._id !== truckId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            {selectedTruck && (
                <UpdateTruck
                    truck={selectedTruck}
                    onClose={() => setSelectedTruck(null)}
                    onSuccess={() => {
                        setSelectedTruck(null);
                        setLoading(true);
                        setTimeout(() => setLoading(false), 0);
                    }}
                />
            )}

            <div className="bg-white p-4 rounded-lg shadow flex gap-4 flex-wrap">
                <select
                    value={filters.primaryType}
                    onChange={e => setFilters(f => ({ ...f, primaryType: e.target.value }))}
                    className="border rounded px-3 py-2 hover:cursor-pointer"
                >
                    <option value="">All Types</option>
                    <option value="GENERAL_OPEN">GENERAL_OPEN</option>
                    <option value="GENERAL_CLOSED">GENERAL_CLOSED</option>
                    <option value="REFRIGERATED">REFRIGERATED</option>
                    <option value="TANKER">TANKER</option>
                    <option value="BULK">BULK</option>
                </select>

                <select
                    value={filters.status}
                    onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                    className="border rounded px-3 py-2 hover:cursor-pointer"
                >
                    <option value="">All Status</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="RETIRED">RETIRED</option>
                </select>

                <button
                    onClick={() => {
                        setFilters({ primaryType: "", status: "" });
                        setPage(1);
                    }}
                    className="px-4 py-2 border rounded hover:cursor-pointer"
                >
                    Reset
                </button>
            </div>


            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left">

                        <thead className="bg-gray-100 text-sm text-gray-600">
                            <tr>
                                <th className="px-4 py-3">Model Code</th>
                                <th className="px-4 py-3">VIN</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Capacity</th>
                                <th className="px-4 py-3">Status</th>

                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trucks.map(tr => (
                                <tr key={tr._id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">{tr.modelCode}</td>
                                    <td className="px-4 py-3">{tr.vin}</td>
                                    <td className="px-4 py-3">{tr.primaryType}</td>
                                    <td className="px-4 py-3">
                                        {tr.maxWeightTons} T / {tr.maxVolumeM3} m³
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                                            {tr.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedTruck(tr)}
                                                className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition hover:cursor-pointer"
                                            >
                                                <MdBuild className="size-5" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteTruck(tr._id)}
                                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition hover:cursor-pointer"
                                            >
                                                <MdDeleteOutline className="size-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center px-4 py-3 border-t">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50 hover:cursor-pointer"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50 hover:cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TruckSection;
