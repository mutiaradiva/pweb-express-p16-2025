import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { GetOrderSchema, OrderSchema } from "@/api/order/orderModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { orderController } from "./orderController";

export const orderRegistry = new OpenAPIRegistry();
export const orderRouter: Router = express.Router();

orderRegistry.register("Order", OrderSchema);

orderRegistry.registerPath({
    method: "get",
    path: "/orders",
    tags: ["Order"],
    responses: createApiResponse(z.array(OrderSchema), "Success"),
});

orderRouter.get("/", orderController.getAllTransactions);

orderRegistry.registerPath({
    method: "get",
    path: "/orders/statistics",
    tags: ["Order"],
    responses: createApiResponse(z.array(OrderSchema), "Success"),
});

orderRouter.get("/statistics", orderController.getTransactionStatistics);

orderRegistry.registerPath({
    method: "get",
    path: "/orders/:id",
    tags: ["Order"],
    responses: createApiResponse(GetOrderSchema, "Success"),
});

orderRouter.get("/:id", validateRequest(GetOrderSchema), orderController.getTransactionDetail);
