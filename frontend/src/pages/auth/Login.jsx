import { useState } from "react";
import { useUser } from "../../hooks/useUser.js"
import APIS, { publicApi } from "../../apis.js";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {

    const { user, setUser, loading } = useUser();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    if (loading) return <div>Loading...</div>;      // 🔹 ADD
    if (user) return <Navigate to="/" replace />;
    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(APIS.login, form, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // important to send/receive cookies
            });

            console.log("Login successful");

            setUser(res.data.user);
            navigate("/dashboard");
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };
    return (
        <div className="flex w-full h-screen">
            <div className="w-full lg:w-1/2 flex justify-center items-center bg-gray-50">
                <div className="w-full max-w-md px-8 py-10 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        Login to your account
                    </h2>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-medium text-gray-600">
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="johndoe@gmail.com"
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
                                placeholder="•••••••••••••••"
                                className="border-b-2 border-gray-300 bg-transparent outline-none focus:border-black transition"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className="w-full mt-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition hover:cursor-pointer"
                            onClick={() => { navigate('/signup') }}
                        >
                            New here? Signup
                        </button>


                    </form>


                </div>
            </div>
            <div className="hidden lg:block w-1/2 h-full">
                <img
                    src="trucks.jpg"
                    alt="Trucks"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>

    );

}

export default Login;
