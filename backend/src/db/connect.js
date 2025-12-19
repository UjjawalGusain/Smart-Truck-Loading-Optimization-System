import mongoose from "mongoose";

const connectDB = async () => {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB connected successfully'))
        .catch((err) => {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        });
}

export default connectDB;
