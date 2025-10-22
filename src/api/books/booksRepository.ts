import prisma from "@/common/utils/prisma";
import type { Genre, Book } from "@/generated/prisma";

export class BookRepository {
  async findAllAsync(): Promise<Book[]> {
    return prisma.book.findMany({
      include: { genre: true },
    });
  }

  async findByIdAsync(id: string): Promise<Book | null> {
    return prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
  }

  async createAsync(data: Omit<Book, "id">): Promise<Book> {
    return prisma.book.create({ data });
  }

  async updateAsync(id: string, data: Partial<Book>): Promise<Book> {
    return prisma.book.update({ where: { id }, data });
  }

  async deleteAsync(id: string): Promise<Book> {
    return prisma.book.delete({ where: { id } });
  }
}

export class GenreRepository {
  async findAllAsync(): Promise<Genre[]> {
    return prisma.genre.findMany();
  }

  async findByIdAsync(id: string): Promise<Genre | null> {
    return prisma.genre.findUnique({ where: { id } });
  }

  async createAsync(data: Omit<Genre, "id">): Promise<Genre> {
    return prisma.genre.create({ data });
  }

  async updateAsync(id: string, data: Partial<Genre>): Promise<Genre> {
    return prisma.genre.update({ where: { id }, data });
  }

  async deleteAsync(id: string): Promise<Genre> {
    return prisma.genre.delete({ where: { id } });
  }
}

export const bookRepository = new BookRepository();
export const genreRepository = new GenreRepository();