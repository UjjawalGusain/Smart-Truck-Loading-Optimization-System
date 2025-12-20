import getOtp, { hashOtp, compareOtp } from "../utils/createOtp.js";
import User from "./../models/user.model.js"
import { object, string, number, mixed } from 'yup';
import transporter from "../services/nodemailerEmail.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";

let userSchema = object({
    name: string().required('name required'),
    email: string().email().required('email required'),
    phoneNumber: string()
        .required('phone required')
        .matches(/^\+?[1-9]\d{9,14}$/, 'invalid phone'),
    userType: mixed().oneOf(['WAREHOUSE_USER', 'TRUCK_DEALER']).required('userType required'),
    password: string()
        .required('password required')
        .min(8, 'password must be at least 8 characters')
        .matches(/(?=.*[a-z])/, 'must contain at least 1 lowercase letter')
        .matches(/(?=.*[A-Z])/, 'must contain at least 1 uppercase letter')
        .matches(/(?=.*\d)/, 'must contain at least 1 number')
        .matches(/(?=.*[^A-Za-z0-9])/, 'must contain at least 1 special character'),
});

const verifyOtpSchema = object({
    email: string().email().required(),
    otp: string().matches(/^\d{4,6}$/).required(),
});

const loginSchema = object({
    email: string().email().required(),
    password: string().required(),
});


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new Error("Something went wrong while generating access and refresh tokens");
    }
}

class authController {

    async signup(req, res, next) {
        try {
            console.log(req.body);
            const {
                name,
                phoneNumber,
                userType,
                password,
            } = req.body;

            let { email } = req.body;

            email = email.toLowerCase().trim();
            await userSchema.validate({ name, email, phoneNumber, userType, password }, { abortEarly: false });

            const hashedPassword = await hashPassword(password);

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
                        password: hashedPassword,
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
                    await new Promise(r => setTimeout(r, 800));
                    return res.status(200).json({ message: "If the account exists, an OTP has been sent." });

                }

                if (now < existingUser.verifyCodeExpiry) {
                    return res.status(200).json({ message: "If the account exists, an OTP has been sent." });
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

    async verifyOtp(req, res, next) {
        try {
            const {
                otp,
            } = req.body;
            let { email } = req.body;

            email = email.toLowerCase().trim();

            await verifyOtpSchema.validate({ email, otp }, { abortEarly: false });

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "Invalid or expired OTP" });
            }
            try {

                if (user.isVerified) {
                    return res.status(200).json({ message: "User is already verified" });
                }

                const now = new Date();

                if (now >= user.verifyCodeExpiry) {
                    user.verifyCode = undefined;
                    user.verifyCodeExpiry = undefined;
                    await user.save({ validateBeforeSave: false });
                    return res.status(400).json({
                        message: "Invalid or expired OTP"
                    });
                }

                const hashedOtp = user.verifyCode;
                const isOtpCorrect = await compareOtp(otp, hashedOtp);

                if (!isOtpCorrect) {
                    return res.status(403).json({
                        message: "Invalid or expired OTP"
                    });
                }

            } catch (error) {
                console.error("Error checking otp: ", error);
                return res.status(500).json({ message: "Error checking otp", error });
            }



            try {
                user.isVerified = true;
                user.verifyCode = undefined;
                user.verifyCodeExpiry = undefined;
                await user.save();
            } catch (error) {
                console.error("Error saving verified user: ", error);
                return res.status(500).json({ message: "Error saving verified user", error });
            }

            return res.status(200).json({ message: "User verified successfully" });
        } catch (error) {
            console.error("Error verifying OTP: ", error);
            res.status(500).json({ message: "Error verifying OTP", error });
        }
    }

    async login(req, res, next) {
        try {
            const {
                email,
                password,
            } = req.body;

            const trimmedEmail = email.toLowerCase().trim();
            await loginSchema.validate({ email: trimmedEmail, password }, { abortEarly: false });

            const existingUser = await User.findOne({ email: trimmedEmail });
            if (!existingUser) {
                console.error("User not found");
                return res.status(404).json({ message: "User not found" });
            }

            if (!existingUser.isVerified) {
                console.error("User is not verified");
                return res.status(403).json({ message: "User is not verified" });
            }


            try {

                const hashedPassword = existingUser.password;

                const isPasswordCorrect = await comparePassword(password, hashedPassword);

                if (!isPasswordCorrect) {
                    console.error("Password is incorrect");
                    return res.status(401).json({ message: "Password is incorrect" });
                }

                const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(existingUser._id)

                const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken")

                const options = {
                    httpOnly: true,
                    secure: true
                }

                return res
                    .status(200)
                    .cookie("accessToken", accessToken, options)
                    .cookie("refreshToken", refreshToken, options)
                    .json({ message: "logged in successfully", user: loggedInUser });
            } catch (error) {
                console.error("Error is token generation: ", error);
                return res.status(401).json({ message: "Error in generating token", error });
            }

        } catch (error) {
            console.error("Error logging user in: ", error);
            return res.status(500).json({ message: "Error logging in user", error });
        }
    }
};

export default new authController();
