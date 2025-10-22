import express from "express";
import request from "supertest";
import booksRouter from "../booksRouter";
import { booksService } from "../booksService";

jest.mock("../booksService");

const app = express();
app.use(express.json());
app.use("/books", booksRouter);

describe("Books Router", () => {
  const mockBook = {
    id: 1,
    title: "Refactoring",
    author: "Martin Fowler",
    stock: 5,
    price: 200000,
    genreId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /books → creates a new book", async () => {
    (booksService.createBook as jest.Mock).mockResolvedValue(mockBook);

    const res = await request(app).post("/books").send(mockBook);

    expect(res.status).toBe(201);
    expect(res.body.book.title).toBe("Refactoring");
  });

  it("GET /books → returns paginated books", async () => {
    (booksService.getAllBooks as jest.Mock).mockResolvedValue({
      data: [mockBook],
      meta: { total: 1, page: 1, totalPages: 1 },
    });

    const res = await request(app).get("/books?page=1&limit=10");

    expect(res.status).toBe(200);
    expect(res.body.data[0].title).toBe("Refactoring");
  });

  it("GET /books/:book_id → returns book detail", async () => {
    (booksService.getBookById as jest.Mock).mockResolvedValue(mockBook);

    const res = await request(app).get("/books/1");

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Refactoring");
  });

  it("PATCH /books/:book_id → updates a book", async () => {
    const updatedBook = { ...mockBook, stock: 10 };
    (booksService.updateBook as jest.Mock).mockResolvedValue(updatedBook);

    const res = await request(app).patch("/books/1").send({ stock: 10 });

    expect(res.status).toBe(200);
    expect(res.body.book.stock).toBe(10);
  });

  it("DELETE /books/:book_id → deletes a book", async () => {
    (booksService.deleteBook as jest.Mock).mockResolvedValue({ message: "Book deleted successfully" });

    const res = await request(app).delete("/books/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Book deleted successfully");
  });
});