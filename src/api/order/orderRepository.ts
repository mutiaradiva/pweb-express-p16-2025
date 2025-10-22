import prisma from "@/common/utils/prisma";
import type { Order, Prisma } from "@/generated/prisma";
import { CreateOrderInput } from "./orderModel";

export class OrderRepository {

    async createOrderAsync(
        data: {
            user_id: string;
            order_items: { book_id: string; quantity: number }[];
        },
        tx?: Prisma.TransactionClient
    ) {
        const prismaClient = tx || prisma;
        return prismaClient.order.create({
            data: {
                user_id: data.user_id,
                order_items: {
                    create: data.order_items.map((item) => ({
                        book_id: item.book_id,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                order_items: {
                    include: {
                        book: { select: { title: true, price: true } },
                    },
                },
                user: {
                    select: { id: true, email: true, username: true },
                },
            },
        });
    }

    async findAllAsync() {
        return prisma.order.findMany({
            include: {
                order_items: {
                    include: {
                        book: true,
                    },
                },
            },
            orderBy: { created_at: "desc" },
        });
    }

    async checkBookQuantityAsync(book_id: string): Promise<number> {
        const book = await prisma.book.findUnique({
            where: { id: book_id },
            select: { stock_quantity: true },
        });
        return book ? book.stock_quantity : 0;
    }

    async decreaseBookQuantityAsync(book_id: string, quantity: number): Promise<void> {
        await prisma.book.update({
            where: { id: book_id },
            data: {
                stock_quantity: {
                    decrement: quantity,
                },
            },
        });
    }

    async findTransactionByIdAsync(id: string) {
        return prisma.order.findUnique({
            where: { id },
            include: {
                order_items: {
                    include: {
                        book: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async getStatisticsAsync() {
        const totalTransactions = await prisma.order.count();

        const orderTotals = await prisma.order.findMany({
            select: {
                id: true,
                order_items: {
                    select: {
                        quantity: true,
                        book: { select: { price: true } },
                    },
                },
            },
        });

        const totalAmountAllOrders = orderTotals.reduce((sum, order) => {
            const orderTotal = order.order_items.reduce(
                (acc, item) => acc + item.quantity * item.book.price,
                0
            );
            return sum + orderTotal;
        }, 0);

        const averageTransactionValue =
            totalTransactions > 0 ? totalAmountAllOrders / totalTransactions : 0;

        const genreSales = await prisma.orderItem.groupBy({
            by: ["book_id"],
            _sum: { quantity: true },
        });

        const bookGenres = await prisma.book.findMany({
            select: { id: true, genre_id: true },
        });

        const genreMap = new Map<string, number>();
        for (const sale of genreSales) {
            const book = bookGenres.find((b) => b.id === sale.book_id);
            if (!book) continue;
            const current = genreMap.get(book.genre_id) || 0;
            genreMap.set(book.genre_id, current + (sale._sum.quantity || 0));
        }

        const genreArray = Array.from(genreMap.entries()).map(([genre_id, count]) => ({
            genre_id,
            count,
        }));

        genreArray.sort((a, b) => b.count - a.count);

        let mostGenre = null;
        let leastGenre = null;

        if (genreArray.length > 0) {
            const [top] = genreArray;
            const [bottom] = [...genreArray].reverse();

            mostGenre = await prisma.genre.findUnique({ where: { id: top.genre_id } });
            leastGenre = await prisma.genre.findUnique({ where: { id: bottom.genre_id } });
        }

        return {
            totalTransactions,
            averageTransactionValue,
            mostGenre: mostGenre ? mostGenre.name : null,
            leastGenre: leastGenre ? leastGenre.name : null,
        };
    }

}
