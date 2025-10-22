import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const OrderItemSchema = z.object({
    id: z.string().uuid(),
    quantity: z.number().int().positive(),
    order_id: z.string().uuid(),
    book_id: z.string().uuid(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    created_at: z.date(),
    updated_at: z.date(),
    order_items: z.array(OrderItemSchema).optional(),
});

export type Order = z.infer<typeof OrderSchema>;

export const CreateOrderSchema = z.object({
    body: z.object({
        user_id: z.string().uuid(),
        items: z
            .array(
                z.object({
                    book_id: z.string().uuid(),
                    quantity: z.number().int().positive(),
                })
            )
            .min(1, "At least one item is required in an order"),
    }),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>["body"];

export const UpdateOrderSchema = z.object({
    params: z.object({ id: commonValidations.id }),
    body: z.object({
        items: z
            .array(
                z.object({
                    book_id: z.string().uuid(),
                    quantity: z.number().int().positive(),
                })
            )
            .optional(),
    }),
});

export const GetOrderSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});
