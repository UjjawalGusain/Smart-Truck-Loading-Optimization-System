import Truck from "./../models/truck.model.js";
import TruckDealer from "./../models/truckDealer.model.js"
import { object, string, number, mixed, array } from 'yup';

const truckDealerSchema = object({
    companyName: string().required("Company name is required"),
    address: string().required("Address is required"),
    licenseNumber: string().required("License number is required"),
    operatingRegions: array().of(string()),
})

class TruckDealerController {

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
}

export default new TruckDealerController();
