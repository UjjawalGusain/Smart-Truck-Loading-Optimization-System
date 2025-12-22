import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const publicApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export const privateApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});


const APIS = {
    signup: `${BASE_URL}/api/auth/signup`,
    login: `${BASE_URL}/api/auth/login`,
    verifyOtp: `${BASE_URL}/api/auth/verify-otp`,

    logout: `${BASE_URL}/api/auth/logout`, //protected

    getMe: `${BASE_URL}/api/user/me`, //protected
    getAllWarehouses: `${BASE_URL}/api/warehouse/get-warehouses`, //protected

    createWarehouse: `${BASE_URL}/api/warehouse/create`, //protected
    bestFitTruck: `${BASE_URL}/api/warehouse/best-fit-truck`, //protected
    bestFitCalculator: `${BASE_URL}/api/warehouse/best-fit-calculator`, //protected
    bookedEmail: `${BASE_URL}/api/warehouse/booked-email`, //protected
    getShipmentStats: `${BASE_URL}/api/warehouse/shipment-stats`, //protected //:warehouseId

    createShipment: `${BASE_URL}/api/shipment`, //protected
    getShipments: `${BASE_URL}/api/shipment`, //protected
    updateShipment: `${BASE_URL}/api/shipment`, //protected
    deleteShipment: `${BASE_URL}/api/shipment`, //protected   /// /:shipmentId

    signAsTruckDealer: `${BASE_URL}/api/truck-dealer/sign`, //protected
    getTruckDealer: `${BASE_URL}/api/truck-dealer`, //protected
    getTruckDealerDashboardKPI: `${BASE_URL}/api/truck-dealer/dashboard-kpi`, //protected
    getTrucks: `${BASE_URL}/api/truck-dealer`, //protected //:truckDealerId


    createTrucks: `${BASE_URL}/api/truck/create-many`, //protected
    deleteTruck: `${BASE_URL}/api/truck`, //protected
    updateTruck: `${BASE_URL}/api/truck`, //protected
    getTruckStats: `${BASE_URL}/api/truck/truck-stats`, //protected /:truckDealerId



}

export default APIS;
