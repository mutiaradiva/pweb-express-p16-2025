import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
    id: z.string().uuid(),
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});

export const CreateUserSchema = z.object({
    body: z.object({
        username: z.string().optional(),
        password: z.string().min(6),
        email: z.string().email(),
    }),
});

export const UpdateUserSchema = z.object({
    params: z.object({ id: commonValidations.id }),
    body: z.object({
        username: z.string().optional(),
        password: z.string().min(6).optional(),
        email: z.string().email().optional(),
    }),
});
