import { useUser } from "../hooks/useUser.js";
import { useState, useEffect } from "react";
import APIS, { privateApi } from "../apis.js";
import TruckDealerDetailsFill from "./TruckDealerDashboard/TruckDealerDetailsFill.jsx";
import DashboardHeader from "./TruckDealerDashboard/DashboardHeader.jsx";
import AddTrucks from "./TruckDealerDashboard/AddTrucks.jsx"


const TruckDealerDashboard = () => {
    const { loading } = useUser();

    const [truckDealer, setTruckDealer] = useState(null);
    const [showSignTruckDealer, setShowSignTruckDealer] = useState(false);
    const [showAddTrucks, setShowAddTrucks] = useState(false);

    const handleFetchTruckDealer = async () => {
        const res = await privateApi.get(APIS.getTruckDealer);
        setTruckDealer(res.data.truckDealer || null);
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

        return () => { cancelled = true };
    }, [loading]);

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
                <AddTrucks onClose={() => setShowAddTrucks(false)} />
            )}
        </div>
    );
};


export default TruckDealerDashboard;
