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

    getMe: `${BASE_URL}/api/user/me`, //protected
    getAllWarehouses: `${BASE_URL}/api/warehouse/get-warehouses`, //protected

}

export default APIS;
