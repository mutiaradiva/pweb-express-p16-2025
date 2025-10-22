import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { AuthenticatedRequest } from "@/common/middleware/authHandler";

class UserController {

    public login: RequestHandler = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const serviceResponse = await userService.login(email, password);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public getMe = async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: token not found or invalid",
            });
        }

        const serviceResponse = await userService.getMe(userId);
        res.status(serviceResponse.statusCode).json(serviceResponse);
    };

    public register: RequestHandler = async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        const serviceResponse = await userService.register(username, email, password);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

}

export const userController = new UserController();
