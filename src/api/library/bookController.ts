import type { Request, RequestHandler, Response } from "express";

import { bookService } from "./bookService";

class BookController {
    public getBooks: RequestHandler = async (_req: Request, res: Response) => {
        const serviceResponse = await bookService.findAllBooks();
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
}

export const bookController = new BookController();
