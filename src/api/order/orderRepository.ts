import prisma from "@/common/utils/prisma";
import type { OrderItem, Order } from "@/generated/prisma";

export class OrderRepository {
    async findAllAsync(): Promise<Order[]> {
        return prisma.order.findMany({
            include: { order_items: true },
        });
    }
}

export class OrderItemRepository {
    async findAllAsync(): Promise<OrderItem[]> {
        return prisma.orderItem.findMany();
    }
}
