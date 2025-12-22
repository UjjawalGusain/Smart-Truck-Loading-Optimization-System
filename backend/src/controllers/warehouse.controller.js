import User from "./../models/user.model.js";
import Warehouse from "./../models/warehouse.model.js"
import WarehouseUser from "./../models/warehouseUser.model.js";
import Shipment from "./../models/shipment.model.js";
import Truck from "./../models/truck.model.js";
import TruckDealer from "./../models/truckDealer.model.js";
import ServiceRoute from "./../models/serviceRoutes.model.js";
import TruckServiceRoute from "./../models/truckServiceRoutes.model.js";
import transporter from "../services/nodemailerEmail.js";
import { object, string, number, mixed } from 'yup';
import mongoose from "mongoose";

const warehouseSchema = object({
    name: string().required("Warehouse name is required").min(3, "minimum 3 characters").max(16, "maximum 16 characters name"),
    address: string().required("Address is required").min(3, "minimum 3 characters"),
    capacityTons: number().required("Capacity is required(in tons)")
})

const bestFitTruckInputSchema = object({
    origin: string().required(),
    destination: string().required(),

    boxVolumeM3: number()
        .positive()
        .required(),

    boxWeightTons: number()
        .positive()
        .required(),

    numBoxes: number()
        .integer()
        .positive()
        .required()
});

class WarehouseController {

    async createWarehouse(req, res) {
        const session = await mongoose.startSession();

        try {
            const user = req.user;

            if (user.userType !== "WAREHOUSE_USER") {
                return res.status(403).json({ message: "User is not a warehouse user" });
            }

            const { name, address, capacityTons } = req.body;
            await warehouseSchema.validate({ name, address, capacityTons }, { abortEarly: false });

            session.startTransaction();



            const [newWarehouse] = await Warehouse.create(
                [{ name, address, capacityTons }],
                { session }
            );

            console.log("Warehouse created: ", newWarehouse);

            console.log({
                userId: user._id,
                warehouseId: newWarehouse._id,
                role: "admin",
                permission: ["create", "read", "write", "update"],
                status: "ACTIVE",
            })
            try {
                await WarehouseUser.create(
                    [{
                        userId: user._id,
                        warehouseId: newWarehouse._id,
                        role: "admin",
                        permission: ["create", "read", "write", "update"],
                        status: "ACTIVE",
                    }],
                    { session }
                );

            } catch (error) {
                return res.status(500).json({ message: "Error creating warehouse user association", error });
            }


            console.log("Warehouse user created: ");

            await session.commitTransaction();

            return res.status(201).json({
                message: "Warehouse created successfully",
                warehouse: newWarehouse
            });

        } catch (error) {
            await session.abortTransaction();
            return res.status(500).json({ message: "Error creating warehouse" });
        } finally {
            session.endSession();
        }
    }

    async getAllWarehouses(req, res) {
        try {
            const allUserWarehouses = await WarehouseUser.find({ userId: req.user._id });

            const warehouseIds = allUserWarehouses.map(u => u.warehouseId);
            const warehouses = await Warehouse.find({ _id: { $in: warehouseIds } });

            return res.status(200).json({ message: "All warehouses sent", warehouses });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching warehouses", error });
        }
    }


