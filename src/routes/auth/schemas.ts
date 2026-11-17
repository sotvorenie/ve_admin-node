import {z} from "zod";

import {passwordSchema} from "@/schemas/passwordSchema.js";

export const authBaseSchema = z.object({
    login: z.string(),
}).extend(passwordSchema.shape)