import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    userType: { type: String, enum: ["WAREHOUSE_USER", "TRUCK_DEALER"], required: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    verifyCode: { type: String },
    verifyCodeExpiry: { type: Date },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export const userModel = mongoose.model("User", userSchema);
export default userModel;
