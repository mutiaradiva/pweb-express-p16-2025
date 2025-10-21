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
}
