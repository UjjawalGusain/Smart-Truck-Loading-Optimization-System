import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
    truckId: { type: mongoose.Schema.Types.ObjectId, ref: "Truck", default: null },
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },

    weightTons: { type: Number, required: true },
    volumeM3: { type: Number, required: true },
    numBoxes: { type: Number, required: true },
    origin: { type: String, default: null },
    destination: { type: String, required: true },
    deadline: { type: Date, required: true },

    splittable: { type: Boolean, default: true },
    stackable: { type: Boolean, default: true },
    hazardous: { type: Boolean, default: false },
    temperatureSensitive: { type: Boolean, default: false },

    status: {
        type: String,
        enum: ["PENDING", "OPTIMIZED", "BOOKED", "IN-TRANSIT"],
        default: "PENDING"
    }
}, { timestamps: true });

export const shipmentModel = mongoose.model("Shipment", shipmentSchema);
export default shipmentModel;
