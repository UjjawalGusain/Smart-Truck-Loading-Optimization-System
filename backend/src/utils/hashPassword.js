import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(pass) {
    const hash = await bcrypt.hash(pass, SALT_ROUNDS);
    return hash;
}

export async function comparePassword(pass, hash) {
    return await bcrypt.compare(pass, hash);
} 
