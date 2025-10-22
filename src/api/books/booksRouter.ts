import { Router } from "express";
import { bookController } from "./bookController";

const router = Router();

// ===== GENRE =====
router.get("/genres", bookController.getGenres);
router.get("/genres/:id", bookController.getGenreById);
router.post("/genres", bookController.createGenre);
router.patch("/genres/:id", bookController.updateGenre);
router.delete("/genres/:id", bookController.deleteGenre);

// ===== BOOK =====
router.get("/books", bookController.getBooks);
router.get("/books/:id", bookController.getBookById);
router.post("/books", bookController.createBook);
router.patch("/books/:id", bookController.updateBook);
router.delete("/books/:id", bookController.deleteBook);

export default router;