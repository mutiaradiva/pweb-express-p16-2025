import { StatusCodes } from "http-status-codes";
import type { Book, Genre } from "@/generated/prisma";
import { BookRepository, GenreRepository } from "./bookRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

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

    async findAllBooks(): Promise<ServiceResponse<Book[] | null>> {
        try {
            const books = await this.bookRepository.findAllAsync();
            if (!books || books.length === 0) {
                return ServiceResponse.failure("No Books found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<Book[]>("Books found", books);
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

    async findAllGenres(): Promise<ServiceResponse<Genre[] | null>> {
        try {
            const genres = await this.genreRepository.findAllAsync();
            if (!genres || genres.length === 0) {
                return ServiceResponse.failure("No Genres found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<Genre[]>("Genres found", genres);
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

    async createGenre(name: string): Promise<ServiceResponse<Genre | null>> {
        try {
            const newGenre = await this.genreRepository.createGenreAsync(name);
            return ServiceResponse.success<Genre>("Genre created successfully", newGenre, StatusCodes.CREATED);
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

    async findGenreByID(id: string): Promise<ServiceResponse<Genre | null>> {
        try {
            const genre = await this.genreRepository.findByIDAsync(id);
            if (!genre) {
                return ServiceResponse.failure("Genre not found", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<Genre>("Genre found", genre);
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
            return ServiceResponse.success<Genre>("Genre updated successfully", updatedGenre);
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

    async deleteGenre(id: string): Promise<ServiceResponse<Genre | null>> {
        try {
            const deletedGenre = await this.genreRepository.deleteGenreAsync(id);
            return ServiceResponse.success<Genre>("Genre deleted successfully", deletedGenre);
        } catch (ex) {
            const errorMessage = `Error deleting genre: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while deleting the genre.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
export const bookService = new BookService();
