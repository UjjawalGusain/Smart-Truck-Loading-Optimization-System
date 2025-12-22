import { useUser } from "../../hooks/useUser.js";
import WarehouseDashboard from "../../components/WarehouseUserDashboard.jsx";
import TruckDealerDashboard from "../../components/TruckDealerDashboard.jsx";
import APIS, { privateApi } from "../../apis.js";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";



const Dashboard = () => {
    const { user, loading, setUser } = useUser();
    const navigate = useNavigate();

    if (loading) return <div>Loading...</div>;

    const handleLogout = async () => {
        try {
            await privateApi.post(APIS.logout);
        } finally {
            setUser(null);
            navigate("/login");
        }
    };


    const exportDashboardPDF = async () => {
        const element = document.getElementById("dashboard-pdf");
        if (!element) return;

        element.classList.add("pdf-export");

        await html2pdf()
            .set({
                margin: 10,
                filename: "dashboard.pdf",
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                },
            })
            .from(element)
            .save();

        element.classList.remove("pdf-export");
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

                <button
                    onClick={exportDashboardPDF}
                    className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
                >
                    Export PDF
                </button>

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
