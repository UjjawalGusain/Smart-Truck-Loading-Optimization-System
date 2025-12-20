import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser.js";
import APIS, { privateApi } from "../apis.js";

const WarehouseDashboard = () => {
    const { user, loading } = useUser();
    const [warehouse, setWarehouse] = useState({});

    // In future we can extend it to support multiple warehouses per user
    useEffect(() => {
        if (!loading) {
            const fetchWarehouses = async () => {
                try {
                    const res = await privateApi.get(APIS.getAllWarehouses);
                    console.log("Warehouse:", res.data.warehouses[0]);
                    setWarehouse(res.data.warehouses[0]);
                } catch (error) {
                    console.error(error.response?.data || error.message);
                }
            };
            fetchWarehouses();
        }
    }, [loading]);

    if (loading) return <div>Loading...</div>;

    if (Object.keys(warehouse).length === 0) {
        return (
            <div>
                Add warehouse
            </div>
        )
    }

    return (
        <div>
            <header className="h-24 border-2 flex">
                <div>{warehouse.name}</div>
            </header>


        </div>
    );
};

export default WarehouseDashboard;
