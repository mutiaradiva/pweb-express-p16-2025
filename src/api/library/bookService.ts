import { StatusCodes } from "http-status-codes";
import type { Book, Genre } from "@/generated/prisma";
import { BookRepository, GenreRepository } from "./bookRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { CreateBookInput } from "./bookModel";

export class BookService {
    private bookRepository: BookRepository
    private genreRepository: GenreRepository

    constructor(
        bookRepo: BookRepository = new BookRepository(),
        genreRepo: GenreRepository = new GenreRepository(),
    ) {
        this.bookRepository = bookRepo;
        this.genreRepository = genreRepo;
    }

    async addBook(data: CreateBookInput): Promise<ServiceResponse<Book | null>> {
        try {
            const existing = await this.bookRepository.findByNameAsync(data.title);
            if (existing) {
                return ServiceResponse.failure("Book title already exists", null, StatusCodes.BAD_REQUEST);
            }
            const newBook = await this.bookRepository.createBookAsync(data);
            const { writer, publisher, publication_year, description, price, stock_quantity, genre_id, updated_at, deleted_at, ...safeBook } = newBook;
            return ServiceResponse.success<Book>("Book added successfully", safeBook as Book, StatusCodes.CREATED);
        } catch (ex) {
            const errorMessage = `Error adding book: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while adding the book.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllBooks(): Promise<ServiceResponse<any[] | null>> {
        try {
            const books = await this.bookRepository.findAllAsync();
            if (!books || books.length === 0) {
                return ServiceResponse.failure("No Books found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<any[]>("Get all book successfully", books);
        } catch (ex) {
            const errorMessage = `Error finding all books: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while retrieving books.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findBookByGenre(genre_id: string): Promise<ServiceResponse<any[] | null>> {
        try {
            const books = await this.bookRepository.findByGenreAsync(genre_id);
            if (!books || books.length === 0) {
                return ServiceResponse.failure("No Books found for the given genre", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<any[]>("Get all book by genre successfully", books);
        } catch (ex) {
            const errorMessage = `Error finding books by genre: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while retrieving books for the given genre.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findBookByID(id: string): Promise<ServiceResponse<Book | null>> {
        try {
            const book = await this.bookRepository.findByIdAsync(id);
            if (!book) {
                return ServiceResponse.failure("Book not found", null, StatusCodes.NOT_FOUND);
            }
            const { updated_at, deleted_at, ...safeBook } = book;
            return ServiceResponse.success<Book>("Get book detail successfully", safeBook as Book);
        } catch (ex) {
            const errorMessage = `Error finding book by ID: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while retrieving the book.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateBook(id: string, data: Partial<CreateBookInput>): Promise<ServiceResponse<Book | null>> {
        try {
            const updatedBook = await this.bookRepository.updateBookAsync(id, data);
            return ServiceResponse.success<Book>("Book updated successfully", updatedBook as Book);
        } catch (ex) {
            const errorMessage = `Error updating book: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while updating the book.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deleteBook(id: string): Promise<ServiceResponse<null>> {
        try {
            const deletedBook = await this.bookRepository.deleteBookAsync(id);
            if (!deletedBook) {
                return ServiceResponse.failure("Book not found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<null>("Book removed successfully", null);
        } catch (ex) {
            const errorMessage = `Error removing book: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while removing the book.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createGenre(name: string): Promise<ServiceResponse<Genre | null>> {
        try {
            const existing = await this.genreRepository.findByNameAsync(name);
            if (existing) {
                return ServiceResponse.failure("Genre name already exists", null, StatusCodes.BAD_REQUEST);
            }
            const newGenre = await this.genreRepository.createGenreAsync(name);
            const { updated_at, deleted_at, ...safeGenre } = newGenre;
            return ServiceResponse.success<Genre>("Genre created successfully", safeGenre as Genre, StatusCodes.CREATED);
        } catch (ex) {
            const errorMessage = `Error creating genre: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while creating the genre.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllGenres(): Promise<ServiceResponse<Pick<Genre, "id" | "name">[] | null>> {
        try {
            const genres = await this.genreRepository.findAllAsync();
            if (!genres || genres.length === 0) {
                return ServiceResponse.failure("No Genres found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<Pick<Genre, "id" | "name">[]>("Get all genre successfully", genres);
        } catch (ex) {
            const errorMessage = `Error finding all genres: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while retrieving genres.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findGenreByID(id: string): Promise<ServiceResponse<Genre | null>> {
        try {
            const genre = await this.genreRepository.findByIDAsync(id);
            if (!genre) {
                return ServiceResponse.failure("Genre not found", null, StatusCodes.NOT_FOUND);
            }
            const { created_at, updated_at, deleted_at, ...safeGenre } = genre;
            return ServiceResponse.success<Genre>("Get genre detail successfully", safeGenre as Genre);
        } catch (ex) {
            const errorMessage = `Error finding genre by ID: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while retrieving the genre.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateGenre(id: string, name: string): Promise<ServiceResponse<Genre | null>> {
        try {
            const updatedGenre = await this.genreRepository.updateGenreAsync(id, name);
            const { created_at, deleted_at, ...safeGenre } = updatedGenre;
            return ServiceResponse.success<Genre>("Genre updated successfully", safeGenre as Genre);
        } catch (ex) {
            const errorMessage = `Error updating genre: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while updating the genre.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deleteGenre(id: string): Promise<ServiceResponse<null>> {
        try {
            const deletedGenre = await this.genreRepository.deleteGenreAsync(id);
            if (!deletedGenre) {
                return ServiceResponse.failure("Genre not found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<null>("Genre removed successfully", null);
        } catch (ex) {
            const errorMessage = `Error removing genre: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while removing the genre.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
export const bookService = new BookService();
