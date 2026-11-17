import jwt from 'jsonwebtoken';
import {type NextFunction, type Request, type Response} from 'express';
import {db} from "@/db.js";

import {jwtException} from "@utils/httpExceptions.js";

import {userSelect} from "@/selects/userSelect.js";

const SECRET_KEY: string = process.env.SECRET_KEY as string

interface Payload {
    sub?: string
    tokenVersion?: number
}

export const createJWTToken = (
    userId: number,
    tokenVersion: number,
) => {
    const expiresIn = 60 * 60 * 24 * 7
    const payload = {
        sub: String(userId),
        tokenVersion,
    }
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

export const getUser = (
    required: boolean = true,
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const deny = () => res.status(jwtException.status).json({ detail: jwtException.detail })
        const pass = () => next()

        try {
            const authHeader = req.headers.authorization
            if (!authHeader?.startsWith('Bearer ')) {
                return required ? deny() : pass()
            }

            const token = authHeader.slice('Bearer '.length)
            let payload: Payload
            try {
                payload = jwt.verify(token, SECRET_KEY) as Payload
            } catch {
                return required ? deny() : pass()
            }

            const user = await db.admin.findUnique({
                where: { id: Number(payload.sub) },
                select: userSelect,
            })
            if (!user) {
                return required ? deny() : pass()
            }
            if ((payload.tokenVersion ?? 0) !== user.tokenVersion) {
                return required ? deny() : pass()
            }
            req.user = user

            pass()
        } catch (err) {
            return next(err)
        }
    }
}