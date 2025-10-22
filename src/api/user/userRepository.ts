import prisma from "@/common/utils/prisma";
import type { User } from "@/generated/prisma";

export class UserRepository {
    async findByIdAsync(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    async findByEmailAsync(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }
    async createAsync(data: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
        return prisma.user.create({
            data,
        });
    }
}