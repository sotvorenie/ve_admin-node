import { Router, type Request, type Response } from 'express';

import {logIn, register} from "@routes/auth/services/index.js";
import {authResponse} from "@routes/auth/responses.js";
import {authBaseSchema} from "@routes/auth/schemas.js";

import {asyncHandler} from "@utils/asyncHandler.js";
import {getUser} from "@utils/auth.js";

import {nameSchema} from "@/schemas/nameSchema.js";

export const authRouter = Router();

authRouter.post('/register', asyncHandler(async (req: Request, res: Response) => {
    const {login, password, name} = nameSchema.extend(authBaseSchema.shape).parse(req.body)

    const newAdmin = await register(login, password, name)

    return authResponse(res, newAdmin)
}))

authRouter.post('/login', asyncHandler(async (req: Request, res: Response) => {
    const {login, password} = authBaseSchema.parse(req.body)

    const admin = await logIn(login, password)

    return authResponse(res, admin)
}))

authRouter.get('/me', getUser(), asyncHandler(async (req: Request, res: Response) => {
    return authResponse(res, req.user!)
}))
