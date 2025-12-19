import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

function getOtp() {

    const maxi = 999999;
    const mini = 100000;

    const otp = Math.floor(Math.random() * (maxi - mini) + mini);
    return otp;
}

export async function hashOtp(otp) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(otp.toString(), salt);
    return hashed;
}

export async function compareOtp(otp, hashedOtp) {
    return await bcrypt.compare(otp.toString(), hashedOtp);
}


export default getOtp;
