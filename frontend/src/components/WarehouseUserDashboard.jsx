import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser.js";
import APIS, { privateApi } from "../apis.js";
import DashboardHeader from "./WarehouseUserDashboard/DashboardHeader.jsx";
import ShipmentsSection from "./WarehouseUserDashboard/ShipmentsSections.jsx";

const WarehouseDashboard = () => {
    const { loading } = useUser();
    const [warehouse, setWarehouse] = useState(null);
    const [showAddShipment, setShowAddShipment] = useState(false);
    const [shipments, setShipments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState({
        status: "",
        destination: "",
        fromDate: "",
        toDate: ""
    });

    const [shipmentForm, setShipmentForm] = useState({
        weightTons: "",
        volumeM3: "",
        numBoxes: "",
        destination: "",
        deadline: ""
    });

    const handleAddShipment = async () => {
        const payload = {
            warehouseId: warehouse._id,
            weightTons: Number(shipmentForm.weightTons),
            volumeM3: Number(shipmentForm.volumeM3),
            numBoxes: Number(shipmentForm.numBoxes),
            destination: shipmentForm.destination,
            deadline: shipmentForm.deadline || undefined
        };

        await privateApi.post(APIS.createShipment, payload);

        setShowAddShipment(false);
        setShipmentForm({
            weightTons: "",
            volumeM3: "",
            numBoxes: "",
            destination: "",
            deadline: ""
        });
        setPage(1);
    };

    useEffect(() => {
        if (!loading) {
            const fetchWarehouses = async () => {
                const res = await privateApi.get(APIS.getAllWarehouses);
                setWarehouse(res.data.warehouses?.[0] || null);
            };
            fetchWarehouses();
        }
    }, [loading]);

    useEffect(() => {
        if (!warehouse) return;

        const fetchShipments = async () => {
            const res = await privateApi.get(APIS.getShipments, {
                params: {
                    warehouseId: warehouse._id,
                    page,
                    limit: 10,
                    ...filters
                }
            });

            setShipments(res.data.shipments);
            setTotalPages(res.data.pagination.totalPages);
        };

        fetchShipments();
    }, [warehouse, page, filters]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }

    if (!warehouse) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="p-6 border rounded-lg shadow-sm text-center">
                    <h2 className="text-xl font-semibold mb-2">No Warehouse Found</h2>
                    <p className="text-gray-500 mb-4">
                        Please create a warehouse to continue.
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:cursor-pointer">
                        Add Warehouse
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                warehouse={warehouse}
                onAddShipment={() => setShowAddShipment(p => !p)}
            />

            <main className="p-8 space-y-6">


                {showAddShipment && (
                    <>
                        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-2xl border">
                                <h2 className="text-xl font-semibold mb-6">
                                    Create Shipment
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Weight (tons)"
                                        value={shipmentForm.weightTons}
                                        onChange={e => setShipmentForm(f => ({ ...f, weightTons: e.target.value }))}
                                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Volume (m³)"
                                        value={shipmentForm.volumeM3}
                                        onChange={e => setShipmentForm(f => ({ ...f, volumeM3: e.target.value }))}
                                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Number of boxes"
                                        value={shipmentForm.numBoxes}
                                        onChange={e => setShipmentForm(f => ({ ...f, numBoxes: e.target.value }))}
                                        className="col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Destination"
                                        value={shipmentForm.destination}
                                        onChange={e => setShipmentForm(f => ({ ...f, destination: e.target.value }))}
                                        className="col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    />

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Deadline
                                        </label>
                                        <input
                                            type="date"
                                            value={shipmentForm.deadline}
                                            onChange={e => setShipmentForm(f => ({ ...f, deadline: e.target.value }))}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black hover:cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    {[
                                        { key: "splittable", label: "Splittable", default: true },
                                        { key: "stackable", label: "Stackable", default: true },
                                        { key: "hazardous", label: "Hazardous", default: false },
                                        { key: "temperatureSensitive", label: "Temperature Sensitive", default: false }
                                    ].map(opt => (
                                        <div key={opt.key} className="flex items-center justify-between border rounded-lg px-4 py-3">
                                            <span className="text-sm font-medium">{opt.label}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShipmentForm(f => ({
                                                        ...f,
                                                        [opt.key]: f[opt.key] ?? opt.default ? false : true
                                                    }))
                                                }
                                                className={`w-10 h-5 flex items-center rounded-full p-1 hover:cursor-pointer transition ${shipmentForm[opt.key] ?? opt.default ? "bg-black" : "bg-gray-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-4 h-4 bg-white rounded-full shadow transform transition ${shipmentForm[opt.key] ?? opt.default
                                                        ? "translate-x-5"
                                                        : "translate-x-0"
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        onClick={() => setShowAddShipment(false)}
                                        className="px-4 py-2 border rounded-lg text-sm hover:cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddShipment}
                                        className="px-5 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 hover:cursor-pointer"
                                    >
                                        Create Shipment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <ShipmentsSection
                    shipments={shipments}
                    filters={filters}
                    setFilters={setFilters}
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                    setShipments={setShipments}
                />
            </main>
        </div>
    );
};

export default WarehouseDashboard;
