import { useState } from "react";
import APIS, { privateApi } from "../../apis.js";

const BestFitCalculator = () => {
    const [form, setForm] = useState({
        origin: "",
        destination: "",
        boxVolumeM3: "",
        boxWeightTons: "",
        numBoxes: "",
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleCalculate = async () => {
        setError("");
        setResult(null);

        const {
            origin,
            destination,
            boxVolumeM3,
            boxWeightTons,
            numBoxes,
        } = form;

        if (
            !origin ||
            !destination ||
            !boxVolumeM3 ||
            !boxWeightTons ||
            !numBoxes
        ) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                origin,
                destination,
                boxVolumeM3: Number(boxVolumeM3),
                boxWeightTons: Number(boxWeightTons),
                numBoxes: Number(numBoxes),
            };

            const res = await privateApi.post(
                APIS.bestFitCalculator,
                payload
            );

            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to calculate best-fit truck"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow border p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
                Best-Fit Truck Calculator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    placeholder="Origin"
                    className="border rounded-lg px-3 py-2"
                />

                <input
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    placeholder="Destination"
                    className="border rounded-lg px-3 py-2"
                />

                <input
                    name="numBoxes"
                    type="number"
                    min="1"
                    value={form.numBoxes}
                    onChange={handleChange}
                    placeholder="Number of boxes"
                    className="border rounded-lg px-3 py-2"
                />

                <input
                    name="boxVolumeM3"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.boxVolumeM3}
                    onChange={handleChange}
                    placeholder="Volume per box (m³)"
                    className="border rounded-lg px-3 py-2"
                />

                <input
                    name="boxWeightTons"
                    type="number"
                    step="0.001"
                    min="0"
                    value={form.boxWeightTons}
                    onChange={handleChange}
                    placeholder="Weight per box (tons)"
                    className="border rounded-lg px-3 py-2"
                />
            </div>

            <button
                onClick={handleCalculate}
                disabled={loading}
                className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
                {loading ? "Calculating..." : "Find Best Truck"}
            </button>

            {error && (
                <div className="text-sm text-red-600">
                    {error}
                </div>
            )}

            {result && !result.bestTruck && (
                <div className="text-sm text-gray-600 font-medium mt-4">
                    No suitable trucks found for this shipment.
                </div>
            )}


            {result?.bestTruck && (
                <div className="mt-6 border-t pt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Best Match
                    </h3>

                    <div className="p-4 rounded-lg border bg-gray-50">
                        <div className="font-medium">
                            Truck Model: {result.bestTruck.modelCode}
                        </div>
                        <div className="text-sm text-gray-600">
                            Max Volume: {result.bestTruck.maxVolumeM3} m³
                        </div>
                        <div className="text-sm text-gray-600">
                            Max Weight: {result.bestTruck.maxWeightTons} tons
                        </div>
                        <div className="text-sm text-gray-600">
                            Utilization Score:{" "}
                            {(result.bestTruck.utilizationScore * 100).toFixed(1)}%
                        </div>
                    </div>



                    {result.allCandidates?.length > 1 && (
                        <>
                            <h4 className="text-sm font-medium text-gray-700">
                                Other Suitable Trucks
                            </h4>
                            <div className="space-y-2">
                                {result.allCandidates.slice(1).map(truck => (
                                    <div
                                        key={truck._id}
                                        className="p-3 border rounded-lg text-sm"
                                    >
                                        {truck.modelCode} —{" "}
                                        {(truck.utilizationScore * 100).toFixed(1)}%
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BestFitCalculator;
