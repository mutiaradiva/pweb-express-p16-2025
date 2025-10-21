import prisma from "@/common/utils/prisma";
import type { User } from "@/generated/prisma";

export class UserRepository {
    async findAllAsync(): Promise<User[]> {
        return prisma.user.findMany();
    }

    async findByIdAsync(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }
}
