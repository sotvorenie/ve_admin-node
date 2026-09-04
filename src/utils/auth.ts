import jwt from 'jsonwebtoken';
import {type NextFunction, type Request, type Response} from 'express';
import {db} from "@/db.js";

import {jwtException} from "@utils/httpExceptions.js";
import {asyncHandler} from "@utils/asyncHandler.js";

const SECRET_KEY: string = process.env.SECRET_KEY as string

export const createJWTToken = (userId: number | string) => {
    const expiresIn = 60 * 60 * 24 * 7
    const payload = {sub: String(userId)}
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

export const getUser = (required: boolean = true) => {
    return asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            if (required) throw jwtException
            return next()
        }

        const token = authHeader.split(' ')[1] as string
        let payload: { sub: string }

        try {
            payload = jwt.verify(token, SECRET_KEY) as { sub: string }
        } catch {
            throw jwtException
        }

        const user = await db.admin.findUnique({
            where: { id: Number(payload.sub) }
        })
        if (!user && required) throw jwtException

        if (user) req.user = user
        next()
    })
}