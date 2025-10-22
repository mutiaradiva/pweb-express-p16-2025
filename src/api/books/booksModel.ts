import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// ===== GENRE =====
export const GenreSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type Genre = z.infer<typeof GenreSchema>;

export const CreateGenreSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Genre name must be at least 2 characters"),
  }),
});

export const UpdateGenreSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: z.object({
    name: z.string().min(2).optional(),
  }),
});

// ===== BOOK =====
export const BookSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  writer: z.string(),
  publisher: z.string(),
  publication_year: z.number().int(),
  description: z.string().nullable(),
  price: z.number(),
  stock_quantity: z.number().int(),
  genre_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
  genre: GenreSchema.optional(),
});

export type Book = z.infer<typeof BookSchema>;

export const CreateBookSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Book title is required"),
    writer: z.string().min(1, "Writer name is required"),
    publisher: z.string().min(1, "Publisher name is required"),
    publication_year: z.number().int().min(0),
    description: z.string().optional(),
    price: z.number().positive(),
    stock_quantity: z.number().int().nonnegative(),
    genre_id: z.string().uuid(),
  }),
});

export const UpdateBookSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: z.object({
    title: z.string().optional(),
    writer: z.string().optional(),
    publisher: z.string().optional(),
    publication_year: z.number().int().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock_quantity: z.number().int().optional(),
    genre_id: z.string().uuid().optional(),
  }),
});