    async bestFitTruck(req, res) {
        const { shipmentId } = req.body;

        try {
            const shipment = await Shipment.findById(shipmentId);

            if (!shipment) {
                return res.status(404).json({ message: "Shipment not found" });
            }

            const { weightTons, volumeM3, origin, destination } = shipment;

            const trucks = await Truck.aggregate([
                { $match: { status: "ACTIVE", maxVolumeM3: { $gte: volumeM3 }, maxWeightTons: { $gte: weightTons } } },
                {
                    $lookup: {
                        from: "truckserviceroutes",
                        localField: "_id",
                        foreignField: "truckId",
                        as: "serviceRoutes"
                    }
                },
                { $unwind: "$serviceRoutes" },
                {
                    $lookup: {
                        from: "serviceroutes",
                        localField: "serviceRoutes.serviceRouteId",
                        foreignField: "_id",
                        as: "routeInfo"
                    }
                },
                { $unwind: "$routeInfo" },
                {
                    $match: {
                        "routeInfo.startLocation": origin,
                        "routeInfo.endLocation": destination
                    }
                },
                {
                    $addFields: {
                        utilizationVolume: { $divide: [volumeM3, "$maxVolumeM3"] },
                        utilizationWeight: { $divide: [weightTons, "$maxWeightTons"] },
                    }
                },
                {
                    $addFields: {
                        utilizationScore: { $max: ["$utilizationVolume", "$utilizationWeight"] }
                    }
                },
                { $sort: { utilizationScore: -1 } }
            ]);

            if (!trucks.length) {

                return res.status(404).json({
                    message: "No suitable trucks available for this shipment",
                    trucks: []
                });

            }

            return res.status(200).json({
                bestTruck: trucks[0],
                allCandidates: trucks
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error finding best-fit truck", error: error.message });
        }
    }

    async bestFitTruckFromInput(req, res) {
        try {
            const {
                origin,
                destination,
                boxVolumeM3,
                boxWeightTons,
                numBoxes
            } = req.body;

            await bestFitTruckInputSchema.validate(
                { origin, destination, boxVolumeM3, boxWeightTons, numBoxes },
                { abortEarly: false }
            );

            const volumeM3 = boxVolumeM3 * numBoxes;
            const weightTons = boxWeightTons * numBoxes;

            const trucks = await Truck.aggregate([
                {
                    $match: {
                        status: "ACTIVE",
                        maxVolumeM3: { $gte: volumeM3 },
                        maxWeightTons: { $gte: weightTons }
                    }
                },
                {
                    $lookup: {
                        from: "truckserviceroutes",
                        localField: "_id",
                        foreignField: "truckId",
                        as: "serviceRoutes"
                    }
                },
                { $unwind: "$serviceRoutes" },
                {
                    $lookup: {
                        from: "serviceroutes",
                        localField: "serviceRoutes.serviceRouteId",
                        foreignField: "_id",
                        as: "routeInfo"
                    }
                },
                { $unwind: "$routeInfo" },
                {
                    $match: {
                        "routeInfo.startLocation": origin,
                        "routeInfo.endLocation": destination
                    }
                },
                {
                    $addFields: {
                        utilizationVolume: {
                            $divide: [volumeM3, "$maxVolumeM3"]
                        },
                        utilizationWeight: {
                            $divide: [weightTons, "$maxWeightTons"]
                        }
                    }
                },
                {
                    $addFields: {
                        utilizationScore: {
                            $max: ["$utilizationVolume", "$utilizationWeight"]
                        }
                    }
                },
                { $sort: { utilizationScore: -1 } }
            ]);

            if (!trucks.length) {
                return res.status(200).json({
                    message: "No suitable trucks available",
                    bestTruck: null,
                    allCandidates: []
                });
            }

            return res.status(200).json({
                inputSummary: {
                    origin,
                    destination,
                    volumeM3,
                    weightTons,
                    numBoxes
                },
                bestTruck: trucks[0],
                allCandidates: trucks
            });

        } catch (error) {
            if (error.name === "ValidationError") {
                return res.status(400).json({
                    message: "Invalid input",
                    errors: error.errors
                });
            }

            return res.status(500).json({
                message: "Error calculating best-fit truck",
                error: error.message
            });
        }
    }


    async sendBookedEmail(req, res) {
        const { truckId, shipmentId } = req.body;

        try {
            const truck = await Truck.findById(truckId);
            if (!truck) return res.status(404).json({ message: "Truck not found" });

            const truckDealer = await TruckDealer.findById(truck.truckDealerId);
            if (!truckDealer) return res.status(404).json({ message: "Truck dealer not found" });

            const dealerUser = await User.findById(truckDealer.userId);
            if (!dealerUser) return res.status(404).json({ message: "Truck dealer user not found" });

            const truckModel = truck.modelCode;
            const dealerEmail = dealerUser.email;

            await transporter.sendMail({
                from: process.env.GOOGLE_EMAIL,
                to: dealerEmail,
                subject: `Truck Booking Confirmed: ${truckModel}`,
                text: `Hello ${dealerUser.name},\n\nYour truck (${truckModel}) has been booked for shipment ID: ${shipmentId}.\n\nThank you.`,
            });

            console.log("Email sent successfully to", dealerEmail);
            return res.json({ message: "Email sent successfully" });

        } catch (err) {
            console.error("Error sending booked email:", err);
            return res.status(500).json({ message: "Error sending booked email" });
        }
    };

    async getShipmentStats(req, res) {
        const { warehouseId } = req.params;
        try {
            const [pendingShipments, optimizedShipments, totalTrips, ongoingShipments, bookedShipments] = await Promise.all([
                Shipment.countDocuments({ status: "PENDING", warehouseId }),
                Shipment.countDocuments({ status: "OPTIMIZED", warehouseId }),
                Shipment.countDocuments({ status: "DELIVERED", warehouseId }),
                Shipment.countDocuments({ status: "IN-TRANSIT", warehouseId }),
                Shipment.countDocuments({ status: "BOOKED", warehouseId }),
            ]);

            return res.status(200).json({
                pendingShipments,
                optimizedShipments,
                totalTrips,
                ongoingShipments,
                bookedShipments,
                routeOptimizationPercentage: 30,
                costOptimizationPercentage: 8,
                co2saved: 5,
            });
        } catch (error) {
            console.error("Error fetching shipment stats:", error);
            return res.status(500).json({ message: "Error fetching shipment stats" });
        }
    };


}

export default new WarehouseController();
