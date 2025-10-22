import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/common/utils/envConfig";
import { User } from "@/generated/prisma/wasm";

export interface JwtPayload {
    id: string;
    email: string;
    username?: string | null;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const generateToken = (user: User): string => {
    const secret = env.JWT_SECRET || "your-secret-key";
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        secret,
        { expiresIn: "24h" }
    );
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Missing or invalid Authorization header",
            });
        }

        const token = header.split(" ")[1];
        const secret = env.JWT_SECRET || "your-secret-key";
        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
