import { booksRepository } from "./booksRepository";

export const booksService = {
  async createBook(data: any) {
    const exist = await booksRepository.findByTitle(data.title);
    if (exist) throw new Error("Book title already exists");
    return booksRepository.create(data);
  },

  async getAllBooks(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search?.toString() || "";
    const genreId = query.genre_id?.toString();

    const { books, total } = await booksRepository.findAll({ page, limit, search, genreId });
    return {
      data: books,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getBookById(id: string) {
    const book = await booksRepository.findById(id);
    if (!book) throw new Error("Book not found");
    return book;
  },

  async getBooksByGenre(genreId: string, query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const { books, total } = await booksRepository.findAll({ page, limit, genreId });
    return {
      data: books,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async updateBook(id: string, data: any) {
    const book = await booksRepository.findById(id);
    if (!book) throw new Error("Book not found");

    if (data.title) {
      const duplicate = await booksRepository.findByTitle(data.title);
      if (duplicate && duplicate.id !== id) throw new Error("Duplicate title");
    }

    return booksRepository.update(id, data);
  },

  async deleteBook(id: string) {
    const book = await booksRepository.findById(id);
    if (!book) throw new Error("Book not found");
    return booksRepository.delete(id);
  },
};