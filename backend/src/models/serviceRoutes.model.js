import mongoose from "mongoose";

const serviceRouteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    distanceKm: { type: Number }
}, { timestamps: true });

export const serviceRouteModel = mongoose.model("ServiceRoute", serviceRouteSchema);
export default serviceRouteModel;
