import Truck from "./../models/truck.model.js";
import TruckDealer from "./../models/truckDealer.model.js"
import ServiceRoute from "./../models/serviceRoutes.model.js";
import TruckServiceRoute from "./../models/truckServiceRoutes.model.js";
import { object, string, number, array, date } from "yup";
import mongoose from "mongoose";

export const truckValidationSchema = array().of(
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
}

export default new TruckController();
