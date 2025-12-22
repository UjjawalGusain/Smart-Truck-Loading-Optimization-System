import { useState, useEffect } from "react";
import APIS, { privateApi } from "../../apis.js";
import { MdOutlineLocalShipping, MdSpeed, MdAttachMoney } from "react-icons/md";
import { useMockGPS } from "../../hooks/useMockGPS.js";

const BestFitTruckCalculator = ({ shipmentId, shipmentStatus }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [booking, setBooking] = useState(false);

    const isTracking = shipmentStatus === "IN-TRANSIT";
    const location = useMockGPS(isTracking);
    const cacheKey = shipmentId ? `bestFitTruck:${shipmentId}` : null;


    useEffect(() => {
        if (!shipmentId) return;

        const fetchBestTruck = async () => {
            setError("");
            setResult(null);
            setLoading(true);

            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                setResult(JSON.parse(cached));
                setLoading(false);
                return;
            }

            try {
                const res = await privateApi.post(APIS.bestFitTruck, { shipmentId });
                setResult(res.data);

                localStorage.setItem(cacheKey, JSON.stringify(res.data));

                if (res.data.bestTruck && shipmentStatus === "PENDING") {
                    setTimeout(async () => {
                        await privateApi.patch(APIS.updateShipment, {
                            shipmentId,
                            changeStatus: true
                        });
                    }, 300);
                }

            } catch (err) {
                console.log(err);
                setError("Error calculating best-fit truck");
            } finally {
                setLoading(false);
            }
        };

        fetchBestTruck();
    }, [shipmentId]);



    const bookBestTruck = async () => {
        if (!result?.bestTruck?._id) return;

        setBooking(true);
        setError("");

        try {
            if (shipmentStatus === "OPTIMIZED") {
                console.log("result: ", result);
                await privateApi.patch(APIS.updateShipment, {
                    shipmentId,
                    truckId: result.bestTruck._id,
                    changeStatus: true
                });

                await privateApi.post(APIS.bookedEmail, { shipmentId, truckId: result.bestTruck._id });

                alert("Email sent to the dealer");

                localStorage.removeItem(cacheKey);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error booking truck");
        } finally {
            setBooking(false);
        }
    };


    if (!shipmentId) return null;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-xl space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Best-Fit Truck Calculator</h1>

            {loading && <div className="text-gray-600">Calculating best truck...</div>}
            {error && <div className="text-red-600 font-medium">{error}</div>}

            {result && (
                <div className="mt-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Best Truck Result</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2">
                            <MdOutlineLocalShipping className="text-2xl text-gray-700" />
                            <span className="font-medium">Truck Model:</span>
                            <span>{result.bestTruck.modelCode}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <MdSpeed className="text-2xl text-gray-700" />
                            <span className="font-medium">Utilization:</span>
                            <span>{(result.bestTruck.utilizationScore * 100).toFixed(1)}%</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <MdAttachMoney className="text-2xl text-gray-700" />
                            <span className="font-medium">Capacity:</span>
                            <span>
                                {result.bestTruck.maxVolumeM3} m³ / {result.bestTruck.maxWeightTons} T
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium">Route:</span>
                            <span>
                                {result.bestTruck.routeInfo.startLocation} →{" "}
                                {result.bestTruck.routeInfo.endLocation}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-700 mt-4">
                        Other Candidate Trucks
                    </h3>

                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                        {result.allCandidates.map(truck => (
                            <div
                                key={truck._id}
                                className="p-3 border rounded-lg bg-white shadow hover:bg-gray-50 transition"
                            >
                                <div className="flex justify-between">
                                    <span className="font-medium">{truck.modelCode}</span>
                                    <span className="text-gray-500">
                                        {(truck.utilizationScore * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {truck.routeInfo.startLocation} →{" "}
                                    {truck.routeInfo.endLocation} |{" "}
                                    {truck.maxVolumeM3} m³ / {truck.maxWeightTons} T
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={bookBestTruck}
                        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-60 transition"
                        disabled={shipmentStatus !== "OPTIMIZED" && shipmentStatus !== "PENDING" || booking}
                    >

                        {shipmentStatus !== "OPTIMIZED" && shipmentStatus !== "PENDING"
                            ? "Shipment Already Booked"
                            : booking
                                ? "Booking Truck..."
                                : "Book This Truck"}
                    </button>
                    {shipmentStatus === "IN-TRANSIT" && location && (
                        <div className="mt-4 p-3 border rounded-lg bg-blue-50 text-sm">
                            <div className="font-medium text-blue-800">
                                Live Truck Location (Mock)
                            </div>
                            <div className="text-blue-700">
                                Latitude: {location.lat.toFixed(4)} <br />
                                Longitude: {location.lng.toFixed(4)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BestFitTruckCalculator;
