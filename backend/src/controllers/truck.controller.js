import Truck from "./../models/truck.model.js";
import TruckDealer from "./../models/truckDealer.model.js"
import ServiceRoute from "./../models/serviceRoutes.model.js";
import TruckServiceRoute from "./../models/truckServiceRoutes.model.js";
import { object, string, number, array, date } from "yup";
import mongoose from "mongoose";

const truckValidationSchema = array().of(
    object({
        modelCode: string().required(),
        vin: string().required(),
        modelYear: number().required(),
        manufacturer: string().required(),
        primaryType: string()
            .oneOf([
                "GENERAL_OPEN",
                "GENERAL_CLOSED",
                "REFRIGERATED",
                "TANKER",
                "BULK",
                "CAR_CARRIER",
                "LIVESTOCK",
                "LOW_BED",
                "COMBINATION"
            ])
            .required(),
        pickupClass: string().nullable(),
        engineType: string().nullable(),
        engineCapacity: string().nullable(),
        transmissionType: string().nullable(),
        axleCount: number().nullable(),
        wheelDrive: string().oneOf(["TWO_WHEEL", "FOUR_WHEEL"]).nullable(),
        bedLength: number().nullable(),
        maxWeightTons: number().nullable(),
        maxVolumeM3: number().nullable(),
        capabilities: array().of(string()).nullable(),
        status: string().oneOf(["ACTIVE", "MAINTENANCE", "RETIRED"]).nullable(),
        lastServiceDate: date().nullable(),
        registrationNumber: string().nullable(),
        fuelType: string().nullable(),
        grossVehicleWeightRating: number().nullable(),
        serviceRoutes: array().of(
            object({
                name: string().required(),
                startLocation: string().required(),
                endLocation: string().required(),
                distanceKm: number().nullable()
            })
        ).nullable()
    })
);

const updateTruckValidationSchema = object({
    truckId: string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "Invalid truckId"),

    status: string()
        .oneOf(["ACTIVE", "MAINTENANCE", "RETIRED"])
        .optional(),

    lastServiceDate: date()
        .nullable()
        .optional(),

    registrationNumber: string()
        .nullable()
        .optional(),

    fuelType: string()
        .nullable()
        .optional(),

    capabilities: array()
        .of(string())
        .nullable()
        .optional(),

    maxWeightTons: number()
        .nullable()
        .optional(),

    maxVolumeM3: number()
        .nullable()
        .optional(),

    serviceRoutes: array()
        .of(
            object({
                name: string().required(),
                startLocation: string().required(),
                endLocation: string().required(),
                distanceKm: number().nullable()
            })
        )
        .nullable()
        .optional()
}).noUnknown(true);


class TruckController {

