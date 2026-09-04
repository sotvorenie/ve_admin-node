import { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';

import { dbException } from "@utils/httpExceptions.js";

export const asyncHandler = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        req.checkAborted = () => {
            if (req.signal?.aborted) {
                const err = new Error('Request aborted')
                err.name = 'AbortError'
                throw err
            }
            return false
        }
        if (req.signal?.aborted) return
        try {
            req.checkAborted()
            await fn(req, res, next)
            req.checkAborted()
        } catch (err: any) {
            if (err?.name === 'AbortError') return
            if (err instanceof ZodError) {
                return res.status(400).json({
                    error: "Ошибка валидации данных",
                    details: err.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
                })
            }
            if (err?.code === 'P2002') {
                return res.status(409).json({
                    error: "Запись с такими уникальными данными уже существует"
                })
            }
            if (err.status && err.detail) return res.status(err.status).json({ detail: err.detail })
            res.status(dbException.status).json({ error: dbException.detail })
        }
    }
}