import getOtp, { hashOtp } from "../utils/createOtp.js";
import User from "./../models/user.model.js"
import { object, string, number, mixed } from 'yup';
import transporter from "../services/nodemailerEmail.js";


let userSchema = object({
    name: string().required('name required'),
    email: string().email().required('email required'),
    phoneNumber: string()
        .required('phone required')
        .matches(/^\+?[1-9]\d{9,14}$/, 'invalid phone'),
    userType: mixed().oneOf(['WAREHOUSE_USER', 'TRUCK_DEALER']).required('userType required'),



});


class authController {

    async signup(req, res, next) {
        try {
            console.log(req.body);
            const {
                name,
                phoneNumber,
                userType
            } = req.body;

            let { email } = req.body;

            email = email.toLowerCase().trim();

            await userSchema.validate({ name, email, phoneNumber, userType }, { abortEarly: false });

            const existingUser = await User.findOne({ email });
            console.log("existingUser: ", existingUser);
            const newOtp = getOtp();
            const hashedOtp = await hashOtp(newOtp);
            const now = new Date();
            const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);

            if (!existingUser) {
                try {
                    const userBody = {
                        name, email, phoneNumber, userType, isVerified: false,
                        verifyCode: hashedOtp, verifyCodeExpiry: fifteenMinutesLater
                    }
                    const user = await User.create(userBody);
                    console.log("New user created: ", user);

                } catch (error) {
                    console.error("Error creating user: ", error);
                    return res.status(500).json({ message: "Error creating user", error });
                }
            } else {

                if (existingUser.isVerified) {
                    return res.status(200).json({ message: "User already verified. Can login safely" });
                }

                if (now < existingUser.verifyCodeExpiry) {
                    return res.status(200).json({ message: "User is unverified. Needs to enter otp" });
                }

                existingUser.verifyCode = hashedOtp;
                existingUser.verifyCodeExpiry = fifteenMinutesLater;

                try {
                    await existingUser.save();
                } catch (error) {
                    console.error("Error saving existing user: ", error);
                    return res.status(500).json({ message: "Error saving user", error });
                }

            }
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: "OTP for Truckster",
                    text: `Your otp is ${newOtp}`,
                });

            } catch (error) {
                console.error("Error sending otp: ", error);
                return res.status(500).json({ message: "Error sending otp", error });
            }

            return res.status(200).json({ message: "OTP sent to user" });

        } catch (error) {
            console.error("Error signing up: ", error);
            return res.status(500).json({ message: "Signup failed" });
        }
    }
};

export default new authController();
