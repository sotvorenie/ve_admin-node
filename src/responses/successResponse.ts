import { type Response } from 'express';

export const successResponse = (res: Response) => {
    return res.status(204)
}