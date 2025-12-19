import mongoose from "mongoose";

const warehouseUserSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
    role: { type: String },
    permissions: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ["PENDING", "ACTIVE", "REJECTED"], default: "PENDING" }
}, { timestamps: true });

warehouseUserSchema.index({ userId: 1, warehouseId: 1 }, { unique: true });

export const warehouseUserModel = mongoose.model("WarehouseUser", warehouseUserSchema);
export default warehouseUserModel;
