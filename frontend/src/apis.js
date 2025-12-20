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
    signup: `${BASE_URL}/api/auth/signup`, // protected
    login: `${BASE_URL}/api/auth/login`, // protected
    verifyOtp: `${BASE_URL}/api/auth/verify-otp`, // protected
}

export default APIS;
