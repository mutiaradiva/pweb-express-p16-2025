import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { BookSchema, CreateBookSchema, GenreSchema } from "@/api/library/bookModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { bookController } from "./bookController";
import { authMiddleware } from "@/common/middleware/authHandler";

export const bookRegistry = new OpenAPIRegistry();
export const bookRouter: Router = express.Router();

export const genreRegistry = new OpenAPIRegistry();
export const genreRouter: Router = express.Router();

bookRegistry.register("Book", BookSchema);
genreRegistry.register("Genre", GenreSchema);

bookRegistry.registerPath({
    method: "get",
    path: "/books",
    tags: ["Books"],
    responses: createApiResponse(z.array(BookSchema), "Success"),
});

bookRouter.get("/", authMiddleware, bookController.getBooks);

bookRegistry.registerPath({
    method: "post",
    path: "/books",
    tags: ["Books"],
    responses: createApiResponse(BookSchema, "Book created successfully")
});

bookRouter.post("/", authMiddleware, validateRequest(CreateBookSchema), bookController.addBook);

bookRegistry.registerPath({
    method: "get",
    path: "/books/:genre_id",
    tags: ["Books"],
    responses: createApiResponse(z.array(BookSchema), "Success")
});

bookRouter.get("/genre/:genre_id", authMiddleware, bookController.getBooksByGenre);

bookRegistry.registerPath({
    method: "get",
    path: "/books/:id",
    tags: ["Books"],
    responses: createApiResponse(BookSchema, "Success"),
});

bookRouter.get("/:id", authMiddleware, bookController.getBookByID);

bookRegistry.registerPath({
    method: "patch",
    path: "/books/:id",
    tags: ["Books"],
    responses: createApiResponse(BookSchema, "Book updated successfully")
});
bookRouter.patch("/:id", authMiddleware, bookController.updateBook);

bookRegistry.registerPath({
    method: "delete",
    path: "/books/:id",
    tags: ["Books"],
    responses: createApiResponse(z.null(), "Book removed successfully")
});
bookRouter.delete("/:id", authMiddleware, bookController.deleteBook);

genreRegistry.registerPath({
    method: "get",
    path: "/genre",
    tags: ["Books"],
    responses: createApiResponse(z.array(GenreSchema), "Success"),
});

genreRouter.get("/", authMiddleware, bookController.getGenres);

genreRegistry.registerPath({
    method: "post",
    path: "/genre",
    tags: ["Genre"],
    responses: createApiResponse(GenreSchema, "Genre created successfully")
});

genreRouter.post("/", authMiddleware, bookController.createGenre);

genreRegistry.registerPath({
    method: "get",
    path: "/genre/:id",
    tags: ["Genre"],
    responses: createApiResponse(GenreSchema, "Success"),
});

genreRouter.get("/:id", authMiddleware, bookController.getGenre);

genreRegistry.registerPath({
    method: "put",
    path: "/genre/:id",
    tags: ["Genre"],
    responses: createApiResponse(GenreSchema, "Genre updated successfully")
});

genreRouter.patch("/:id", authMiddleware, bookController.updateGenre);

genreRegistry.registerPath({
    method: "delete",
    path: "/genre/:id",
    tags: ["Genre"],
    responses: createApiResponse(GenreSchema, "Genre deleted successfully")
});

genreRouter.delete("/:id", authMiddleware, bookController.deleteGenre);
