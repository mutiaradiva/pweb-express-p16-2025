import type { Request, RequestHandler, Response } from "express";

import { bookService } from "./bookService";

class BookController {

    public addBook: RequestHandler = async (req: Request, res: Response) => {
        const { title, writer, publisher, publication_year, description, price, stock_quantity, genre_id } = req.body;

        const serviceResponse = await bookService.addBook({
            title,
            writer,
            publisher,
            publication_year,
            description,
            price,
            stock_quantity,
            genre_id,
        });
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public getBooks: RequestHandler = async (_req: Request, res: Response) => {
        const serviceResponse = await bookService.findAllBooks();
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public getBooksByGenre: RequestHandler = async (req: Request, res: Response) => {
        const { genre_id } = req.params;
        const serviceResponse = await bookService.findBookByGenre(genre_id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public getBookByID: RequestHandler = async (req: Request, res: Response) => {
        const { id } = req.params;
        const serviceResponse = await bookService.findBookByID(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public updateBook: RequestHandler = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { title, writer, publisher, publication_year, description, price, stock_quantity, genre_id } = req.body;
        const serviceResponse = await bookService.updateBook(
            id,
            {
                title,
                writer,
                publisher,
                publication_year,
                description,
                price,
                stock_quantity,
                genre_id,
            },
        );
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public deleteBook: RequestHandler = async (req: Request, res: Response) => {
        const { id } = req.params;
        const serviceResponse = await bookService.deleteBook(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public getGenres: RequestHandler = async (_req: Request, res: Response) => {
        const serviceResponse = await bookService.findAllGenres();
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }
    public createGenre: RequestHandler = async (req: Request, res: Response) => {
        const { name } = req.body;
        const serviceResponse = await bookService.createGenre(name);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public getGenre: RequestHandler = async (req: Request, res: Response) => {
        const { id } = req.params;
        const serviceResponse = await bookService.findGenreByID(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public updateGenre: RequestHandler = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name } = req.body;
        const serviceResponse = await bookService.updateGenre(id, name);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public deleteGenre: RequestHandler = async (req: Request, res: Response) => {
        const { id } = req.params;
        const serviceResponse = await bookService.deleteGenre(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }
}

export const bookController = new BookController();
