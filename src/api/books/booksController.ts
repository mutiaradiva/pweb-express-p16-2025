import { Request, Response } from "express";
import { booksService } from "./booksService";
import { CreateBookSchema, UpdateBookSchema } from "./booksModel";

export const booksController = {
  async create(req: Request, res: Response) {
    try {
      const parsed = CreateBookSchema.parse({ body: req.body });
      const book = await booksService.createBook(parsed.body);
      res.status(201).json({ message: "Book created", data: book });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const result = await booksService.getAllBooks(req.query);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getDetail(req: Request, res: Response) {
    try {
      const book = await booksService.getBookById(req.params.id);
      res.status(200).json(book);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async getByGenre(req: Request, res: Response) {
    try {
      const genreId = req.params.genre_id;
      const result = await booksService.getBooksByGenre(genreId, req.query);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const parsed = UpdateBookSchema.parse({
        params: req.params,
        body: req.body,
      });
      const book = await booksService.updateBook(parsed.params.id, parsed.body);
      res.status(200).json({ message: "Book updated", data: book });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await booksService.deleteBook(id);
      res.status(200).json({ message: "Book deleted" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};