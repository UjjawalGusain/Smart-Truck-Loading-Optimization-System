import mongoose from "mongoose";

const shipmentEventSchema = new mongoose.Schema({
    shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment", required: true },
    status: {
        type: String,
        enum: ["PENDING", "OPTIMIZED", "BOOKED", "IN-TRANSIT"],
        required: true
    },
    location: { type: String, required: true },
    timestamp: { type: Date, required: true }
}, { timestamps: true });

export const shipmentEventModel = mongoose.model("ShipmentEvent", shipmentEventSchema);
export default shipmentEventModel;
