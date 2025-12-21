import Truck from "./../models/truck.model.js";
import TruckDealer from "./../models/truckDealer.model.js"
import User from "./../models/user.model.js";
import { object, string, number, mixed, array } from 'yup';

const truckDealerSchema = object({
    companyName: string().required("Company name is required"),
    address: string().required("Address is required"),
    licenseNumber: string().required("License number is required"),
    operatingRegions: array().of(string()),
})

class TruckDealerController {


    async getTruckDealer(req, res) {
        const userId = req.user._id;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const truckDealer = await TruckDealer.findOne({ userId });

            if (!truckDealer) {
                return res.status(404).json({ message: "User never signed as a truck dealer" });
            }

            return res.status(200).json({
                message: "User is a truck dealer",
                truckDealer
            });
        } catch (error) {
            return res.status(500).json({
                message: "Cannot get truck dealer",
                error
            });
        }
    }

    async signAsTruckDealer(req, res) {
        const user = req.user;

        if (user.userType != "TRUCK_DEALER") {
            return res.status(401).json({ message: "User is not a truck dealer" });
        }

        try {

            const {
                companyName, address, licenseNumber, operatingRegions
            } = req.body;

            await truckDealerSchema.validate({
                companyName, address, licenseNumber, operatingRegions
            }, { abortEarly: false });

            try {
                await TruckDealer.create({
                    userId: user._id,
                    companyName, address, licenseNumber, operatingRegions
                })
            } catch (error) {
                return res.status(500).json({ message: "Error in creating Truck Dealer", error });
            }
        } catch (error) {
            return res.status(500).json({ message: "Could not sign as truck dealer" });
        }

        return res.status(200).json({ message: "Sign in as truck dealer successful" });
    }


    async dashboardKpi(req, res) {
        const user = req.user;

        if (user.userType !== "TRUCK_DEALER") {
            return res.status(401).json({ message: "User is not a truck dealer" });
        }

        try {
            const truckDealer = await TruckDealer.findOne({ userId: user._id });

            if (!truckDealer) {
                return res.status(404).json({ message: "Truck dealer not found" });
            }

            const result = await Truck.aggregate([
                {
                    $match: {
                        truckDealerId: truckDealer._id
                    }
                },
                {
                    $facet: {
                        totalTrucks: [
                            { $count: "count" }
                        ],
                        statusBreakdown: [
                            {
                                $group: {
                                    _id: "$status",
                                    count: { $sum: 1 }
                                }
                            }
                        ],
                        capacity: [
                            {
                                $group: {
                                    _id: null,
                                    maxWeightTons: { $sum: { $ifNull: ["$maxWeightTons", 0] } },
                                    maxVolumeM3: { $sum: { $ifNull: ["$maxVolumeM3", 0] } }
                                }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        totalTrucks: {
                            $ifNull: [{ $arrayElemAt: ["$totalTrucks.count", 0] }, 0]
                        },
                        truckStatusBreakdown: {
                            $arrayToObject: {
                                $map: {
                                    input: "$statusBreakdown",
                                    as: "s",
                                    in: {
                                        k: "$$s._id",
                                        v: "$$s.count"
                                    }
                                }
                            }
                        },
                        capacity: {
                            $ifNull: [
                                { $arrayElemAt: ["$capacity", 0] },
                                { maxWeightTons: 0, maxVolumeM3: 0 }
                            ]
                        }
                    }
                }
            ]);

            return res.status(200).json({
                message: "Dashboard KPIs fetched successfully",
                data: result[0] || {
                    totalTrucks: 0,
                    truckStatusBreakdown: {},
                    capacity: { maxWeightTons: 0, maxVolumeM3: 0 }
                }
            });
        } catch (error) {
            return res.status(500).json({ message: "Failed to fetch dashboard KPIs", error });
        }
    }

}

export default new TruckDealerController();
