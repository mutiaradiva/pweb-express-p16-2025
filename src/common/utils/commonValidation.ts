import { z } from "zod";

export const commonValidations = {
    id: z.string().uuid({ message: "ID must be a valid UUID" }),
    // ... other common validations
};
