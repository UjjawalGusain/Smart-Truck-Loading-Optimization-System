import User from "./../models/user.model.js";
import Warehouse from "./../models/warehouse.model.js"
import WarehouseUser from "./../models/warehouseUser.model.js";
import { object, string, number, mixed } from 'yup';
import mongoose from "mongoose";

const warehouseSchema = object({
    name: string().required("Warehouse name is required").min(3, "minimum 3 characters").max(16, "maximum 16 characters name"),
    address: string().required("Address is required").min(3, "minimum 3 characters"),
    capacityTons: number().required("Capacity is required(in tons)")
})

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

}

export default new WarehouseController();
