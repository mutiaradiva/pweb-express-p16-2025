import prisma from "@/common/utils/prisma";
import type { Genre, Book } from "@/generated/prisma";
import { CreateBookInput } from "./bookModel";

export class BookRepository {
    async createBookAsync(data: CreateBookInput): Promise<Book> {
        return prisma.book.create({
            data,
        });
    }

    async findAllAsync() {
        const books = await prisma.book.findMany({
            include: {
                genre: {
                    select: { name: true },
                },
            },
            orderBy: { created_at: "desc" },
        });

        return books.map((book) => ({
            id: book.id,
            title: book.title,
            writer: book.writer,
            publisher: book.publisher,
            description: book.description,
            publication_year: book.publication_year,
            price: book.price,
            stock_quantity: book.stock_quantity,
            genre: book.genre?.name || null,
        }));
    }

    async findByGenreAsync(genre_id: string) {
        const books = await prisma.book.findMany({
            where: { genre_id },
            include: {
                genre: {
                    select: { name: true },
                },
            },
            orderBy: { created_at: "desc" },
        });

        return books.map((book) => ({
            id: book.id,
            title: book.title,
            writer: book.writer,
            publisher: book.publisher,
            description: book.description,
            publication_year: book.publication_year,
            price: book.price,
            stock_quantity: book.stock_quantity,
        }));
    }

    async findByIdAsync(id: string): Promise<any | null> {
        const book = await prisma.book.findFirst({
            where: { id },
            include: {
                genre: {
                    select: { name: true },
                },
            },
            orderBy: { created_at: "desc" },
        });

        return book ? {
            id: book.id,
            title: book.title,
            writer: book.writer,
            publisher: book.publisher,
            description: book.description,
            publication_year: book.publication_year,
            price: book.price,
            stock_quantity: book.stock_quantity,
            genre: book.genre?.name || null,
        } : null;
    }

    async updateBookAsync(id: string, data: Partial<CreateBookInput>): Promise<any | null> {
        const book = await prisma.book.update({
            where: { id },
            data,
        });

        return book ? {
            id: book.id,
            title: book.title,
            updated_at: book.updated_at,
        } : null;
    }

    async deleteBookAsync(id: string): Promise<Book | null> {
        try {
            return await prisma.book.delete({
                where: { id },
            });
        } catch (err) {
            return null;
        }
    }

    async findByNameAsync(title: string): Promise<Book | null> {
        return prisma.book.findUnique({
            where: { title },
        });
    }
}

export class GenreRepository {
    async findAllAsync(): Promise<Pick<Genre, "id" | "name">[]> {
        return prisma.genre.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            }
        });
    }

    async createGenreAsync(name: string): Promise<Genre> {
        return prisma.genre.create({
            data: { name },
        });
    }

    async findByNameAsync(name: string): Promise<Genre | null> {
        return prisma.genre.findUnique({
            where: { name },
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

    async deleteGenreAsync(id: string): Promise<Genre | null> {
        try {
            return await prisma.genre.delete({
                where: { id },
            });
        } catch (err) {
            return null;
        }
    }
}
