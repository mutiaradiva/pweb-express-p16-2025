import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";

class UserController {
    public getUsers: RequestHandler = async (_req: Request, res: Response) => {
        const serviceResponse = await userService.findAll();
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public getUser: RequestHandler = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const serviceResponse = await userService.findById(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public login: RequestHandler = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const serviceResponse = await userService.login(email, password);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public getMe: RequestHandler = async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        const serviceResponse = await userService.getMe(userId);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public register: RequestHandler = async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        const serviceResponse = await userService.register(username, email, password);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

}

export const userController = new UserController();
