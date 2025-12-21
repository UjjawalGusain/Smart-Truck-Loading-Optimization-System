import * as ReactDOM from "react-dom";
import {
    createBrowserRouter
} from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import VerifyOtp from "./pages/auth/VerifyOtp.jsx";

import RootLayout from "./layouts/RootLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ProtectedRoute from "./layouts/ProtectedLayout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: "signup",
                        element: <Signup />
                    },
                    {
                        path: "verify-otp",
                        element: <VerifyOtp />
                    },
                    {
                        path: "login",
                        element: <Login />
                    }
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "",
                        element: <Dashboard />
                    },
                ]
            }
        ],
    },
]);

export default router;
