import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import type { User } from "@/generated/prisma";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { env } from "@/common/utils/envConfig";

// Response type untuk authentication
export interface AuthResponse {
    token: string;
}

export class UserService {
    private userRepository: UserRepository;

    constructor(repository: UserRepository = new UserRepository()) {
        this.userRepository = repository;
    }

    private generateToken(user: User): string {
        // Pastikan JWT_SECRET ada di env config Anda
        const secret = env.JWT_SECRET || "your-secret-key";
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                username: user.username 
            },
            secret,
            { expiresIn: "24h" } // Token expired dalam 24 jam
        );
    }

    async register(username: string, email: string, password: string): Promise<ServiceResponse<AuthResponse | null>> {
        try {
            const existing = await this.userRepository.findByEmailAsync(email);
            if (existing) {
                return ServiceResponse.failure("Email already registered", null, StatusCodes.BAD_REQUEST);
            }

            const hashed = await bcrypt.hash(password, 10);

            const newUser = await this.userRepository.createAsync({
                username: username || null,
                email,
                password: hashed,
            });

            const token = this.generateToken(newUser);

            return ServiceResponse.success<AuthResponse>(
                "User registered successfully", 
                { token }, 
                StatusCodes.CREATED
            );
        } catch (ex) {
            logger.error(`Error during registration: ${(ex as Error).message}`);
            return ServiceResponse.failure("Registration failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async login(email: string, password: string): Promise<ServiceResponse<AuthResponse | null>> {
        try {
            const user = await this.userRepository.findByEmailAsync(email);
            if (!user) {
                return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
            }

            const token = this.generateToken(user);

            return ServiceResponse.success<AuthResponse>(
                "Login successful", 
                { token }
            );
        } catch (ex) {
            logger.error(`Error during login: ${(ex as Error).message}`);
            return ServiceResponse.failure("Login failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getMe(userId: string): Promise<ServiceResponse<User | null>> {
        try {
            const user = await this.userRepository.findByIdAsync(userId);
            if (!user) {
                return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
            }

            const { password, ...safeUser } = user;
            return ServiceResponse.success("User profile retrieved", safeUser as User);
        } catch (ex) {
            logger.error(`Error retrieving user profile: ${(ex as Error).message}`);
            return ServiceResponse.failure("Failed to retrieve user", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const userService = new UserService();