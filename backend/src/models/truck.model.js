import mongoose from "mongoose";

const truckSchema = new mongoose.Schema({
    truckDealerId: { type: mongoose.Schema.Types.ObjectId, ref: "TruckDealer", required: true },
    modelCode: { type: String, required: true },
    vin: { type: String, required: true, unique: true },
    modelYear: { type: Number, required: true },
    manufacturer: { type: String, required: true },
    primaryType: {
        type: String,
        enum: ["GENERAL_OPEN", "GENERAL_CLOSED", "REFRIGERATED", "TANKER", "BULK", "CAR_CARRIER", "LIVESTOCK", "LOW_BED", "COMBINATION"],
        required: true
    },
    pickupClass: { type: String },
    engineType: { type: String },
    engineCapacity: { type: String },
    transmissionType: { type: String },
    axleCount: { type: Number },
    wheelDrive: { type: String, enum: ["TWO_WHEEL", "FOUR_WHEEL"] },
    bedLength: { type: Number },
    maxWeightTons: { type: Number },
    maxVolumeM3: { type: Number },
    capabilities: { type: [String] }, // array of strings
    status: { type: String, enum: ["ACTIVE", "MAINTENANCE", "RETIRED"], default: "ACTIVE" },
    lastServiceDate: { type: Date },
    registrationNumber: { type: String, unique: true },
    fuelType: { type: String },
    grossVehicleWeightRating: { type: Number }
}, { timestamps: true });

export const truckModel = mongoose.model("Truck", truckSchema);
export default truckModel;
