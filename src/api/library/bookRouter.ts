import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { BookSchema, GenreSchema } from "@/api/library/bookModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { bookController } from "./bookController";

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

bookRouter.get("/", bookController.getBooks);

genreRegistry.registerPath({
    method: "get",
    path: "/genre",
    tags: ["Books"],
    responses: createApiResponse(z.array(GenreSchema), "Success"),
});

genreRouter.get("/", bookController.getGenres);

genreRegistry.registerPath({
    method: "post",
    path: "/genre",
    tags: ["Genre"],
    responses: createApiResponse(GenreSchema, "Genre created successfully")
});

genreRouter.post("/", bookController.createGenre);
