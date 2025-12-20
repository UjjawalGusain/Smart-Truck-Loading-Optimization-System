import { useUser } from "../context/authContext.jsx";

const WarehouseDashboard = () => {
    const { user, loading } = useUser();

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            WarehouseDashboard
        </div>
    );
};

export default WarehouseDashboard;
