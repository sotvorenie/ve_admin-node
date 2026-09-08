import { type Request, type Response } from 'express';
import { ZodError } from 'zod';

import {abortedException, AppError, dbException} from "@utils/httpExceptions.js";

export const asyncHandler = (fn: Function) => {
    return async (req: Request, res: Response) => {
        try {
            await fn(req, res)
        } catch (err: any) {
            if (err?.name === 'AbortError' || err === abortedException) return
            if (err instanceof ZodError) {
                return res.status(400).json({
                    detail: "Ошибка валидации данных",
                    details: err.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
                })
            }
            if (err?.code === 'P2002') return res.status(409).json({detail: "Запись с такими уникальными данными уже существует"})
            if (err instanceof AppError) return res.status(err.status).json({ detail: err.detail })
            res.status(dbException.status).json({ detail: dbException.detail })
        }
    }
}