import jwt from "jsonwebtoken";
import User from "./../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No access token provided" });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired access token" });
        }

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default verifyJWT;
