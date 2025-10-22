import type { Request, Response, RequestHandler } from "express";
import { orderService } from "./orderService";

class OrderController {
    public createOrder: RequestHandler = async (req: Request, res: Response) => {
        const { user_id, items } = req.body;

        const serviceResponse = await orderService.createOrder({
            user_id,
            order_items: items,
        });
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public getAllTransactions: RequestHandler = async (_req: Request, res: Response) => {
        const response = await orderService.findAll();
        res.status(response.statusCode).json(response);
    };

    public getTransactionDetail: RequestHandler = async (req: Request, res: Response) => {
        const id = req.params.id;

        const serviceResponse = await orderService.getTransactionDetail(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public getTransactionStatistics: RequestHandler = async (_req: Request, res: Response) => {
        const response = await orderService.getStatistics();
        res.status(response.statusCode).json(response);
    };
}

export const orderController = new OrderController();
