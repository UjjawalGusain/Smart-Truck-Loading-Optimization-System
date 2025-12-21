import { useEffect, useState } from "react";
import APIS, { privateApi } from "./../../apis.js";

const DashboardKpi = () => {
    const [kpi, setKpi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchKpi = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await privateApi.get(APIS.getTruckDealerDashboardKPI);
            setKpi(data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch KPIs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKpi();
    }, []);

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

    const { totalTrucks, truckStatusBreakdown, capacity } = kpi;

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">Truck Dealer Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white shadow rounded-xl p-5 flex flex-col items-center">
                    <span className="text-gray-500">Total Trucks</span>
                    <span className="text-2xl font-bold">{totalTrucks}</span>
                </div>

                {["ACTIVE", "MAINTENANCE", "RETIRED"].map(status => (
                    <div key={status} className="bg-white shadow rounded-xl p-5 flex flex-col items-center">
                        <span className="text-gray-500">{status}</span>
                        <span className="text-2xl font-bold">
                            {truckStatusBreakdown[status] ?? 0}
                        </span>
                    </div>
                ))}

                <div className="bg-white shadow rounded-xl p-5 flex flex-col items-center col-span-1 sm:col-span-2 lg:col-span-1">
                    <span className="text-gray-500">Total Capacity</span>
                    <span className="text-sm text-gray-600">
                        Max Weight: <strong>{capacity.maxWeightTons} tons</strong>
                    </span>
                    <span className="text-sm text-gray-600">
                        Max Volume: <strong>{capacity.maxVolumeM3} m³</strong>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DashboardKpi;
