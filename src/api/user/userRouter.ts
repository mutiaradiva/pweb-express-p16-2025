import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { GetUserSchema, UserSchema, CreateUserSchema, LoginUserSchema } from "@/api/user/userModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
    method: "post",
    path: "/auth/register",
    tags: ["User"],
    request: {
        body: {
            content: {
                "application/json": { schema: CreateUserSchema.shape.body },
            },
        },
    },
    responses: createApiResponse(UserSchema, "Created"),
});
userRouter.post("/register", validateRequest(CreateUserSchema), userController.register);

userRegistry.registerPath({
    method: "post",
    path: "/auth/login",
    tags: ["User"],
    request: {
        body: {
            content: {
                "application/json": { schema: LoginUserSchema.shape.body },
            },
        },
    },
    responses: createApiResponse(UserSchema, "Login successful"),
});
userRouter.post("/login", userController.login);

userRegistry.registerPath({
    method: "get",
    path: "/auth/me",
    tags: ["User"],
    responses: createApiResponse(UserSchema, "Success"),
});
userRouter.get("/me", userController.getMe);
