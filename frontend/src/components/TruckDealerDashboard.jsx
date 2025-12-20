import { useUser } from "../hooks/useUser.js";

const TruckDealerDashboard = () => {
    const { user, loading } = useUser();

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            TruckDealerDashboard
        </div>
    );
};

export default TruckDealerDashboard;
