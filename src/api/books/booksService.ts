import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { bookRepository, genreRepository } from "./bookRepository";

export class BookService {
  async findAllBooks() {
    const books = await bookRepository.findAllAsync();
    return new ServiceResponse("Books fetched successfully", books, StatusCodes.OK);
  }

  async findBookById(id: string) {
    const book = await bookRepository.findByIdAsync(id);
    if (!book) {
      return new ServiceResponse("Book not found", null, StatusCodes.NOT_FOUND);
    }
    return new ServiceResponse("Book fetched successfully", book, StatusCodes.OK);
  }

  async createBook(data: any) {
    const book = await bookRepository.createAsync(data);
    return new ServiceResponse("Book created successfully", book, StatusCodes.CREATED);
  }

  async updateBook(id: string, data: any) {
    const book = await bookRepository.updateAsync(id, data);
    return new ServiceResponse("Book updated successfully", book, StatusCodes.OK);
  }

  async deleteBook(id: string) {
    await bookRepository.deleteAsync(id);
    return new ServiceResponse("Book deleted successfully", null, StatusCodes.OK);
  }

  // ===== GENRE =====
  async findAllGenres() {
    const genres = await genreRepository.findAllAsync();
    return new ServiceResponse("Genres fetched successfully", genres, StatusCodes.OK);
  }

  async findGenreById(id: string) {
    const genre = await genreRepository.findByIdAsync(id);
    if (!genre) {
      return new ServiceResponse("Genre not found", null, StatusCodes.NOT_FOUND);
    }
    return new ServiceResponse("Genre fetched successfully", genre, StatusCodes.OK);
  }

  async createGenre(data: any) {
    const genre = await genreRepository.createAsync(data);
    return new ServiceResponse("Genre created successfully", genre, StatusCodes.CREATED);
  }

  async updateGenre(id: string, data: any) {
    const genre = await genreRepository.updateAsync(id, data);
    return new ServiceResponse("Genre updated successfully", genre, StatusCodes.OK);
  }

  async deleteGenre(id: string) {
    await genreRepository.deleteAsync(id);
    return new ServiceResponse("Genre deleted successfully", null, StatusCodes.OK);
  }
}

export const bookService = new BookService();