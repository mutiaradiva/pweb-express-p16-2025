import { StatusCodes } from "http-status-codes";
import type { Order, OrderItem } from "@/generated/prisma";
import { OrderRepository } from "./orderRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/utils/prisma";

type OrderResponse = {
    id: string,
    total_quantity: number,
    total_price: number,
}

export class OrderService {
    private repository: OrderRepository;

    constructor(repository: OrderRepository = new OrderRepository()) {
        this.repository = repository;
    }

    async createOrder(data: any) {
        try {
            const bookIds = data.order_items.map((item: { book_id: string }) => item.book_id);
            const books = await prisma.book.findMany({
                where: { id: { in: bookIds } },
                select: { id: true, stock_quantity: true, price: true }
            });

            const bookMap = new Map(books.map(book => [book.id, book]));

            for (const item of data.order_items) {
                const book = bookMap.get(item.book_id);
                if (!book) {
                    throw new Error(`Book ID ${item.book_id} not found`);
                }
                if (item.quantity > book.stock_quantity) {
                    throw new Error(
                        `Insufficient stock for book ID ${item.book_id}. Available: ${book.stock_quantity}, Requested: ${item.quantity}`
                    );
                }
            }

            const newOrder = await prisma.$transaction(async (tx) => {
                const order = await this.repository.createOrderAsync(data, tx);

                await Promise.all(
                    data.order_items.map((item: { book_id: string; quantity: number }) =>
                        tx.book.update({
                            where: { id: item.book_id },
                            data: { stock_quantity: { decrement: item.quantity } }
                        })
                    )
                );

                return order;
            });

            const totalPrice = newOrder.order_items.reduce(
                (sum, item) => sum + item.quantity * (bookMap.get(item.book_id)?.price ?? 0),
                0
            );
            const totalQuantity = newOrder.order_items.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            const response = {
                id: newOrder.id,
                total_quantity: totalQuantity,
                total_price: totalPrice,
            };

            return ServiceResponse.success(
                "Transaction created successfully",
                response,
                StatusCodes.CREATED
            );
        } catch (ex) {
            logger.error(`Error creating order: ${(ex as Error).message}`);
            if ((ex as Error).message.startsWith("Insufficient stock") ||
                (ex as Error).message.includes("not found")) {
                return ServiceResponse.failure((ex as Error).message, null, StatusCodes.BAD_REQUEST);
            }
            return ServiceResponse.failure(
                "Error creating order",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAll() {
        try {
            const orders = await this.repository.findAllAsync();
            const response: OrderResponse[] = [];
            for (const order of orders) {
                const items: OrderItem[] = order.order_items;
                let totalPrice = 0;
                for (const item of items) {
                    const book = await prisma.book.findUnique({
                        where: { id: item.book_id },
                        select: { price: true },
                    });
                    if (book) {
                        totalPrice += item.quantity * book.price;
                    }
                }
                response.push({
                    id: order.id,
                    total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
                    total_price: totalPrice,
                });
            }
            if (!orders.length)
                return ServiceResponse.failure("No transactions found", null, StatusCodes.NOT_FOUND);


            return ServiceResponse.success("Get all transaction successfully", response);
        } catch (err) {
            logger.error(`Error fetching transactions: ${String(err)}`);
            return ServiceResponse.failure("Error fetching transactions", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getTransactionDetail(id: string): Promise<ServiceResponse<any>> {
        try {
            const order = await this.repository.findTransactionByIdAsync(id);
            if (!order) {
                return ServiceResponse.failure(
                    "Transaction not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            const items = order.order_items.map((item) => ({
                book_id: item.book.id,
                book_title: item.book.title,
                quantity: item.quantity,
                subtotal_price: item.quantity * item.book.price,
            }));

            const total_quantity = items.reduce((sum, item) => sum + item.quantity, 0);
            const total_price = items.reduce((sum, item) => sum + item.subtotal_price, 0);

            const response = {
                id: order.id,
                items,
                total_quantity,
                total_price,
            };

            return ServiceResponse.success(
                "Get transaction detail successfully",
                response,
                StatusCodes.OK
            );
        } catch (ex) {
            logger.error(`Error retrieving transaction detail: ${(ex as Error).message}`);
            return ServiceResponse.failure(
                "Error retrieving transaction detail",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getStatistics() {
        try {
            const stats = await this.repository.getStatisticsAsync();
            return ServiceResponse.success("Transaction statistics retrieved", {
                totalTransactions: stats.totalTransactions,
                averageTransactionValue: Math.round(stats.averageTransactionValue),
                mostGenre: stats.mostGenre || "N/A",
                leastGenre: stats.leastGenre || "N/A",
            });
        } catch (err) {
            logger.error(`Error fetching transaction statistics: ${String(err)}`);
            return ServiceResponse.failure("Error fetching statistics", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

}

export const orderService = new OrderService();
