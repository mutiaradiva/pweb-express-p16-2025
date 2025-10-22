import { booksService } from "../booksService";
import { booksRepository } from "../booksRepository";

jest.mock("../booksRepository");

describe("Books Service", () => {
  const mockBook = {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    stock: 10,
    price: 150000,
    genreId: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBook()", () => {
    it("should create a new book if title is unique", async () => {
      (booksRepository.findByTitle as jest.Mock).mockResolvedValue(null);
      (booksRepository.create as jest.Mock).mockResolvedValue(mockBook);

      const result = await booksService.createBook(mockBook);

      expect(booksRepository.findByTitle).toHaveBeenCalledWith("Clean Code");
      expect(booksRepository.create).toHaveBeenCalled();
      expect(result.title).toBe("Clean Code");
    });

    it("should throw error if duplicate title exists", async () => {
      (booksRepository.findByTitle as jest.Mock).mockResolvedValue(mockBook);

      await expect(booksService.createBook(mockBook)).rejects.toThrow("Book title already exists");
    });
  });

  describe("getBookById()", () => {
    it("should return a book if found", async () => {
      (booksRepository.findById as jest.Mock).mockResolvedValue(mockBook);

      const result = await booksService.getBookById(1);
      expect(result.title).toBe("Clean Code");
    });

    it("should throw error if not found", async () => {
      (booksRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(booksService.getBookById(99)).rejects.toThrow("Book not found");
    });
  });

  describe("updateBook()", () => {
    it("should update a book successfully", async () => {
      (booksRepository.findById as jest.Mock).mockResolvedValue(mockBook);
      (booksRepository.update as jest.Mock).mockResolvedValue({
        ...mockBook,
        stock: 20,
      });

      const updated = await booksService.updateBook(1, { stock: 20 });

      expect(updated.stock).toBe(20);
      expect(booksRepository.update).toHaveBeenCalled();
    });
  });

  describe("deleteBook()", () => {
    it("should delete a book successfully", async () => {
      (booksRepository.findById as jest.Mock).mockResolvedValue(mockBook);
      (booksRepository.delete as jest.Mock).mockResolvedValue({});

      const result = await booksService.deleteBook(1);

      expect(result.message).toBe("Book deleted successfully");
      expect(booksRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});