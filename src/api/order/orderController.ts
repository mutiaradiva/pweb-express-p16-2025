import type { Request, Response, RequestHandler } from "express";
import { orderService } from "./orderService";

class OrderController {
    public getAllTransactions: RequestHandler = async (_req: Request, res: Response) => {
        const response = await orderService.findAll();
        res.status(response.statusCode).json(response);
    };

    public getTransactionDetail: RequestHandler = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const response = await orderService.findById(id);
        res.status(response.statusCode).json(response);
    };

    public getTransactionStatistics: RequestHandler = async (_req: Request, res: Response) => {
        const response = await orderService.getStatistics();
        res.status(response.statusCode).json(response);
    };
}

export const orderController = new OrderController();
