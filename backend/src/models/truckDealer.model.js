import mongoose from "mongoose";

const truckDealerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String, required: true },
    fleetSize: { type: Number },
    address: { type: String },
    licenseNumber: { type: String },
    operatingRegions: { type: [String] } // array of cities/regions
}, { timestamps: true });

export const truckDealerModel = mongoose.model("TruckDealer", truckDealerSchema);
export default truckDealerModel;
