import mongoose from "mongoose";
import Warehouse from "./../models/warehouse.model.js";
import Shipment from "../models/shipment.model.js";
import ShipmentEvent from "../models/shipmentEvents.model.js";
import Truck from "../models/truck.model.js";
import { object, string, number, date, boolean } from "yup";

const shipmentSchema = object({
    warehouseId: string()
        .required("Warehouse id is required")
        .test("is-objectid", "Invalid warehouse id", value =>
            mongoose.Types.ObjectId.isValid(value)
        ),

    weightTons: number().required("Weight is required").positive(),
    volumeM3: number().required("Volume is required").positive(),
    numBoxes: number().required("Number of boxes is required").integer().positive(),

    destination: string().required("Destination is required"),
    deadline: date().required("Deadline is required").typeError("Invalid deadline"),

    splittable: boolean().default(true),
    stackable: boolean().default(true),
    hazardous: boolean().default(false),
    temperatureSensitive: boolean().default(false)
});

const shipmentStatusChangeAllowed = {
    "PENDING": "OPTIMIZED",
    "OPTIMIZED": "BOOKED",
    "BOOKED": "IN-TRANSIT",
    "IN-TRANSIT": "DELIVERED",
}

const getShipmentsSchema = object({
    warehouseId: string().required("warehouseId is required"),

    status: string()
        .oneOf(["PENDING", "OPTIMIZED", "BOOKED", "IN-TRANSIT", "DELIVERED"]).transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .nullable(),

    destination: string().transform((value, originalValue) =>
        originalValue === "" ? null : value
    )
        .nullable(),

    fromDate: date()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .nullable(),

    toDate: date()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .nullable(),

    page: number()
        .integer()
        .min(1),

    limit: number()
        .integer()
        .min(1)
        .max(100)
});

const updateShipmentSchema = object({
    shipmentId: string()
        .required("shipmentId is required")
        .test(
            "is-objectid",
            "Invalid shipmentId",
            value => mongoose.Types.ObjectId.isValid(value)
        ),

    changeStatus: boolean()
        .default(false),

    truckId: string()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .test(
            "is-objectid",
            "Invalid truckId",
            value => value == null || mongoose.Types.ObjectId.isValid(value)
        ),

    deadline: date()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .typeError("Invalid deadline")
});

class ShipmentController {
    async createShipment(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const validated = await shipmentSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            const {
                warehouseId,
                weightTons,
                volumeM3,
                numBoxes,
                destination,
                deadline,
                splittable,
                stackable,
                hazardous,
                temperatureSensitive
            } = validated;

            const warehouse = await Warehouse.findById(warehouseId).session(session);
            if (!warehouse) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: "No warehouse associated" });
            }

            const shipment = await Shipment.create(
                [{
                    warehouseId,
                    weightTons,
                    volumeM3,
                    numBoxes,
                    origin: warehouse.address,
                    destination,
                    deadline,
                    splittable,
                    stackable,
                    hazardous,
                    temperatureSensitive
                }],
                { session }
            );

            const shipmentEvent = await ShipmentEvent.create(
                [{
                    shipmentId: shipment[0]._id,
                    status: "PENDING",
                    location: warehouse.address,
                    timestamp: new Date()
                }],
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return res.status(201).json({
                message: "Shipment created successfully",
                shipment: shipment[0],
                shipmentEvent: shipmentEvent[0]
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            if (error.name === "ValidationError") {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: error.errors
                });
            }

            return res.status(500).json({ message: "Error creating shipment" });
        }
    }



    async getShipments(req, res) {
        const {
            warehouseId,
            status,
            destination,
            fromDate,
            toDate,
            page = 1,
            limit = 10
        } = req.query;

        if (!warehouseId) {
            return res.status(400).json({ message: "warehouseId is required" });
        }

        try {

            await getShipmentsSchema.validate({
                warehouseId,
                status,
                destination,
                fromDate,
                toDate,
                page,
                limit
            })

            const pageNumber = Math.max(parseInt(page, 10), 1);
            const limitNumber = Math.max(parseInt(limit, 10), 1);
            const skip = (pageNumber - 1) * limitNumber;

            const query = { warehouseId };

            if (status) {
                query.status = status;
            }

            if (destination) {
                query.destination = { $regex: destination, $options: "i" };
            }

            if (fromDate || toDate) {
                query.deadline = {};
                if (fromDate) query.deadline.$gte = new Date(fromDate);
                if (toDate) query.deadline.$lte = new Date(toDate);
            }

            const [shipments, total] = await Promise.all([
                Shipment.find(query)
                    .sort({ updatedAt: -1 })
                    .skip(skip)
                    .limit(limitNumber),
                Shipment.countDocuments(query)
            ]);

            return res.status(200).json({
                shipments,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total,
                    totalPages: Math.ceil(total / limitNumber)
                },
                filters: {
                    status,
                    destination,
                    fromDate,
                    toDate
                }
            });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching shipments", error });
        }
    }


    async updateShipment(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { shipmentId, changeStatus, truckId, deadline } = req.body;

            await updateShipmentSchema.validate({
                shipmentId,
                changeStatus,
                truckId,
                deadline,
            })

            const shipment = await Shipment.findById(shipmentId).session(session);
            if (!shipment) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: "Shipment not found" });
            }

            if (shipment.status === "DELIVERED") {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Delivered shipment cannot be updated" });
            }

            if (deadline) {
                shipment.deadline = deadline;
            }

            if (changeStatus) {
                const nextStatus = shipmentStatusChangeAllowed[shipment.status];
                if (!nextStatus) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ message: "Invalid status transition" });
                }

                if (nextStatus === "BOOKED") {
                    if (!truckId) {
                        await session.abortTransaction();
                        session.endSession();
                        return res.status(400).json({ message: "truckId required to book shipment" });
                    }

                    const truck = await Truck.findById(truckId).session(session);
                    if (!truck) {
                        await session.abortTransaction();
                        session.endSession();
                        return res.status(404).json({ message: "Truck not found" });
                    }

                    shipment.assignedTruckId = truckId;
                }

                shipment.status = nextStatus;

                await ShipmentEvent.create([{
                    shipmentId: shipment._id,
                    status: shipment.status,
                    location: shipment.status === "IN-TRANSIT" ? "ON_ROUTE" : shipment.origin,
                    timestamp: new Date()
                }], { session });
            }

            await shipment.save({ session });
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                message: "Shipment updated successfully",
                shipment
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({ message: "Error updating shipment" });
        }
    }


    async deleteShipment(req, res) {
        const { shipmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(shipmentId)) {
            return res.status(400).json({ message: "Invalid shipmentId" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const shipment = await Shipment.findById(shipmentId).session(session);

            if (!shipment) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: "Shipment not found" });
            }

            if (["IN-TRANSIT", "DELIVERED"].includes(shipment.status)) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    message: "Shipment cannot be deleted in its current state"
                });
            }

            await ShipmentEvent.deleteMany(
                { shipmentId },
                { session }
            );

            await Shipment.deleteOne(
                { _id: shipmentId },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({ message: "Shipment deleted successfully" });

        } catch {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({ message: "Error deleting shipment" });
        }
    }


}

export default new ShipmentController();

