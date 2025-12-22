import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser.js";
import APIS, { privateApi } from "../apis.js";
import DashboardHeader from "./WarehouseUserDashboard/DashboardHeader.jsx";
import ShipmentsSection from "./WarehouseUserDashboard/ShipmentsSections.jsx";
import AddWarehouse from "./WarehouseUserDashboard/AddWarehouse.jsx";
import DashboardKpi from "./WarehouseUserDashboard/DashboardKPI.jsx";
import ShipmentStatusBarChart from "./WarehouseUserDashboard/ShipmentStatusBarChart.jsx";

const WarehouseDashboard = () => {
    const { loading } = useUser();

    const [warehouse, setWarehouse] = useState(null);
    const [showAddWarehouse, setShowAddWarehouse] = useState(false);
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

    const handleFetchWarehouses = async () => {
        const res = await privateApi.get(APIS.getAllWarehouses);
        setWarehouse(res.data.warehouses?.[0] || null);
    };

    useEffect(() => {
        if (loading) return;

        let cancelled = false;

        const fetchWarehouses = async () => {
            try {
                const res = await privateApi.get(APIS.getAllWarehouses);
                if (!cancelled) {
                    setWarehouse(res.data.warehouses?.[0] || null);
                }
            } catch (err) {
                if (!cancelled) setWarehouse(null);
            }
        };

        fetchWarehouses();

        return () => {
            cancelled = true;
        };
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
                    <button
                        onClick={() => setShowAddWarehouse(true)}
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        Add Warehouse
                    </button>
                </div>

                {showAddWarehouse && (
                    <AddWarehouse
                        onClose={() => setShowAddWarehouse(false)}
                        onSuccess={handleFetchWarehouses}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div id="dashboard-pdf">
                <DashboardHeader
                    warehouse={warehouse}
                    onAddShipment={() => setShowAddShipment(true)}
                />
                <DashboardKpi warehouseId={warehouse._id} />
                <ShipmentStatusBarChart warehouseId={warehouse._id} />


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
                                            onChange={e =>
                                                setShipmentForm(f => ({
                                                    ...f,
                                                    weightTons: e.target.value
                                                }))
                                            }
                                            className="border rounded-lg px-3 py-2"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Volume (m³)"
                                            value={shipmentForm.volumeM3}
                                            onChange={e =>
                                                setShipmentForm(f => ({
                                                    ...f,
                                                    volumeM3: e.target.value
                                                }))
                                            }
                                            className="border rounded-lg px-3 py-2"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Number of boxes"
                                            value={shipmentForm.numBoxes}
                                            onChange={e =>
                                                setShipmentForm(f => ({
                                                    ...f,
                                                    numBoxes: e.target.value
                                                }))
                                            }
                                            className="col-span-2 border rounded-lg px-3 py-2"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Destination"
                                            value={shipmentForm.destination}
                                            onChange={e =>
                                                setShipmentForm(f => ({
                                                    ...f,
                                                    destination: e.target.value
                                                }))
                                            }
                                            className="col-span-2 border rounded-lg px-3 py-2"
                                        />
                                        <input
                                            type="date"
                                            value={shipmentForm.deadline}
                                            onChange={e =>
                                                setShipmentForm(f => ({
                                                    ...f,
                                                    deadline: e.target.value
                                                }))
                                            }
                                            className="col-span-2 border rounded-lg px-3 py-2"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-8">
                                        <button
                                            onClick={() => setShowAddShipment(false)}
                                            className="px-4 py-2 border rounded-lg hover:cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddShipment}
                                            className="px-5 py-2 bg-black text-white rounded-lg hover:cursor-pointer"
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
        </div>
    );
};

export default WarehouseDashboard;