    async createTrucks(req, res) {
        const user = req.user;
        if (user.userType !== "TRUCK_DEALER") {
            return res.status(400).json({ message: "User is not a truck dealer" });
        }

        try {
            await truckValidationSchema.validate(req.body, { abortEarly: false });

            const userTruckDealer = await TruckDealer.findOne({ userId: user._id });
            if (!userTruckDealer) {
                return res.status(400).json({ message: "User has not signed as truck dealer" });
            }

            const trucksData = req.body;
            const createdTrucks = [];

            for (const truckData of trucksData) {
                const session = await mongoose.startSession();
                session.startTransaction();

                try {
                    const { serviceRoutes, ...truckFields } = truckData;

                    const truck = await Truck.create(
                        [{
                            truckDealerId: userTruckDealer._id,
                            ...truckFields
                        }],
                        { session }
                    );

                    if (serviceRoutes && serviceRoutes.length > 0) {
                        const serviceRouteIds = [];
                        for (const [index, route] of serviceRoutes.entries()) {
                            const serviceRouteDoc = await ServiceRoute.create(
                                [{
                                    name: route.name,
                                    startLocation: route.startLocation,
                                    endLocation: route.endLocation,
                                    distanceKm: route.distanceKm
                                }],
                                { session }
                            );
                            serviceRouteIds.push({ id: serviceRouteDoc[0]._id, sequenceOrder: index + 1 });
                        }

                        for (const sr of serviceRouteIds) {
                            await TruckServiceRoute.create(
                                [{
                                    truckId: truck[0]._id,
                                    serviceRouteId: sr.id,
                                    sequenceOrder: sr.sequenceOrder
                                }],
                                { session }
                            );
                        }
                    }

                    await session.commitTransaction();
                    session.endSession();
                    createdTrucks.push(truck[0]);
                } catch (err) {
                    await session.abortTransaction();
                    session.endSession();
                    throw err;
                }
            }
            res.status(201).json({ trucks: createdTrucks });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    async deleteTruck(req, res) {
        const user = req.user;
        const { truckId } = req.body;

        if (user.userType !== "TRUCK_DEALER") {
            return res.status(403).json({ message: "User is not a truck dealer" });
        }

        if (!mongoose.Types.ObjectId.isValid(truckId)) {
            return res.status(400).json({ message: "Invalid truckId" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const truckDealer = await TruckDealer.findOne({ userId: user._id }).session(session);
            if (!truckDealer) {
                throw new Error("Truck dealer not found");
            }

            const truck = await Truck.findOne({
                _id: truckId,
                truckDealerId: truckDealer._id
            }).session(session);

            if (!truck) {
                throw new Error("Truck not found or unauthorized");
            }

            const truckServiceRoutes = await TruckServiceRoute.find({
                truckId: truck._id
            }).session(session);

            const serviceRouteIds = truckServiceRoutes.map(tsr => tsr.serviceRouteId);

            await TruckServiceRoute.deleteMany(
                { truckId: truck._id },
                { session }
            );

            if (serviceRouteIds.length > 0) {
                await ServiceRoute.deleteMany(
                    { _id: { $in: serviceRouteIds } },
                    { session }
                );
            }

            await Truck.deleteOne(
                { _id: truck._id },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                message: "Truck and related service routes deleted successfully"
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            return res.status(500).json({
                message: "Failed to delete truck",
                error: error.message
            });
        }
    }

    async updateTruck(req, res) {
        const user = req.user;
        const { truckId } = req.body;

        if (user.userType !== "TRUCK_DEALER") {
            return res.status(403).json({ message: "User is not a truck dealer" });
        }

        if (!mongoose.Types.ObjectId.isValid(truckId)) {
            return res.status(400).json({ message: "Invalid truckId" });
        }

        await updateTruckValidationSchema.validate(req.body, {
            abortEarly: false,
        });

        const allowedFields = [
            "status",
            "lastServiceDate",
            "registrationNumber",
            "fuelType",
            "capabilities",
            "maxWeightTons",
            "maxVolumeM3",
            "serviceRoutes"
        ];

        const updateData = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                updateData[key] = req.body[key];
            }
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const truckDealer = await TruckDealer.findOne({ userId: user._id }).session(session);
            if (!truckDealer) {
                throw new Error("Truck dealer not found");
            }

            const truck = await Truck.findOne({
                _id: truckId,
                truckDealerId: truckDealer._id
            }).session(session);

            if (!truck) {
                throw new Error("Truck not found or unauthorized");
            }

            const { serviceRoutes, ...truckFields } = updateData;

            if (Object.keys(truckFields).length > 0) {
                await Truck.updateOne(
                    { _id: truck._id },
                    { $set: truckFields },
                    { session }
                );
            }

            if (serviceRoutes) {
                const existingTSRs = await TruckServiceRoute.find({
                    truckId: truck._id
                }).session(session);

                const existingRouteIds = existingTSRs.map(tsr => tsr.serviceRouteId);

                await TruckServiceRoute.deleteMany(
                    { truckId: truck._id },
                    { session }
                );

                if (existingRouteIds.length > 0) {
                    await ServiceRoute.deleteMany(
                        { _id: { $in: existingRouteIds } },
                        { session }
                    );
                }

                for (const [index, route] of serviceRoutes.entries()) {
                    const serviceRouteDoc = await ServiceRoute.create(
                        [{
                            name: route.name,
                            startLocation: route.startLocation,
                            endLocation: route.endLocation,
                            distanceKm: route.distanceKm
                        }],
                        { session }
                    );

                    await TruckServiceRoute.create(
                        [{
                            truckId: truck._id,
                            serviceRouteId: serviceRouteDoc[0]._id,
                            sequenceOrder: index + 1
                        }],
                        { session }
                    );
                }
            }

            await session.commitTransaction();
            session.endSession();

            const updatedTruck = await Truck.findById(truck._id);

            return res.status(200).json({ truck: updatedTruck });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            return res.status(500).json({
                message: "Failed to update truck",
                error: error.message
            });
        }
    }


}

export default new TruckController();
