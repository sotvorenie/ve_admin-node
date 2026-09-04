import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import {z} from "zod";
import {db} from "@/db.js";

import {asyncHandler} from "@utils/asyncHandler.js";
import {registrationException, authException} from "@utils/httpExceptions.js";
import {createJWTToken, getUser} from "@utils/auth.js";

export const authRouter = Router();

const authBaseSchema = z.object({
    password: z.string(),
    login: z.string(),
})

const authResponse = (
    res: Response,
    user: { id: number; name: string; password?: string; [key: string]: any },
) => {
    const {password, ...userWithoutPassword} = user

    return res.status(201).jsonp({
        user: userWithoutPassword,
        createJWTToken: createJWTToken(user.id)
    })
}

const nameSchema = z.object({
    name: z.string(),
})
authRouter.post('/register', asyncHandler(async (req: Request, res: Response) => {
    const {login, password, name} = nameSchema.extend(authBaseSchema.shape).parse(req.body)

    const existingUser = await db.admin.findUnique({
        where: {
            login
        },
        select: {
            id: true
        }
    })
    if (existingUser) throw registrationException

    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = await db.admin.create({
        data: {
            login,
            name: name.trim(),
            password: hashedPassword
        }
    })

    console.log(`Админ ${newAdmin.name} зарегистрировался в админке`)

    return authResponse(res, newAdmin)
}))

authRouter.post('/login', asyncHandler(async (req: Request, res: Response) => {
    const {login, password} = authBaseSchema.parse(req.body)

    const user = await db.admin.findUnique({
        where: {login},
        select: {
            id: true,
            login: true,
            password: true,
            name: true,
        }
    })
    if (!user) throw authException

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)  throw authException

    console.log(`Админ ${user.name} авторизовался в админке`)

    return authResponse(res, user)
}))

authRouter.get('/me', getUser(), asyncHandler(async (req: Request, res: Response) => {
    return authResponse(res, req.user!)
}))
