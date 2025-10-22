import { Router } from "express";
import { booksController } from "./booksController";

const router = Router();

router.post("/", booksController.create);
router.get("/", booksController.getAll);
router.get("/:id", booksController.getDetail);
router.get("/genre/:genre_id", booksController.getByGenre);
router.patch("/:id", booksController.update);
router.delete("/:id", booksController.remove);

export default router;