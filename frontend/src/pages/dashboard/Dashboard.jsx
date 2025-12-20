import { useUser } from "../../hooks/useUser.js";
import WarehouseDashboard from "../../components/WarehouseUserDashboard.jsx";
import TruckDealerDashboard from "../../components/TruckDealerDashboard.jsx";

const Dashboard = () => {
    const { user, loading } = useUser();

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full h-full">
            {user.userType === "WAREHOUSE_USER" && <WarehouseDashboard />}
            {user.userType === "TRUCK_DEALER" && <TruckDealerDashboard />}
        </div>
    );
};

export default Dashboard;
