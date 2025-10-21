import prisma from "@/common/utils/prisma";
import type { Order } from "@/generated/prisma";

export class OrderRepository {
    async findAllAsync() {
        return prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
            orderBy: { created_at: "desc" },
        });
    }

    async findByIdAsync(id: string): Promise<Order | null> {
        return prisma.order.findUnique({
            where: { id },
            include: {
                order_items: {
                    include: {
                        book: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });
    }

    async getStatisticsAsync() {
        // 1️⃣ Total transactions
        const totalTransactions = await prisma.order.count();

        // 2️⃣ Average transaction amount
        // Calculate total price for each order by joining OrderItem -> Book
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

        // 3️⃣ Genre with most and least transactions
        const genreSales = await prisma.orderItem.groupBy({
            by: ["book_id"],
            _sum: { quantity: true },
        });

        // Now map book_id -> genre_id
        const bookGenres = await prisma.book.findMany({
            select: { id: true, genre_id: true },
        });

        // Aggregate sales per genre
        const genreMap = new Map<string, number>();
        for (const sale of genreSales) {
            const book = bookGenres.find((b) => b.id === sale.book_id);
            if (!book) continue;
            const current = genreMap.get(book.genre_id) || 0;
            genreMap.set(book.genre_id, current + (sale._sum.quantity || 0));
        }

        // Convert to sortable array
        const genreArray = Array.from(genreMap.entries()).map(([genre_id, count]) => ({
            genre_id,
            count,
        }));

        // Sort descending
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
