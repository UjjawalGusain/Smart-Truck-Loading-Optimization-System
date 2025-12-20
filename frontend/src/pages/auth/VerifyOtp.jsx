import { useRef, useState } from "react";
import APIS, { publicApi } from "../../apis.js";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const navigate = useNavigate();
    const { state } = useLocation();
    const email = state?.email;
    const inputRefs = useRef([]);

    const handleKeyDown = (e, index) => {
        if (
            !/^[0-9]$/.test(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "Tab"
        ) {
            e.preventDefault();
        }

        if (e.key === "Backspace") {
            e.preventDefault();

            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1].focus();
            }
        }
    };


    const handleInput = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text");
        if (!/^\d{6}$/.test(text)) return;
        setOtp(text.split(""));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");

        if (otpValue.length !== 6) return;

        try {
            await publicApi.post(APIS.verifyOtp, {
                email,
                otp: otpValue
            });
        } catch (error) {
            console.error(error.response?.data || error.message);
        }

        console.log("OTP verified!");
        navigate('/login');
    };

    return (
        <div className="flex w-full h-screen">
            <div className="hidden lg:block w-1/2 h-full">
                <img
                    src="warehouse.jpg"
                    alt="Warehouse"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-full lg:w-1/2 flex justify-center items-center bg-gray-50">
                <div className="w-full max-w-md px-8 py-10 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        Verify OTP
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    onChange={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}

                                    onPaste={handlePaste}
                                    className="w-12 h-14 text-center text-2xl border border-gray-300 rounded-lg outline-none focus:border-black transition"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                        >
                            Verify
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
