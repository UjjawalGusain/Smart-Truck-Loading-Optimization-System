import { useEffect, useState } from "react";
import APIS, { privateApi } from "./../../apis.js";

const DashboardKpi = ({ warehouseId }) => {
    const [kpi, setKpi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchKpi = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await privateApi.get(`${APIS.getShipmentStats}/${warehouseId}`);
            setKpi(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch KPIs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKpi();
    }, [warehouseId]);

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-600">Loading KPIs...</div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-600">{error}</div>
        );
    }

    const { totalTrips, ongoingShipments, bookedShipments, routeOptimizationPercentage, costOptimizationPercentage, co2saved } = kpi;

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">Warehouse Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-xl p-5 flex flex-col items-center">
                    <span className="text-gray-500">Total Trips</span>
                    <span className="text-2xl font-bold">{totalTrips}</span>
                </div>

                <div className="bg-white shadow rounded-xl p-5 flex flex-col items-center">
                    <span className="text-gray-500">Ongoing Shipments</span>
                    <span className="text-2xl font-bold">{ongoingShipments}</span>
                </div>

                <div className="bg-white shadow rounded-xl p-5 flex flex-col items-center">
                    <span className="text-gray-500">Booked Shipments</span>
                    <span className="text-2xl font-bold">{bookedShipments}</span>
                </div>

                <div className="bg-white shadow rounded-xl p-5 flex flex-col items-center">
                    <span className="text-gray-500">Route Optimization Percentage</span>
                    <span className="text-2xl font-bold">{routeOptimizationPercentage}%</span>
                </div>

                <div className="bg-white shadow rounded-xl p-5 flex flex-col items-center">
                    <span className="text-gray-500">Cost Optimization Percentage</span>
                    <span className="text-2xl font-bold">{costOptimizationPercentage}%</span>
                </div>

                <div className="bg-white shadow rounded-xl p-5 flex flex-col items-center">
                    <span className="text-gray-500">CO2 Saved</span>
                    <span className="text-2xl font-bold">{co2saved}%</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardKpi;
