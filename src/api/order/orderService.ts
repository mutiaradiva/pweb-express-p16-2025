import { StatusCodes } from "http-status-codes";
import type { Order, OrderItem } from "@/generated/prisma";
import { OrderRepository } from "./orderRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class OrderService {
    private repository: OrderRepository;

    constructor(repository: OrderRepository = new OrderRepository()) {
        this.repository = repository;
    }

    async findAll() {
        try {
            const orders = await this.repository.findAllAsync();
            if (!orders.length)
                return ServiceResponse.failure("No transactions found", null, StatusCodes.NOT_FOUND);
            return ServiceResponse.success("Transactions found", orders);
        } catch (err) {
            logger.error(`Error fetching transactions: ${String(err)}`);
            return ServiceResponse.failure("Error fetching transactions", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async findById(id: string) {
        try {
            const order = await this.repository.findByIdAsync(id);
            if (!order)
                return ServiceResponse.failure("Transaction not found", null, StatusCodes.NOT_FOUND);
            return ServiceResponse.success("Transaction detail found", order);
        } catch (err) {
            logger.error(`Error fetching transaction ${id}: ${String(err)}`);
            return ServiceResponse.failure("Error fetching transaction detail", null, StatusCodes.INTERNAL_SERVER_ERROR);
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
