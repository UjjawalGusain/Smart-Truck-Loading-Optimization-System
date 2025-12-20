import mongoose from "mongoose";
import Warehouse from "./../models/warehouse.model.js";
import Shipment from "../models/shipment.model.js";
import ShipmentEvent from "../models/shipmentEvents.model.js";
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
}

export default new ShipmentController();

