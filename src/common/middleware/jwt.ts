import jwt from "jsonwebtoken";
import { env } from "../utils/envConfig";


export function generateToken(payload: object): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyToken<T = any>(token: string): T {
    return jwt.verify(token, env.JWT_SECRET) as T;
}
