import { useUser } from "../hooks/useUser.js";
import { useState, useEffect } from "react";
import APIS, { privateApi } from "../apis.js";
import TruckDealerDetailsFill from "./TruckDealerDashboard/TruckDealerDetailsFill.jsx";
import DashboardHeader from "./TruckDealerDashboard/DashboardHeader.jsx";
import AddTrucks from "./TruckDealerDashboard/AddTrucks.jsx";
import DashboardKpi from "./TruckDealerDashboard/DashboardKPI.jsx";
import TruckSection from "./TruckDealerDashboard/TruckSection.jsx";

const TruckDealerDashboard = () => {
    const { loading } = useUser();

    const [truckDealer, setTruckDealer] = useState(null);
    const [showSignTruckDealer, setShowSignTruckDealer] = useState(false);
    const [showAddTrucks, setShowAddTrucks] = useState(false);

    const [trucks, setTrucks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        primaryType: "",
        status: ""
    });

    const handleFetchTruckDealer = async () => {
        const res = await privateApi.get(APIS.getTruckDealer);
        setTruckDealer(res.data.truckDealer || null);
    };

    const fetchTrucks = async () => {
        if (!truckDealer?._id) return;

        const res = await privateApi.get(
            `${APIS.getTrucks}/${truckDealer._id}`,
            {
                params: {
                    page,
                    limit: 10,
                    primaryType: filters.primaryType || undefined,
                    status: filters.status || undefined
                }
            }
        );

        setTrucks(res.data.trucks);
        setTotalPages(res.data.totalPages);
    };

    useEffect(() => {
        if (loading) return;

        let cancelled = false;

        const fetchDealer = async () => {
            try {
                const res = await privateApi.get(APIS.getTruckDealer);
                if (!cancelled) {
                    setTruckDealer(res.data.truckDealer || null);
                }
            } catch {
                if (!cancelled) setTruckDealer(null);
            }
        };

        fetchDealer();

        return () => {
            cancelled = true;
        };
    }, [loading]);

    useEffect(() => {
        fetchTrucks();
    }, [truckDealer, page, filters]);

    if (!truckDealer) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="p-6 border rounded-lg shadow-sm text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Your details need to be filled
                    </h2>
                    <p className="text-gray-500 mb-4">
                        Please fill your details to sign as truck dealer
                    </p>
                    <button
                        onClick={() => setShowSignTruckDealer(true)}
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        Fill my details
                    </button>
                </div>

                {showSignTruckDealer && (
                    <TruckDealerDetailsFill
                        onClose={() => setShowSignTruckDealer(false)}
                        onSuccess={handleFetchTruckDealer}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                truckDealer={truckDealer}
                onAddTrucks={() => setShowAddTrucks(true)}
            />

            {showAddTrucks && (
                <AddTrucks
                    onClose={() => setShowAddTrucks(false)}
                    onSuccess={fetchTrucks}
                />
            )}

            <div className="px-6 py-6 space-y-6">
                <DashboardKpi />

                <TruckSection
                    trucks={trucks}
                    setTrucks={setTrucks}
                    filters={filters}
                    setFilters={setFilters}
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
};

export default TruckDealerDashboard;
