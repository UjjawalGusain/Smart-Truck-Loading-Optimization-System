import { useState } from "react";

import APIS, { publicApi } from "../../apis.js";
import { useNavigate } from "react-router-dom";
const Signup = () => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        userType: "",
        password: ""
    });

    const navigate = useNavigate();

    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await publicApi.post(APIS.signup, form);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
        setIsOtpSent(true);
        console.log("OTP Sent");

        navigate("/verify-otp", {
            state: { email: form.email },
        });
    };

    return (
        <div className="flex w-full h-screen">
            <div className="hidden lg:block w-1/2 h-full">
                <img
                    src="trucks.jpg"
                    alt="Trucks"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-full lg:w-1/2 flex justify-center items-center bg-gray-50">
                <div className="w-full max-w-md px-8 py-10 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        Create Account
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="text-sm font-medium text-gray-600">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="border-b-2 border-gray-300 bg-transparent outline-none focus:border-black transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-medium text-gray-600">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="border-b-2 border-gray-300 bg-transparent outline-none focus:border-black transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="phone" className="text-sm font-medium text-gray-600">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="9876543210"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                className="border-b-2 border-gray-300 bg-transparent outline-none focus:border-black transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-600">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="border-b-2 border-gray-300 bg-transparent outline-none focus:border-black transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="userType" className="text-sm font-medium text-gray-600">
                                User Type
                            </label>
                            <select
                                id="userType"
                                name="userType"
                                value={form.userType}
                                onChange={handleChange}
                                className="border-b-2 border-gray-300 bg-transparent outline-none focus:border-black transition"
                            >
                                <option value="">Select user type</option>
                                <option value="WAREHOUSE_USER">Warehouse User</option>
                                <option value="TRUCK_DEALER">Truck Dealer</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                        >
                            Sign Up
                        </button>

                        <button
                            type="button"
                            className="w-full mt-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition hover:cursor-pointer"
                            onClick={() => { navigate('/login') }}
                        >
                            Already registered? Login
                        </button>
                    </form>
                    {isOtpSent && (<div className="mt-2">OTP sent to your email!</div>)}
                </div>
            </div>
        </div>
    );

};

export default Signup; 
