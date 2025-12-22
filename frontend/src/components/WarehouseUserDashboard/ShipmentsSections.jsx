import { MdDeleteOutline } from "react-icons/md";
import { CgPlayTrackNextR } from "react-icons/cg";
import { FaCalculator } from "react-icons/fa6";
import { useState } from "react";
import UpdateShipment from "./UpdateShipment.jsx";
import DeleteShipment from "./DeleteShipment.jsx";
import BestFitTruckCalculator from "./BestFitTruckCalculator.jsx";
import BestFitCalculator from "./BestFitCalculator.jsx";
import APIS, { privateApi } from "../../apis.js";

const ShipmentsSection = ({
    shipments,
    filters,
    setFilters,
    page,
    setPage,
    totalPages,
    setShipments,
}) => {
    const limit = 10;

    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [activeShipmentId, setActiveShipmentId] = useState(null);

    const handleDeleteShipment = async (shipmentId) => {
        try {
            await privateApi.delete(`${APIS.deleteShipment}/${shipmentId}`);
            setShipments(s => s.filter(sh => sh._id !== shipmentId));
            setShowDelete(false);
            setActiveShipmentId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateShipment = async (shipmentId, data) => {
        try {
            const res = await privateApi.patch(APIS.updateShipment, {
                shipmentId,
                ...data,
            });
            setShipments(s =>
                s.map(sh => (sh._id === shipmentId ? res.data.shipment : sh))
            );
            setShowUpdate(false);
            setActiveShipmentId(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow flex gap-4 flex-wrap">
                <select
                    value={filters.status}
                    onChange={e =>
                        setFilters(f => ({ ...f, status: e.target.value }))
                    }
                    className="border rounded px-3 py-2 hover:cursor-pointer"
                >
                    <option value="">All Status</option>
                    <option value="PENDING">PENDING</option>
                    <option value="OPTIMIZED">OPTIMIZED</option>
                    <option value="BOOKED">BOOKED</option>
                    <option value="IN-TRANSIT">IN-TRANSIT</option>
                </select>

                <input
                    type="text"
                    placeholder="Destination"
                    value={filters.destination}
                    onChange={e =>
                        setFilters(f => ({ ...f, destination: e.target.value }))
                    }
                    className="border rounded px-3 py-2"
                />

                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={filters.fromDate}
                        onChange={e =>
                            setFilters(f => ({ ...f, fromDate: e.target.value }))
                        }
                        className="border rounded-lg px-3 py-2"
                    />
                    <span className="text-gray-400 text-sm">→</span>
                    <input
                        type="date"
                        value={filters.toDate}
                        onChange={e =>
                            setFilters(f => ({ ...f, toDate: e.target.value }))
                        }
                        className="border rounded-lg px-3 py-2"
                    />
                </div>

                <button
                    onClick={() => {
                        setFilters({
                            status: "",
                            destination: "",
                            fromDate: "",
                            toDate: "",
                        });
                        setPage(1);
                    }}
                    className="px-4 py-2 border rounded hover:cursor-pointer"
                >
                    Reset
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm text-gray-600">
                        <tr>
                            <th className="px-4 py-3">Serial No.</th>
                            <th className="px-4 py-3">Destination</th>
                            <th className="px-4 py-3">Weight</th>
                            <th className="px-4 py-3">Volume</th>
                            <th className="px-4 py-3">Boxes</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Deadline</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.map((s, idx) => (
                            <tr key={s._id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    {(page - 1) * limit + idx + 1}
                                </td>
                                <td className="px-4 py-3">{s.destination}</td>
                                <td className="px-4 py-3">{s.weightTons}</td>
                                <td className="px-4 py-3">{s.volumeM3}</td>
                                <td className="px-4 py-3">{s.numBoxes}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                                        {s.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(s.deadline).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setActiveShipmentId(s._id);
                                                setShowDelete(true);
                                            }}
                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                        >
                                            <MdDeleteOutline className="size-5" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveShipmentId(s._id);
                                                setShowUpdate(true);
                                            }}
                                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                                        >
                                            <CgPlayTrackNextR className="size-5" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveShipmentId(s._id);
                                                setShowCalculator(true);
                                            }}
                                            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                        >
                                            <FaCalculator />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between items-center px-4 py-3 border-t">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {showCalculator && activeShipmentId && (
                <BestFitTruckCalculator
                    shipmentId={activeShipmentId}
                    shipmentStatus={
                        shipments.find(s => s._id === activeShipmentId)?.status
                    }
                />
            )}

            <BestFitCalculator />

            {showUpdate && activeShipmentId && (
                <UpdateShipment
                    shipment={shipments.find(sh => sh._id === activeShipmentId)}
                    onClose={() => {
                        setShowUpdate(false);
                        setActiveShipmentId(null);
                    }}
                    onUpdate={handleUpdateShipment}
                />
            )}

            {showDelete && activeShipmentId && (
                <DeleteShipment
                    shipmentId={activeShipmentId}
                    onClose={() => {
                        setShowDelete(false);
                        setActiveShipmentId(null);
                    }}
                    onDelete={handleDeleteShipment}
                />
            )}
        </div>
    );
};

export default ShipmentsSection;
