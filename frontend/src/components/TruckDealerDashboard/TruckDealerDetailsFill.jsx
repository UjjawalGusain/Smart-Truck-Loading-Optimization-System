import { useState } from "react";
import APIS, { privateApi } from "../../apis.js";

const TruckDealerDetailsFill = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({
        companyName: "",
        address: "",
        licenseNumber: ""
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {

            await privateApi.post(APIS.signAsTruckDealer, {
                companyName: form.companyName,
                address: form.address,
                licenseNumber: form.licenseNumber,
            })
            onSuccess?.();
            onClose();
        } catch (error) {
            const message = error.response?.data?.message || "Failed to sign you as a truck dealer";
            setError(message);
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-2xl border"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-xl font-semibold mb-6">
                        Fill your details
                    </h2>

                    {error && (
                        <div className="mb-4 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                License Number
                            </label>
                            <input
                                type="text"
                                name="licenseNumber"
                                aria-levelalue={form.licenseNumber}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg text-sm hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-5 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 hover:cursor-pointer disabled:opacity-60"
                        >
                            {loading ? "Creating..." : "Sign as Truck Dealer"}
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default TruckDealerDetailsFill;
