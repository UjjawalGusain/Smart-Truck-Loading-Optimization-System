import { useUser } from "../../hooks/useUser.js";
import WarehouseDashboard from "../../components/WarehouseUserDashboard.jsx";
import TruckDealerDashboard from "../../components/TruckDealerDashboard.jsx";
import APIS, { privateApi } from "../../apis.js";
import axios from "axios";
import { useNavigation } from "react-router-dom";

const Dashboard = () => {
    const { user, loading, setUser } = useUser();
    const navigate = useNavigation();

    if (loading) return <div>Loading...</div>;

    const handleLogout = async () => {
        try {
            await privateApi.post(APIS.logout);
        } finally {
            setUser(null);
            navigate("/login");
        }
    };


    return (
        <div className="w-full h-full">

            <header className="h-12 px-6 flex items-center justify-between border-b bg-white">
                <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-gray-800">
                        {user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                        {user.email}
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="block text-xs text-gray-500">
                            {user.phoneNumber}
                        </span>
                        <span className="block text-xs font-medium text-gray-700">
                            {user.userType.replace("_", " ")}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100 hover:cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {user.userType === "WAREHOUSE_USER" && <WarehouseDashboard />}
            {user.userType === "TRUCK_DEALER" && <TruckDealerDashboard />}
        </div>
    );
};

export default Dashboard;
