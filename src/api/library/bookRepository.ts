import prisma from "@/common/utils/prisma";
import type { Genre, Book } from "@/generated/prisma";

export class BookRepository {
    async findAllAsync(): Promise<Book[]> {
        return prisma.book.findMany({
            include: { genre: true },
        });
    }
}

export class GenreRepository {
    async findAllAsync(): Promise<Genre[]> {
        return prisma.genre.findMany();
    }

    async createGenreAsync(name: string): Promise<Genre> {
        return prisma.genre.create({
            data: { name },
        });
    }

    async findByIDAsync(id: string): Promise<Genre | null> {
        return prisma.genre.findUnique({
            where: { id },
        });
    }

    async updateGenreAsync(id: string, name: string): Promise<Genre> {
        return prisma.genre.update({
            where: { id },
            data: { name },
        });
    }

    async deleteGenreAsync(id: string): Promise<Genre> {
        return prisma.genre.delete({
            where: { id },
        });
    }
}
