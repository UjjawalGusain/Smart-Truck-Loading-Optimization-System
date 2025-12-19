import mongoose from "mongoose";

const truckServiceRouteSchema = new mongoose.Schema({
    truckId: { type: mongoose.Schema.Types.ObjectId, ref: "Truck", required: true },
    serviceRouteId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRoute", required: true },
    sequenceOrder: { type: Number }
}, { timestamps: true });

truckServiceRouteSchema.index({ truckId: 1, serviceRouteId: 1 }, { unique: true });

export const truckServiceRouteModel = mongoose.model("TruckServiceRoute", truckServiceRouteSchema);
export default truckServiceRouteModel;
