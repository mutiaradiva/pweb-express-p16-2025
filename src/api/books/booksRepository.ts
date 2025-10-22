import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const booksRepository = {
  async findByTitle(title: string) {
    return prisma.book.findUnique({ where: { title } });
  },

  async findById(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
  },

  async create(data: any) {
    return prisma.book.create({ data });
  },

  async findAll(params: { page: number; limit: number; search?: string; genreId?: string }) {
    const { page, limit, search, genreId } = params;
    const skip = (page - 1) * limit;
    const where: any = {
      title: search ? { contains: search, mode: "insensitive" } : undefined,
      ...(genreId && { genre_id: genreId }),
    };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: { genre: true },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.book.count({ where }),
    ]);

    return { books, total };
  },

  async update(id: string, data: any) {
    return prisma.book.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.book.delete({ where: { id } });
  },
};