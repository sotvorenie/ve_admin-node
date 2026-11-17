import {z} from "zod";

export const schemas = z.object({
    old_password: z.string(),
})