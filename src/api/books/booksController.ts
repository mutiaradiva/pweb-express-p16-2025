import type { Request, RequestHandler, Response } from "express";
import { bookService } from "./bookService";

class BookController {
  // ===== BOOK =====
  public getBooks: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await bookService.findAllBooks();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getBookById: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await bookService.findBookById(req.params.id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createBook: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await bookService.createBook(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateBook: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await bookService.updateBook(req.params.id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteBook: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await bookService.deleteBook(req.params.id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // ===== GENRE =====
  public getGenres: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await bookService.findAllGenres();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getGenreById: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await bookService.findGenreById(req.params.id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createGenre: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await bookService.createGenre(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateGenre: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await bookService.updateGenre(req.params.id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteGenre: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await bookService.deleteGenre(req.params.id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const bookController = new BookController();